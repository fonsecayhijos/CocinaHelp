"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

type Mode = "login" | "signup";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/ayuda";
  const authError = searchParams.get("error");
  const { t } = useLanguage();
  const a = t.auth;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [magicLoading, setMagicLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(
    authError === "auth" ? a.errorCallback : null,
  );

  if (!isSupabaseConfigured()) {
    return (
      <div className="w-full max-w-md rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
        <h1 className="text-xl font-bold text-brand-950">{a.supabaseMissingTitle}</h1>
        <p className="mt-2 text-sm text-brand-800/80">{a.supabaseMissingBody}</p>
        <Link
          href="/"
          className="mt-4 inline-block text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          ← BotanicaHelp
        </Link>
      </div>
    );
  }

  async function onPasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      const supabase = createClient();
      if (mode === "login") {
        const { error: err } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (err) throw err;
        router.push(next);
        router.refresh();
        return;
      }

      const { data, error: err } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (err) throw err;

      if (data.session) {
        router.push(next);
        router.refresh();
        return;
      }

      setMessage(a.signupCheckEmail);
    } catch (err) {
      setError(err instanceof Error ? err.message : a.errorGeneric);
    } finally {
      setLoading(false);
    }
  }

  async function onMagicLink() {
    setError(null);
    setMessage(null);
    if (!email.trim()) {
      setError(a.emailRequired);
      return;
    }
    setMagicLoading(true);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (err) throw err;
      setMessage(a.magicSent);
    } catch (err) {
      setError(err instanceof Error ? err.message : a.errorGeneric);
    } finally {
      setMagicLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-3xl border border-brand-100 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
          BotanicaHelp
        </p>
        <h1 className="mt-1 text-2xl font-bold text-brand-950">
          {mode === "login" ? a.loginTitle : a.signupTitle}
        </h1>
        <p className="mt-1 text-sm text-brand-800/70">
          {mode === "login" ? a.loginSubtitle : a.signupSubtitle}
        </p>
      </div>

      <form onSubmit={onPasswordSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-brand-900"
          >
            {a.email}
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-brand-200 bg-brand-50/40 px-3.5 py-2.5 text-sm text-brand-900 outline-none placeholder:text-brand-700/40 focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-brand-900"
          >
            {a.password}
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-brand-200 bg-brand-50/40 px-3.5 py-2.5 pr-20 text-sm text-brand-900 outline-none placeholder:text-brand-700/40 focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-semibold text-brand-600 hover:bg-brand-50"
            >
              {showPassword ? a.hidePassword : a.showPassword}
            </button>
          </div>
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800 ring-1 ring-red-200">
            {error}
          </p>
        )}
        {message && (
          <p className="rounded-xl bg-brand-50 px-3 py-2 text-sm text-brand-800 ring-1 ring-brand-200">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-full bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50"
        >
          {loading
            ? a.loading
            : mode === "login"
              ? a.loginButton
              : a.signupButton}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-brand-100" />
        <span className="text-xs font-medium text-brand-700/60">{a.or}</span>
        <div className="h-px flex-1 bg-brand-100" />
      </div>

      <button
        type="button"
        onClick={() => void onMagicLink()}
        disabled={magicLoading}
        className="flex w-full items-center justify-center rounded-full border border-brand-200 bg-white px-4 py-3 text-sm font-semibold text-brand-800 transition hover:bg-brand-50 disabled:opacity-50"
      >
        {magicLoading ? a.loading : a.magicButton}
      </button>

      <p className="mt-6 text-center text-sm text-brand-800/75">
        {mode === "login" ? (
          <>
            {a.noAccount}{" "}
            <Link
              href={`/signup?next=${encodeURIComponent(next)}`}
              className="font-semibold text-brand-600 hover:text-brand-700"
            >
              {a.goSignup}
            </Link>
          </>
        ) : (
          <>
            {a.hasAccount}{" "}
            <Link
              href={`/login?next=${encodeURIComponent(next)}`}
              className="font-semibold text-brand-600 hover:text-brand-700"
            >
              {a.goLogin}
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
