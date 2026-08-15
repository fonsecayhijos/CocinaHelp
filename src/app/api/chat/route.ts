import { NextResponse } from "next/server";
import OpenAI from "openai";
import {
  buildSystemPrompt,
  detectLanguage,
  visionFallbackMessage,
} from "@/lib/botanic-prompt";
import {
  getBotanicModel,
  getXaiApiKey,
  getXaiBaseUrl,
} from "@/lib/config";
import type { Locale } from "@/lib/i18n/types";

export const runtime = "nodejs";
export const maxDuration = 90;

type ChatContentPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } };

type IncomingMessage = {
  role: "user" | "assistant" | "system";
  content: string | ChatContentPart[];
};

type ChatBody = {
  messages: IncomingMessage[];
  locale?: Locale;
  stream?: boolean;
};

const MAX_IMAGES_PER_MSG = 4;
const MAX_DATA_URL_LENGTH = 3_500_000;
const HISTORY_LIMIT = 30;
const KEEP_IMAGE_TURNS = 2;

function getClient(): OpenAI | null {
  const apiKey = getXaiApiKey();
  if (!apiKey) return null;
  return new OpenAI({ apiKey, baseURL: getXaiBaseUrl() });
}

function extractText(content: IncomingMessage["content"]): string {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("\n");
}

function messageHasImages(msg: IncomingMessage): boolean {
  return (
    Array.isArray(msg.content) &&
    msg.content.some((p) => p.type === "image_url")
  );
}

function sanitizeMessages(
  messages: IncomingMessage[],
  options: { stripAllImages?: boolean } = {},
): {
  apiMessages: OpenAI.Chat.ChatCompletionMessageParam[];
  hadImages: boolean;
} {
  const slice = messages.slice(-HISTORY_LIMIT);
  const userImageIndexes: number[] = [];
  slice.forEach((m, i) => {
    if (m.role === "user" && messageHasImages(m)) userImageIndexes.push(i);
  });
  const keepFrom =
    userImageIndexes.length > KEEP_IMAGE_TURNS
      ? userImageIndexes[userImageIndexes.length - KEEP_IMAGE_TURNS]
      : (userImageIndexes[0] ?? Infinity);

  const out: OpenAI.Chat.ChatCompletionMessageParam[] = [];
  let hadImages = false;

  for (let i = 0; i < slice.length; i++) {
    const msg = slice[i];
    if (msg.role !== "user" && msg.role !== "assistant") continue;

    if (typeof msg.content === "string") {
      const text = msg.content.trim();
      if (text) out.push({ role: msg.role, content: text });
      continue;
    }
    if (!Array.isArray(msg.content)) continue;

    if (msg.role === "assistant") {
      const text = extractText(msg.content).trim();
      if (text) out.push({ role: "assistant", content: text });
      continue;
    }

    const text = extractText(msg.content).trim();
    const images = msg.content.filter(
      (p): p is { type: "image_url"; image_url: { url: string } } =>
        p.type === "image_url" && Boolean(p.image_url?.url),
    );
    const allowImages =
      !options.stripAllImages && images.length > 0 && i >= keepFrom;

    if (allowImages) {
      const parts: OpenAI.Chat.ChatCompletionContentPart[] = [
        {
          type: "text",
          text:
            text ||
            "Please analyse this plant photo: what do you see and what should I do?",
        },
      ];
      let n = 0;
      for (const img of images) {
        const url = img.image_url.url;
        if (!url.startsWith("data:image/") && !url.startsWith("http")) continue;
        if (url.startsWith("data:image/") && url.length > MAX_DATA_URL_LENGTH) {
          throw new Error("IMAGE_TOO_LARGE");
        }
        n += 1;
        if (n > MAX_IMAGES_PER_MSG) break;
        hadImages = true;
        parts.push({
          type: "image_url",
          image_url: { url, detail: "high" },
        });
      }
      out.push({ role: "user", content: parts });
    } else if (images.length > 0) {
      out.push({
        role: "user",
        content: text
          ? `${text}\n\n[User attached ${images.length} plant photo(s) earlier.]`
          : `[User attached ${images.length} plant photo(s).]`,
      });
    } else if (text) {
      out.push({ role: "user", content: text });
    }
  }

  return { apiMessages: out, hadImages };
}

function lastUserText(messages: IncomingMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") return extractText(messages[i].content);
  }
  return "";
}

function lastUserHasImages(messages: IncomingMessage[]): boolean {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") return messageHasImages(messages[i]);
  }
  return false;
}

function errorMessage(err: unknown): string {
  if (err instanceof OpenAI.APIError) {
    return `${err.status ?? "error"}: ${err.message}`;
  }
  if (err instanceof Error) return err.message;
  return "Unexpected server error";
}

