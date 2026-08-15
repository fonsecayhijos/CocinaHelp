"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { photoDefaultPrompt } from "@/lib/botanic-prompt";
import {
  fileToCompressedDataUrl,
  MAX_RAW_FILE_BYTES,
} from "@/lib/images";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  getPlan,
  getStoredPlanId,
  normalizePlanId,
  PLAN_CHANGED_EVENT,
  PLAN_ORDER,
  setStoredPlanId,
  type PlanId,
} from "@/lib/plans";
import {
  canAnalyzePhotos,
  canSendMessage,
  loadUsage,
  recordMessage,
  recordPhoto,
  remainingMessages,
  remainingPhotos,
  type UsageCounters,
} from "@/lib/usage";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  images?: string[];
};

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function formatMessage(text: string) {
  return text.split("\n").map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((chunk, j) => {
      if (chunk.startsWith("**") && chunk.endsWith("**")) {
        return (
          <strong key={j} className="font-semibold">
            {chunk.slice(2, -2)}
          </strong>
        );
      }
      return <span key={j}>{chunk}</span>;
    });
    return (
      <p key={i} className={`break-words ${i > 0 ? "mt-1.5" : ""}`}>
        {parts}
      </p>
    );
  });
}

export function BotanicaChat() {
  const { t, locale } = useLanguage();
  const a = t.assistant;

  const [planId, setPlanId] = useState<PlanId>("free");
  const [usage, setUsage] = useState<UsageCounters>({
    messages: 0,
    photos: 0,
    day: "",
    month: "",
  });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [pendingImages, setPendingImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiReady, setApiReady] = useState<boolean | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const limits = getPlan(planId).limits;
  const msgsLeft = remainingMessages(limits, usage.messages);
  const photosLeft = remainingPhotos(limits, usage.photos);
  const maxPhotos = Math.min(
    limits.photosPerMessage,
    photosLeft == null ? limits.photosPerMessage : Math.max(0, photosLeft),
  );

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() =>
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }),
    );
  }, []);

  useEffect(() => {
    setPlanId(getStoredPlanId());
    setUsage(loadUsage());

    // If the user is logged in, prefer plan from Supabase user_metadata
    // (set after Stripe success / webhook).
    let cancelled = false;
    (async () => {
      try {
        const { isSupabaseConfigured } = await import("@/lib/config");
        if (!isSupabaseConfigured()) return;
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const metaPlan = user?.user_metadata?.botanic_plan as string | undefined;
        if (!cancelled && metaPlan) {
          const id = normalizePlanId(metaPlan);
          if (id !== "free" || metaPlan === "free") {
            setStoredPlanId(id);
            setPlanId(id);
          }
        }
      } catch {
        /* keep local plan */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onPlan = () => setPlanId(getStoredPlanId());
    window.addEventListener(PLAN_CHANGED_EVENT, onPlan);
    return () => window.removeEventListener(PLAN_CHANGED_EVENT, onPlan);
  }, []);

  useEffect(() => {
    setMessages([{ id: "welcome", role: "assistant", content: a.chatWelcome }]);
    setError(null);
  }, [locale, a.chatWelcome]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, pendingImages, scrollToBottom]);

  useEffect(() => {
    fetch("/api/chat")
      .then((r) => r.json())
      .then((x: { ok?: boolean }) => setApiReady(Boolean(x.ok)))
      .catch(() => setApiReady(false));
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  const planName = (id: PlanId) => {
    if (id === "huerto") return a.planHuerto;
    if (id === "unlimited") return a.planUnlimited;
    return a.planFree;
  };

  const addFiles = useCallback(
    async (files: FileList | File[] | null) => {
      if (!files) return;
      const list = Array.from(files);
      if (!list.length) return;
      setError(null);
      setCompressing(true);
      try {
        const compressed: string[] = [];
        for (const file of list) {
          if (compressed.length >= maxPhotos) break;
          try {
            compressed.push(await fileToCompressedDataUrl(file));
          } catch (e) {
            const code = e instanceof Error ? e.message : "";
            setError(
              code === "FILE_TOO_LARGE"
                ? `Max ${Math.round(MAX_RAW_FILE_BYTES / 1024 / 1024)} MB`
                : a.errorImage,
            );
          }
        }
        setPendingImages((prev) =>
          [...prev, ...compressed].slice(0, Math.max(1, maxPhotos)),
        );
      } finally {
        setCompressing(false);
        if (fileRef.current) fileRef.current.value = "";
      }
    },
    [a.errorImage, maxPhotos],
  );

  function buildApiMessages(history: ChatMessage[]) {
    return history
      .filter((m) => m.id !== "welcome")
      .map((m) => {
        if (m.role === "assistant") {
          return { role: "assistant" as const, content: m.content };
        }
        if (m.images?.length) {
          return {
            role: "user" as const,
            content: [
              { type: "text" as const, text: m.content },
              ...m.images.map((url) => ({
                type: "image_url" as const,
                image_url: { url },
              })),
            ],
          };
        }
        return { role: "user" as const, content: m.content };
      });
  }

  async function sendMessage(overrideText?: string) {
    const text = (overrideText ?? input).trim();
    if ((!text && pendingImages.length === 0) || loading || compressing) return;

    const msgCheck = canSendMessage(limits, usage.messages);
    if (!msgCheck.ok) {
      setError(a.limitMessages);
      return;
    }
    const photoCheck = canAnalyzePhotos(
      limits,
      usage.photos,
      pendingImages.length,
    );
    if (!photoCheck.ok) {
      setError(
        photoCheck.reason === "photos_per_message"
          ? a.limitPhotosPerMsg
          : a.limitPhotos,
      );
      return;
    }

    setError(null);
    setLoading(true);

    const dataUrls = [...pendingImages];
    const userMsg: ChatMessage = {
      id: uid(),
      role: "user",
      content: text || photoDefaultPrompt(locale, dataUrls.length || 1),
      images: dataUrls.length ? dataUrls : undefined,
    };

    const history = [...messages, userMsg];
    const assistantId = uid();
    setMessages([
      ...history,
      { id: assistantId, role: "assistant", content: "" },
    ]);
    setInput("");
    setPendingImages([]);

    let fullReply = "";
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: buildApiMessages(history),
          locale,
          stream: true,
        }),
      });
      const ct = res.headers.get("content-type") || "";

      if (res.ok && ct.includes("text/event-stream") && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const chunks = buffer.split("\n\n");
          buffer = chunks.pop() || "";
          for (const block of chunks) {
            const line = block.split("\n").find((l) => l.startsWith("data: "));
            if (!line) continue;
            try {
              const payload = JSON.parse(line.slice(6)) as {
                type: string;
                text?: string;
                error?: string;
              };
              if (payload.type === "delta" && payload.text) {
                fullReply += payload.text;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, content: fullReply } : m,
                  ),
                );
              } else if (payload.type === "error") {
                throw new Error(payload.error || "Stream error");
              }
            } catch (err) {
              if (err instanceof SyntaxError) continue;
              throw err;
            }
          }
        }
        if (!fullReply.trim()) {
          fullReply = a.errorGeneric;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: fullReply } : m,
            ),
          );
        }
      } else {
        const data = (await res.json()) as {
          reply?: string;
          error?: string;
          code?: string;
        };
        if (!res.ok) {
          if (data.code === "MISSING_API_KEY" || res.status === 503) {
            fullReply = a.comingSoon;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, content: fullReply } : m,
              ),
            );
            setError(a.apiMissing);
            setApiReady(false);
            return;
          }
          throw new Error(data.error || `HTTP ${res.status}`);
        }
        fullReply = data.reply?.trim() || "…";
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: fullReply } : m,
          ),
        );
      }

      setUsage(recordMessage());
      if (dataUrls.length) setUsage(recordPhoto(dataUrls.length));
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error";
      setError(msg);
      fullReply = `${a.errorGeneric} (${msg})`;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: fullReply } : m,
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
    if (loading) return;
    setMessages([{ id: "welcome", role: "assistant", content: a.chatWelcome }]);
    setPendingImages([]);
    setError(null);
    setInput("");
  }

  const showQuick = messages.length <= 2 && !loading && !pendingImages.length;

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar: plan + usage + API status */}
      <div className="flex flex-col gap-3 rounded-2xl border border-brand-100 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-4">
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-brand-700/70">
            {a.planLabel}
          </label>
          <select
            value={planId}
            onChange={(e) => {
              const next = e.target.value as PlanId;
              setStoredPlanId(next);
              setPlanId(next);
            }}
            className="rounded-full border border-brand-200 bg-brand-50/50 px-3 py-1.5 text-sm font-medium text-brand-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
          >
            <option value="free">Gratis</option>
            <option value="huerto">CocinaHelp</option>
          </select>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
              apiReady === true
                ? "bg-brand-100 text-brand-800"
                : apiReady === false
                  ? "bg-amber-100 text-amber-900"
                  : "bg-brand-50 text-brand-700/70"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                apiReady === true
                  ? "bg-brand-500"
                  : apiReady === false
                    ? "bg-amber-500"
                    : "bg-brand-300"
              }`}
            />
            {apiReady === true
              ? a.apiReady
              : apiReady === false
                ? a.apiMissing
                : a.apiChecking}
          </span>
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-brand-800/75">
          <span>
            {a.usageMessages}:{" "}
            <strong className="text-brand-900">
              {msgsLeft == null
                ? a.unlimited
                : `${usage.messages}/${limits.messagesPerDay}`}
            </strong>
          </span>
          <span>
            {a.usagePhotos}:{" "}
            <strong className="text-brand-900">
              {photosLeft == null
                ? a.unlimited
                : `${usage.photos}/${limits.photoAnalysesPerMonth}`}
            </strong>
          </span>
        </div>
      </div>

      {/* Chat panel */}
      <div className="flex min-h-[min(70dvh,640px)] flex-col overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-sm">
        <div className="flex items-start justify-between gap-3 border-b border-brand-100 px-4 py-3 sm:px-5">
          <div>
            <h2 className="text-base font-bold text-brand-900 sm:text-lg">
              {a.chatTitle}
            </h2>
            <p className="text-xs text-brand-700/70 sm:text-sm">{a.topicsHint}</p>
          </div>
          <button
            type="button"
            onClick={clearChat}
            disabled={loading}
            className="shrink-0 rounded-full border border-brand-200 px-3 py-1.5 text-xs font-semibold text-brand-700 transition hover:bg-brand-50 disabled:opacity-50"
          >
            {a.clearChat}
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto px-3 py-4 sm:px-5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed sm:max-w-[85%] ${
                  msg.role === "user"
                    ? "bg-brand-600 text-white"
                    : "bg-brand-50 text-brand-900"
                }`}
              >
                {msg.images?.length ? (
                  <div className="mb-2 flex flex-wrap gap-2">
                    {msg.images.map((src) => (
                      <button
                        key={src.slice(0, 40)}
                        type="button"
                        onClick={() => setLightbox(src)}
                        className="relative h-16 w-16 overflow-hidden rounded-xl ring-1 ring-black/10 sm:h-20 sm:w-20"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                ) : null}
                {msg.content ? (
                  formatMessage(msg.content)
                ) : loading && msg.role === "assistant" ? (
                  <span className="inline-flex items-center gap-2 text-brand-700/70">
                    <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-brand-300 border-t-brand-600" />
                    {a.typing}
                  </span>
                ) : null}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {showQuick && (
          <div className="flex flex-wrap gap-2 border-t border-brand-50 px-3 py-3 sm:px-5">
            {a.quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => void sendMessage(prompt)}
                className="rounded-full border border-brand-200 bg-brand-50/60 px-3 py-1.5 text-left text-xs font-medium text-brand-800 transition hover:border-brand-400 hover:bg-brand-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {error && (
          <div className="mx-3 mb-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900 ring-1 ring-amber-200 sm:mx-5">
            {error}
          </div>
        )}

        {pendingImages.length > 0 && (
          <div className="flex flex-wrap gap-2 border-t border-brand-50 px-3 pt-3 sm:px-5">
            {pendingImages.map((src, i) => (
              <div
                key={`${i}-${src.slice(0, 24)}`}
                className="relative h-16 w-16 overflow-hidden rounded-xl ring-1 ring-brand-200"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  aria-label={a.removePhoto}
                  onClick={() =>
                    setPendingImages((prev) => prev.filter((_, j) => j !== i))
                  }
                  className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-950/70 text-[10px] font-bold text-white"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void sendMessage();
          }}
          className="flex items-end gap-2 border-t border-brand-100 p-3 sm:p-4"
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple={maxPhotos > 1}
            className="hidden"
            onChange={(e) => void addFiles(e.target.files)}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={loading || compressing || maxPhotos <= 0}
            title={a.uploadButton}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand-200 bg-brand-50 text-brand-700 transition hover:border-brand-400 hover:bg-brand-100 disabled:opacity-40"
          >
            {compressing ? (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-brand-300 border-t-brand-600" />
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            )}
          </button>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void sendMessage();
              }
            }}
            rows={1}
            placeholder={a.chatPlaceholder}
            className="max-h-32 min-h-[2.75rem] min-w-0 flex-1 resize-y rounded-2xl border border-brand-200 bg-brand-50/40 px-4 py-2.5 text-sm text-brand-900 outline-none placeholder:text-brand-700/40 focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
          />

          <button
            type="submit"
            disabled={
              loading ||
              compressing ||
              (!input.trim() && pendingImages.length === 0)
            }
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-brand-600 px-5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-40"
          >
            {a.chatSend}
          </button>
        </form>

        <p className="border-t border-brand-50 px-4 py-2 text-center text-[11px] leading-relaxed text-brand-700/60 sm:px-5">
          {a.disclaimer}
        </p>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-950/80 p-4"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal
        >
          <div className="relative max-h-[90dvh] max-w-[90vw]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightbox}
              alt=""
              className="max-h-[90dvh] w-auto rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
