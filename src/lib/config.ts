/**
 * App config. Secrets go in `.env.local` (never commit).
 * Compatible with the same xAI env vars as BloomGuard.
 */

export function getXaiApiKey(): string {
  return (
    process.env.XAI_API_KEY?.trim().replace(/^\uFEFF/, "") ||
    process.env.GROK_API_KEY?.trim().replace(/^\uFEFF/, "") ||
    ""
  );
}

export function getXaiBaseUrl(): string {
  return (
    process.env.XAI_BASE_URL?.trim().replace(/\/$/, "") ||
    "https://api.x.ai/v1"
  );
}

export function getBotanicModel(): string {
  return (
    process.env.BotanicaHelp_MODEL?.trim() ||
    process.env.BLOOMGUARD_MODEL?.trim() ||
    "grok-4.5"
  );
}

/** True when public Supabase URL + anon/publishable key are set. */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  return Boolean(
    url &&
      key &&
      !url.includes("YOUR_PROJECT") &&
      !key.includes("your-") &&
      url.startsWith("http"),
  );
}
