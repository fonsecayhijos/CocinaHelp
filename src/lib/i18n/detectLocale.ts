import type { Locale } from "./types";

export const STORAGE_KEY = "botanicahelp-locale";

const SUPPORTED: Locale[] = ["es", "de", "en"];

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "es" || value === "de" || value === "en";
}

/** Prefer localStorage; otherwise browser language (de → de, en → en, else es). */
export function resolveInitialLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    // ignore
  }

  return detectBrowserLocale();
}

/** Map navigator language tags to our locales. German → de, English → en, else Spanish. */
export function detectBrowserLocale(): Locale {
  if (typeof navigator === "undefined") return "es";

  const candidates =
    navigator.languages?.length > 0
      ? [...navigator.languages]
      : [navigator.language];

  for (const tag of candidates) {
    if (!tag) continue;
    const primary = tag.toLowerCase().split("-")[0];
    if (primary === "de") return "de";
    if (primary === "en") return "en";
    if (primary === "es") return "es";
  }

  return "es";
}

export function localeLabel(code: Locale): string {
  return code.toUpperCase();
}

export { SUPPORTED as supportedLocales };
