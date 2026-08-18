"use client";

import Link from "next/link";
import { CocinaChat } from "@/components/CocinaChat";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function AyudaPage() {
  const { t } = useLanguage();

  return (
    <>
      <Header />
      <main className="bg-gradient-to-b from-brand-50/80 to-white">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
          <div className="mb-6 max-w-2xl">
            <Link
              href="/"
              className="text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              ← CocinaHelp
            </Link>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-brand-950 sm:text-3xl">
              {t.assistant.title}
            </h1>
            <p className="mt-2 text-sm text-brand-800/75 sm:text-base">
              {t.assistant.subtitle}
            </p>
          </div>
          <CocinaChat />
        </div>
      </main>
      <Footer />
    </>
  );
}
