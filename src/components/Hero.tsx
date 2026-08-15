"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { HeroCarousel } from "./HeroCarousel";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-800 via-brand-100 to-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-leaf-100/80 blur-3xl"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-14 lg:py-20">
        <div className="order-2 lg:order-1">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            {t.hero.badge}
          </span>

          <h1 className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-brand-950 sm:text-4xl lg:text-5xl">
            {t.hero.title}
          </h1>

          <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-brand-800/80 sm:text-lg">
            {t.hero.subtitle}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/ayuda"
              className="inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700 hover:shadow-brand-700/30"
            >
              {t.hero.ctaPrimary}
            </Link>
            <Link
              href="/ayuda"
              className="inline-flex items-center justify-center rounded-full border border-brand-200 bg-white px-6 py-3.5 text-base font-semibold text-brand-800 transition hover:border-brand-400 hover:bg-brand-50"
            >
              {t.hero.ctaSecondary}
            </Link>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-brand-700/90">
            {t.features.items.slice(0, 3).map((item) => (
              <li key={item.title} className="flex items-center gap-1.5">
                <CheckIcon /> {item.title}
              </li>
            ))}
          </ul>
        </div>

        <div className="order-1 lg:order-2">
          <HeroCarousel />
        </div>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-brand-500"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
        clipRule="evenodd"
      />
    </svg>
  );
}
