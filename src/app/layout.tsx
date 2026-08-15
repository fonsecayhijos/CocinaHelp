import type { Metadata, Viewport } from "next";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { CookieBanner } from "@/components/CookieBanner";
import "./globals.css";

export const metadata: Metadata = {
  title: "CocinaHelp — Ayuda con IA para el cuidado de plantas",
  description:
    "Sube una foto y recibe consejos claros sobre riego, luz, plagas y carencias. Para huerto, balcón, frutas, verduras y plantas de interior en Europa.",
  keywords: [
    "plantas",
    "huerto",
    "verduras",
    "frutas",
    "riego",
    "plagas",
    "plantas de interior",
    "balcón",
    "IA",
    "Europa",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2f8644",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-dvh antialiased">
        <LanguageProvider>
          {children}
          <CookieBanner />
        </LanguageProvider>
      </body>
    </html>
  );
}
