"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { LanguageSelector } from "./LanguageSelector";

export function Header() {
  const { t } = useLanguage();
  const { isLoggedIn, email, loading, signOut, configured } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-100/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-lg shadow-sm shadow-brand-600/25">
    🍳
  </span>
  <span className="text-lg font-bold tracking-tight text-brand-900">
    Cocina<span className="text-brand-600">Help</span>
  </span>
  </Link>
  <nav className="hidden items-center gap-8 md:flex">
          <a
            href="/#como-funciona"
            className="text-sm font-medium text-brand-800/80 transition hover:text-brand-700"
          >
            {t.nav.howItWorks}
          </a>
          <a
            href="/#planes"
            className="text-sm font-medium text-brand-800/80 transition hover:text-brand-700"
          >
            {t.nav.pricing}
          </a>
          <Link
            href="/ayuda"
            className="text-sm font-medium text-brand-800/80 transition hover:text-brand-700"
          >
            {t.nav.assistant}
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSelector />

          {!loading && configured && isLoggedIn ? (
            <div className="hidden items-center gap-2 md:flex">
              <span
                className="max-w-[140px] truncate text-xs text-brand-700/80"
                title={email ?? undefined}
              >
                {email}
              </span>
              <button
                type="button"
                onClick={() => void signOut()}
                className="rounded-full border border-brand-200 px-3 py-1.5 text-xs font-semibold text-brand-800 transition hover:bg-brand-50"
              >
                {t.auth.logout}
              </button>
              <Link
                href="/ayuda"
                className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-brand-600/25 transition hover:bg-brand-700"
              >
                {t.nav.assistant}
              </Link>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link
                href="/login"
                className="rounded-full border border-brand-200 px-3 py-1.5 text-sm font-semibold text-brand-800 transition hover:bg-brand-50"
              >
                {t.auth.login}
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-brand-600/25 transition hover:bg-brand-700"
              >
                {t.nav.start}
              </Link>
            </div>
          )}

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-brand-200 text-brand-800 md:hidden"
            aria-expanded={open}
            aria-label={t.nav.menu}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-brand-100 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <a
              href="/#como-funciona"
              className="rounded-lg px-3 py-2 text-sm font-medium text-brand-800 hover:bg-brand-50"
              onClick={() => setOpen(false)}
            >
              {t.nav.howItWorks}
            </a>
            <a
              href="/#planes"
              className="rounded-lg px-3 py-2 text-sm font-medium text-brand-800 hover:bg-brand-50"
              onClick={() => setOpen(false)}
            >
              {t.nav.pricing}
            </a>
            <Link
              href="/ayuda"
              className="rounded-lg px-3 py-2 text-sm font-medium text-brand-800 hover:bg-brand-50"
              onClick={() => setOpen(false)}
            >
              {t.nav.assistant}
            </Link>
            {!loading && configured && isLoggedIn ? (
              <>
                <p className="truncate px-3 text-xs text-brand-700/70">{email}</p>
                <button
                  type="button"
                  className="rounded-lg px-3 py-2 text-left text-sm font-medium text-brand-800 hover:bg-brand-50"
                  onClick={() => {
                    setOpen(false);
                    void signOut();
                  }}
                >
                  {t.auth.logout}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-brand-800 hover:bg-brand-50"
                  onClick={() => setOpen(false)}
                >
                  {t.auth.login}
                </Link>
                <Link
                  href="/signup"
                  className="mt-1 inline-flex items-center justify-center rounded-full bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white"
                  onClick={() => setOpen(false)}
                >
                  {t.nav.start}
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
