"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function Pricing() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: "huerto" }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error || "No se pudo iniciar el pago");
      }
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al iniciar el pago");
      setLoading(false);
    }
  }

  return (
    <section id="planes" className="scroll-mt-24 bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {t.pricing.title}
          </h2>
          <p className="mt-3 text-base text-slate-600 sm:text-lg">
            {t.pricing.subtitle}
          </p>
        </div>

        {error ? (
          <p className="mx-auto mt-6 max-w-xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2 sm:items-stretch">
          {/* Gratis */}
          <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-lg font-semibold text-slate-900">
              {t.pricing.freeName}
            </h3>
            <p className="mt-1 text-sm text-slate-600">{t.pricing.freeDesc}</p>
            <p className="mt-4 text-4xl font-bold text-slate-900">0 €</p>
            <ul className="mt-6 flex-1 space-y-3 text-sm text-slate-700">
              {t.pricing.freeFeatures.map((item: string) => (
                <li key={item} className="flex gap-2">
                  <span className="text-blue-600">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/ayuda"
              className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              {t.pricing.choosePlan}
            </Link>
          </div>

          {/* Pago */}
          <div className="relative flex flex-col rounded-2xl border border-blue-600 bg-blue-600 p-6 text-white shadow-lg shadow-blue-600/20 sm:p-8">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white ring-4 ring-slate-50">
              {t.pricing.recommended}
            </span>
            <h3 className="text-lg font-semibold">{t.pricing.paidName}</h3>
            <p className="mt-1 text-sm text-blue-100">{t.pricing.paidDesc}</p>
            <p className="mt-4 text-4xl font-bold">
              5,99 €
              <span className="text-base font-medium text-blue-100">
                {t.pricing.perMonth}
              </span>
            </p>
            <ul className="mt-6 flex-1 space-y-3 text-sm text-blue-50">
              {t.pricing.paidFeatures.map((item: string) => (
                <li key={item} className="flex gap-2">
                  <span className="text-white">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => void startCheckout()}
              disabled={loading}
              className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 disabled:opacity-60"
            >
              {loading ? t.pricing.redirecting : t.pricing.choosePlan}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}