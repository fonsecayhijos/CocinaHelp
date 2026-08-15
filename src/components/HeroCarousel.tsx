"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const SLIDES = [
  {
    src: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=1200&q=80",
    alt: "Paella de marisco",
  },
  {
    src: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=1200&q=80",
    alt: "Pasta con tomate",
  },
  {
    src: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80",
    alt: "Pizza casera",
  },
  {
    src: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&q=80",
    alt: "Ensalada bowl",
  },
  {
    src: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=1200&q=80",
    alt: "Arroz salteado",
  },
  {
    src: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1200&q=80",
    alt: "Tortitas / pancakes",
  },
  {
    src: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=1200&q=80",
    alt: "Pasta cremosa",
  },
  {
    src: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80",
    alt: "Pollo a la plancha con guarnición",
  },
] as const;

const INTERVAL_MS = 1500;
const FADE_MS = 700;

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <Link
      href="/recetas"
      className="group relative block h-[280px] w-full overflow-hidden rounded-2xl shadow-md shadow-brand-900/10 ring-1 ring-brand-900/5 sm:h-[360px] lg:h-[400px]"
      aria-label={t.plants.carouselCta}
    >
      {SLIDES.map((slide, i) => {
        const active = i === index;
        return (
          <div
            key={slide.src}
            className="absolute inset-0 transition-opacity ease-in-out"
            style={{
              opacity: active ? 1 : 0,
              transitionDuration: `${FADE_MS}ms`,
              zIndex: active ? 1 : 0,
            }}
            aria-hidden={!active}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition duration-300 group-hover:scale-[1.02]"
              priority={i === 0}
            />
          </div>
        );
      })}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2] rounded-2xl ring-1 ring-inset ring-brand-900/5"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-24 bg-gradient-to-t from-brand-950/50 to-transparent"
      />

      <div className="absolute inset-x-0 bottom-4 z-[3] flex justify-center px-4">
        <span className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-900/25 transition group-hover:bg-brand-700">
          {t.plants.carouselCta}
        </span>
      </div>
    </Link>
  );
}
