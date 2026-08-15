"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function CTA() {
  const { t } = useLanguage();

  return (
    <section className="bg-brand-50/60 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 px-6 py-12 text-center shadow-xl shadow-brand-800/20 sm:px-12 sm:py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-12 -left-8 h-48 w-48 rounded-full bg-leaf-500/20 blur-2xl"
          />

          <h2 className="relative text-balance text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
            {t.cta.title}
          </h2>
          <p className="relative mx-auto mt-3 max-w-xl text-base text-brand-100 sm:text-lg">
            {t.cta.subtitle}
          </p>
          <Link
            href="/ayuda"
            className="relative mt-8 inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-base font-bold text-brand-700 shadow-lg transition hover:bg-brand-50"
          >
            {t.cta.button}
          </Link>
        </div>
      </div>
    </section>
  );
}
