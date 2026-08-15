"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import type { PlanId } from "@/lib/plans";

/** Maps landing cards (index) → product plan. Free has no Stripe price. */
const LANDING_PLAN_IDS: Array<PlanId | null> = [null, "huerto", "unlimited"];

export function Pricing() {
  const { t } = useLanguage();
  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout(planId: PlanId) {
    if (planId === "free") return;
    setError(null);
    setLoadingPlan(planId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(
          data.error ||
            "No se pudo iniciar el pago. Revisa la configuración de Stripe.",
        );
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Error de red al conectar con Stripe.");
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <section id="planes" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-brand-950 sm:text-4xl">
            {t.pricing.title}
          </h2>
          <p className="mt-3 text-base text-brand-800/75 sm:text-lg">
            {t.pricing.subtitle}
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mx-auto mt-8 max-w-xl rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-800"
          >
            {error}
          </div>
        )}

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {t.pricing.plans.map((plan, index) => {
            const highlighted = Boolean(plan.highlighted);
            const planId = LANDING_PLAN_IDS[index] ?? null;
            const isPaid = planId === "huerto" || planId === "unlimited";
            const busy = loadingPlan === planId;

            return (
              <article
                key={plan.name}
                className={`relative flex flex-col rounded-3xl border p-6 sm:p-8 ${
                  highlighted
                    ? "border-brand-500 bg-gradient-to-b from-brand-600 to-brand-700 text-white shadow-xl shadow-brand-600/25 lg:scale-[1.03]"
                    : "border-brand-100 bg-white text-brand-900 shadow-sm"
                }`}
              >
                {highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-leaf-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow">
                    {t.pricing.popular}
                  </span>
                )}

                <h3
                  className={`text-lg font-bold ${highlighted ? "text-white" : "text-brand-900"}`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`mt-1 text-sm ${highlighted ? "text-brand-100" : "text-brand-800/70"}`}
                >
                  {plan.description}
                </p>

                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold tracking-tight">
                    {plan.price}
                  </span>
                  {plan.price !== "0 €" && plan.price !== "€0" && (
                    <span
                      className={`text-sm font-medium ${highlighted ? "text-brand-100" : "text-brand-700/70"}`}
                    >
                      {t.pricing.perMonth}
                    </span>
                  )}
                </div>

                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <svg
                        className={`mt-0.5 h-4 w-4 shrink-0 ${highlighted ? "text-brand-200" : "text-brand-500"}`}
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
                      <span
                        className={
                          highlighted ? "text-brand-50" : "text-brand-800/80"
                        }
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {isPaid && planId ? (
                  <button
                    type="button"
                    disabled={busy || loadingPlan !== null}
                    onClick={() => void startCheckout(planId)}
                    className={`mt-8 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition disabled:cursor-wait disabled:opacity-70 ${
                      highlighted
                        ? "bg-white text-brand-700 hover:bg-brand-50"
                        : "bg-brand-600 text-white hover:bg-brand-700"
                    }`}
                  >
                    {busy ? "…" : t.pricing.cta}
                  </button>
                ) : (
                  <Link
                    href="/ayuda"
                    className={`mt-8 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${
                      highlighted
                        ? "bg-white text-brand-700 hover:bg-brand-50"
                        : "bg-brand-600 text-white hover:bg-brand-700"
                    }`}
                  >
                    {t.pricing.cta}
                  </Link>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