async function createSseStream(
  client: OpenAI,
  payload: {
    model: string;
    temperature: number;
    max_tokens: number;
    messages: OpenAI.Chat.ChatCompletionMessageParam[];
  },
) {
  const stream = await client.chat.completions.create({
    ...payload,
    stream: true,
  });
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content;
          if (delta) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: "delta", text: delta })}\n\n`,
              ),
            );
          }
        }
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "done", model: payload.model })}\n\n`,
          ),
        );
        controller.close();
      } catch (err) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "error", error: errorMessage(err) })}\n\n`,
          ),
        );
        controller.close();
      }
    },
  });
}

function staticSse(text: string, model: string) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: "delta", text })}\n\n`),
      );
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({ type: "done", model, visionFallback: true })}\n\n`,
        ),
      );
      controller.close();
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChatBody;
    const { messages } = body;
    const uiLocale: Locale =
      body.locale === "de" || body.locale === "en" || body.locale === "es"
        ? body.locale
        : "es";
    const wantStream = body.stream !== false;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "messages required" }, { status: 400 });
    }

    const client = getClient();
    if (!client) {
      return NextResponse.json(
        {
          error:
            "XAI_API_KEY missing. Add it to .env.local and restart `npm run dev`.",
          code: "MISSING_API_KEY",
        },
        { status: 503 },
      );
    }

    let sanitized: ReturnType<typeof sanitizeMessages>;
    try {
      sanitized = sanitizeMessages(messages);
    } catch (e) {
      if (e instanceof Error && e.message === "IMAGE_TOO_LARGE") {
        return NextResponse.json(
          { error: "Image too large. Use a smaller photo." },
          { status: 400 },
        );
      }
      throw e;
    }

    if (!sanitized.apiMessages.length) {
      return NextResponse.json(
        { error: "No valid message content." },
        { status: 400 },
      );
    }

    const model = getBotanicModel();
    const language = detectLanguage(lastUserText(messages), uiLocale);
    const system = buildSystemPrompt(language, sanitized.hadImages);
    const payload = {
      model,
      temperature: 0.45,
      max_tokens: 1200,
      messages: [
        { role: "system" as const, content: system },
        ...sanitized.apiMessages,
      ],
    };

    if (wantStream) {
      try {
        const readable = await createSseStream(client, payload);
        return new Response(readable, {
          headers: {
            "Content-Type": "text/event-stream; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
            "X-BotanicaHelp-Vision": sanitized.hadImages ? "1" : "0",
          },
        });
      } catch (err) {
        console.error("[api/chat] stream failed", err);
        if (lastUserHasImages(messages)) {
          try {
            const textOnly = sanitizeMessages(messages, {
              stripAllImages: true,
            });
            const readable = await createSseStream(client, {
              model,
              temperature: 0.4,
              max_tokens: 900,
              messages: [
                {
                  role: "system",
                  content:
                    buildSystemPrompt(language, false) +
                    "\nVision failed. Photos remain in the UI. Acknowledge them and ask what the user sees.",
                },
                ...textOnly.apiMessages,
              ],
            });
            return new Response(readable, {
              headers: {
                "Content-Type": "text/event-stream; charset=utf-8",
                "Cache-Control": "no-cache, no-transform",
                Connection: "keep-alive",
                "X-BotanicaHelp-Vision": "fallback",
              },
            });
          } catch {
            return new Response(
              staticSse(visionFallbackMessage(language), model),
              {
                headers: {
                  "Content-Type": "text/event-stream; charset=utf-8",
                  "Cache-Control": "no-cache, no-transform",
                },
              },
            );
          }
        }
        return NextResponse.json(
          { error: errorMessage(err) },
          { status: 500 },
        );
      }
    }

    try {
      const completion = await client.chat.completions.create({
        ...payload,
        stream: false,
      });
      return NextResponse.json({
        reply:
          completion.choices[0]?.message?.content?.trim() ||
          "No response from model.",
        model,
        language,
        vision: sanitized.hadImages,
      });
    } catch (err) {
      if (lastUserHasImages(messages)) {
        return NextResponse.json({
          reply: visionFallbackMessage(language),
          model,
          language,
          visionFallback: true,
        });
      }
      throw err;
    }
  } catch (err) {
    console.error("[api/chat]", err);
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 });
  }
}

export async function GET() {
  const hasKey = Boolean(getXaiApiKey());
  return NextResponse.json({
    ok: hasKey,
    model: getBotanicModel(),
    baseURL: getXaiBaseUrl(),
    status: hasKey ? "configured" : "missing_XAI_API_KEY",
    envHint: "Add XAI_API_KEY to .env.local and restart the dev server",
  });
}
