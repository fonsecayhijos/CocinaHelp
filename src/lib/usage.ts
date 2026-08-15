import type { PlanLimits } from "./plans";

const USAGE_KEY = "botanicahelp_usage_v1";

export type UsageCounters = {
  messages: number;
  photos: number;
  day: string;
  month: string;
};

function localDateKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function localMonthKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export function loadUsage(): UsageCounters {
  const day = localDateKey();
  const month = localMonthKey();
  if (typeof window === "undefined") {
    return { messages: 0, photos: 0, day, month };
  }
  try {
    const raw = localStorage.getItem(USAGE_KEY);
    if (!raw) return { messages: 0, photos: 0, day, month };
    const parsed = JSON.parse(raw) as Partial<UsageCounters>;
    return {
      messages: parsed.day === day ? (parsed.messages ?? 0) : 0,
      photos: parsed.month === month ? (parsed.photos ?? 0) : 0,
      day,
      month,
    };
  } catch {
    return { messages: 0, photos: 0, day, month };
  }
}

function saveUsage(usage: UsageCounters) {
  try {
    localStorage.setItem(USAGE_KEY, JSON.stringify(usage));
  } catch {
    /* ignore */
  }
}

export function recordMessage(): UsageCounters {
  const usage = loadUsage();
  usage.messages += 1;
  saveUsage(usage);
  return usage;
}

export function recordPhoto(count = 1): UsageCounters {
  const usage = loadUsage();
  usage.photos += Math.max(0, count);
  saveUsage(usage);
  return usage;
}

export function canSendMessage(
  limits: PlanLimits,
  messagesUsed: number,
): { ok: boolean } {
  if (limits.messagesPerDay == null) return { ok: true };
  return { ok: messagesUsed < limits.messagesPerDay };
}

export function canAnalyzePhotos(
  limits: PlanLimits,
  photosUsed: number,
  attaching: number,
): { ok: boolean; reason?: "photos_limit" | "photos_per_message" } {
  if (attaching <= 0) return { ok: true };
  if (attaching > limits.photosPerMessage) {
    return { ok: false, reason: "photos_per_message" };
  }
  if (limits.photoAnalysesPerMonth == null) return { ok: true };
  if (photosUsed + attaching > limits.photoAnalysesPerMonth) {
    return { ok: false, reason: "photos_limit" };
  }
  return { ok: true };
}

export function remainingMessages(
  limits: PlanLimits,
  messagesUsed: number,
): number | null {
  if (limits.messagesPerDay == null) return null;
  return Math.max(0, limits.messagesPerDay - messagesUsed);
}

export function remainingPhotos(
  limits: PlanLimits,
  photosUsed: number,
): number | null {
  if (limits.photoAnalysesPerMonth == null) return null;
  return Math.max(0, limits.photoAnalysesPerMonth - photosUsed);
}
