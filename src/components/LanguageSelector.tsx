"use client";

import { supportedLocales } from "@/lib/i18n/detectLocale";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { Locale } from "@/lib/i18n/types";

const CODES: Record<Locale, string> = {
  es: "ES",
  de: "DE",
  en: "EN",
};

export function LanguageSelector({ className = "" }: { className?: string }) {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t.language.label}
      className={`inline-flex items-center rounded-full border border-brand-200 bg-white p-0.5 shadow-sm ${className}`}
    >
      {supportedLocales.map((code) => {
        const active = locale === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            aria-pressed={active}
            aria-label={t.language[code]}
            title={t.language[code]}
            className={`min-w-[2.5rem] rounded-full px-2.5 py-1.5 text-xs font-bold tracking-wide transition ${
              active
                ? "bg-brand-600 text-white shadow-sm"
                : "text-brand-700/80 hover:bg-brand-50 hover:text-brand-900"
            }`}
          >
            {CODES[code]}
          </button>
        );
      })}
    </div>
  );
}
