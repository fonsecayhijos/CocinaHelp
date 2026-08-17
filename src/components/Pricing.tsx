"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type PaidPlan = "huerto" | "ilimitado";

export function Pricing() {
  const { t } = useLanguage();
  const { isLoggedIn, loading } = useAuth();
  const [busy, setBusy] = useState<PaidPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout(plan: PaidPlan) {
    setError(null);
    setBusy(plan);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? "No se pudo iniciar el pago.");
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Error de red. Inténtalo de nuevo.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <section id="planes" className="scroll-mt-24 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {t.pricing.title}
          </h2>
          <p className="mt-3 text-base text-slate-600 sm:text-lg">
            {t.pricing.subtitle}
          </p>
        </div>

        {error && (
          <p className="mx-auto mt-6 max-w-xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Gratis */}
          <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              {t.pricing.freeName}
            </h3>
            <p className="mt-1 text-sm text-slate-500">{t.pricing.freeDesc}</p>
            <p className="mt-4 text-4xl font-bold text-slate-900">0 €</p>
            <ul className="mt-6 flex-1 space-y-3 text-sm text-slate-700">
              {t.pricing.freeFeatures.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-blue-600">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href={isLoggedIn ? "/ayuda" : "/signup"}
              className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              {t.pricing.choosePlan}
            </Link>
          </div>

          {/* De pago */}
          <div className="relative flex flex-col rounded-2xl bg-blue-600 p-6 text-white shadow-lg shadow-blue-600/25">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-500 px-3 py-0.5 text-xs font-semibold">
              {t.pricing.recommended}
            </div>
            <h3 className="text-lg font-semibold">{t.pricing.paidName}</h3>
            <p className="mt-1 text-sm text-blue-100">{t.pricing.paidDesc}</p>
            <p className="mt-4 text-4xl font-bold">
              5,99 €
              <span className="text-base font-medium text-blue-100">
                {t.pricing.perMonth}
              </span>
            </p>
            <ul className="mt-6 flex-1 space-y-3 text-sm text-blue-50">
              {t.pricing.paidFeatures.map((item) => (
                <li key={item} className="flex gap-2">
                  <span>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <button
              type="button"
              disabled={loading || busy !== null}
              onClick={() => {
                if (!isLoggedIn) {
                  window.location.href = "/login?next=/planes";
                  return;
                }
                void startCheckout("huerto");
              }}
              className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-white px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 disabled:opacity-60"
            >
              {busy === "huerto" ? t.pricing.redirecting : t.pricing.choosePlan}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}





