"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Consent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

const STORAGE_KEY = "botanicahelp-cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function save(consent: Consent) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
      window.dispatchEvent(new CustomEvent("cookie-consent", { detail: consent }));
    } catch {
      // ignore
    }
    setVisible(false);
  }

  function acceptAll() {
    save({ necessary: true, analytics: true, marketing: true });
  }

  function rejectAll() {
    save({ necessary: true, analytics: false, marketing: false });
  }

  function saveSettings() {
    save({ necessary: true, analytics, marketing });
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] p-4 sm:p-6">
      <div className="mx-auto max-w-3xl rounded-2xl border border-brand-100 bg-white p-4 shadow-lg shadow-brand-900/10 sm:p-5">
        {!showSettings ? (
          <>
            <p className="text-sm font-semibold text-brand-950">Usamos cookies</p>
            <p className="mt-1.5 text-sm leading-relaxed text-brand-800/80">
              Utilizamos cookies propias y de terceros (como Meta) para el funcionamiento de la web,
              medir el uso y, si lo aceptas, mejorar nuestros anuncios.{" "}
              <Link href="/privacidad" className="font-medium text-brand-700 underline hover:text-brand-600">
                Más información
              </Link>
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={acceptAll}
                className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Aceptar todo
              </button>
              <button
                type="button"
                onClick={rejectAll}
                className="rounded-full border border-brand-200 px-4 py-2 text-sm font-semibold text-brand-800 hover:bg-brand-50"
              >
                Rechazar
              </button>
              <button
                type="button"
                onClick={() => setShowSettings(true)}
                className="rounded-full px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50"
              >
                Configurar
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm font-semibold text-brand-950">Configurar cookies</p>
            <div className="mt-3 space-y-3 text-sm text-brand-800/90">
              <label className="flex items-start gap-2">
                <input type="checkbox" checked disabled className="mt-1" />
                <span>
                  <span className="font-medium">Necesarias</span> — sesión, seguridad e idioma (siempre activas).
                </span>
              </label>
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="mt-1"
                />
                <span>
                  <span className="font-medium">Analítica</span> — nos ayudan a entender el uso de la web.
                </span>
              </label>
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="mt-1"
                />
                <span>
                  <span className="font-medium">Marketing</span> — medir y mejorar anuncios (p. ej. Meta).
                </span>
              </label>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={saveSettings}
                className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Guardar preferencias
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="rounded-full border border-brand-200 px-4 py-2 text-sm font-semibold text-brand-800 hover:bg-brand-50"
              >
                Aceptar todo
              </button>
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="rounded-full px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50"
              >
                Volver
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
