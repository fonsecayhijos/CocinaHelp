import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function BillingCancelPage() {
  return (
    <>
      <Header />
      <main className="min-h-[70vh] bg-gradient-to-b from-brand-50 to-white px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-lg rounded-3xl border border-brand-100 bg-white p-8 shadow-sm sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-700">
            <svg
              className="h-7 w-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="mt-6 text-center text-2xl font-bold text-brand-950">
            Pago cancelado
          </h1>
          <p className="mt-3 text-center text-brand-800/80">
            No se ha realizado ningún cargo. Puedes elegir un plan cuando
            quieras.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/#planes"
              className="inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Ver planes
            </Link>
            <Link
              href="/ayuda"
              className="inline-flex items-center justify-center rounded-full border border-brand-200 bg-white px-6 py-3 text-sm font-semibold text-brand-800 transition hover:bg-brand-50"
            >
              Seguir con el plan gratis
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
