"use client";

import { Suspense } from "react";
import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="bg-gradient-to-b from-brand-50/80 to-white">
        <div className="mx-auto flex min-h-[70dvh] max-w-lg items-center justify-center px-4 py-10 sm:px-6">
          <Suspense
            fallback={
              <div className="text-sm text-brand-700/70">
                <Link href="/">← BotanicaHelp</Link>
              </div>
            }
          >
            <AuthForm mode="login" />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
