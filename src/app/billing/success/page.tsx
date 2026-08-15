"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { setStoredPlanId, type PlanId } from "@/lib/plans";
import { isSupabaseConfigured } from "@/lib/config";

type Status = "loading" | "ok" | "error";

function planLabel(plan: PlanId): string {
  if (plan === "huerto") return "Huerto";
  if (plan === "unlimited") return "Ilimitado";
  return "Gratis";
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<Status>("loading");
  const [plan, setPlan] = useState<PlanId | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      setMessage("Falta el identificador de la sesión de pago.");
      return;
    }

    let cancelled = false;

    async function confirm() {
      try {
        const res = await fetch(
          `/api/stripe/session?session_id=${encodeURIComponent(sessionId!)}`,
        );
        const data = (await res.json()) as {
          ok?: boolean;
          plan?: PlanId;
          error?: string;
        };

        if (!res.ok || !data.ok || !data.plan) {
          if (!cancelled) {
            setStatus("error");
            setMessage(data.error || "No se pudo confirmar el pago.");
          }
          return;
        }

        const nextPlan = data.plan;
        setStoredPlanId(nextPlan);

        if (isSupabaseConfigured()) {
          try {
            const { createClient } = await import("@/lib/supabase/client");
            const supabase = createClient();
            await supabase.auth.updateUser({
              data: { botanic_plan: nextPlan },
            });
          } catch {
            /* local plan already set */
          }
        }

        if (!cancelled) {
          setPlan(nextPlan);
          setStatus("ok");
        }
      } catch {
        if (!cancelled) {
          setStatus("error");
          setMessage("Error de red al confirmar el pago.");
        }
      }
    }

    void confirm();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-brand-100 bg-white p-8 shadow-sm sm:p-10">
      {status === "loading" && (
        <>
          <div className="mx-auto h-12 w-12 animate-pulse rounded-full bg-brand-100" />
          <h1 className="mt-6 text-center text-2xl font-bold text-brand-950">
            Confirmando tu pago…
          </h1>
          <p className="mt-2 text-center text-sm text-brand-800/70">
            Un momento mientras activamos tu plan.
          </p>
        </>
      )}

      {status === "ok" && plan && (
        <>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-600">
            <svg
              className="h-8 w-8"
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
          </div>
          <h1 className="mt-6 text-center text-2xl font-bold text-brand-950">
            ¡Pago correcto!
          </h1>
          <p className="mt-3 text-center text-brand-800/80">
            Tu plan{" "}
            <span className="font-semibold text-brand-700">
              {planLabel(plan)}
            </span>{" "}
            ya está activo. Puedes usar el asistente con los nuevos límites.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/ayuda"
              className="inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Ir al asistente
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-brand-200 bg-white px-6 py-3 text-sm font-semibold text-brand-800 transition hover:bg-brand-50"
            >
              Volver al inicio
            </Link>
          </div>
        </>
      )}

      {status === "error" && (
        <>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
            <span className="text-2xl font-bold" aria-hidden>
              !
            </span>
          </div>
          <h1 className="mt-6 text-center text-2xl font-bold text-brand-950">
            No pudimos activar el plan
          </h1>
          <p className="mt-3 text-center text-sm text-brand-800/80">{message}</p>
          <p className="mt-2 text-center text-sm text-brand-800/60">
            Si el cargo aparece en tu banco, contacta con soporte e indica el ID
            de sesión.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/#planes"
              className="inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Volver a planes
            </Link>
            <Link
              href="/ayuda"
              className="inline-flex items-center justify-center rounded-full border border-brand-200 bg-white px-6 py-3 text-sm font-semibold text-brand-800 transition hover:bg-brand-50"
            >
              Ir al asistente
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default function BillingSuccessPage() {
  return (
    <>
      <Header />
      <main className="min-h-[70vh] bg-gradient-to-b from-brand-50 to-white px-4 py-16 sm:px-6">
        <Suspense
          fallback={
            <div className="mx-auto max-w-lg rounded-3xl border border-brand-100 bg-white p-10 text-center">
              <p className="text-brand-800/70">Cargando…</p>
            </div>
          }
        >
          <SuccessContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
