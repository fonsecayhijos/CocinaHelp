import type { Metadata, Viewport } from "next";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { CookieBanner } from "@/components/CookieBanner";
import "./globals.css";

export const metadata: Metadata = {
  title: "CocinaHelp — Recetas con IA a partir de lo que tienes",
  description:
    "Sube una foto de tu nevera o ingredientes y recibe recetas fáciles y claras. Cocina en casa con lo que ya tienes.",
  keywords: [
    "recetas",
    "cocina",
    "nevera",
    "ingredientes",
    "IA",
    "comida casera",
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
