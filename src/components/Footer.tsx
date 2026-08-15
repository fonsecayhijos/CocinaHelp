"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-brand-100 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
  <Link href="/" className="flex items-center gap-2">
    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm">
      🍳
    </span>
    <span className="font-bold text-brand-900">
      Cocina<span className="text-brand-600">Help</span>
    </span>
  </Link>
  <p className="mt-3 text-sm text-brand-800/70">{t.footer.tagline}</p>
</div>
<nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-brand-800/80">
            <Link href="/privacidad" className="hover:text-brand-600">
              {t.footer.links.privacy}
            </Link>
            <Link href="/terminos" className="hover:text-brand-600">
              {t.footer.links.terms}
            </Link>
            <Link href="/contacto" className="hover:text-brand-600">
              {t.footer.links.contact}
          </Link> 
        </nav>
        </div>

        <div className="mt-8 space-y-3 border-t border-brand-100 pt-6">
          <p className="rounded-xl bg-brand-50 px-4 py-3 text-sm leading-relaxed text-brand-800/90">
            {t.footer.disclaimer}
          </p>
          <p className="text-xs text-brand-700/70">
            Usamos cookies. Consulta nuestra{" "}
            <Link href="/privacidad" className="underline hover:text-brand-600">
              Política de privacidad
            </Link>
            .
          </p>
          <p className="text-xs text-brand-700/60">
            © {year} CocinaHelp. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
