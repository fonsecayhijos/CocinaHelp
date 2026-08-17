"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const featureIcons = ["⏱️", "🧺", "📝", "🍽️"];

export function Features() {
  const { t } = useLanguage();

  return (
    <section className="bg-brand-50/60 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lg shadow-brand-900/10 ring-1 ring-brand-900/5">
            <Image
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900&q=80"
              alt="Ingredientes frescos para cocinar en casa"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/40 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
              {t.features.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-800 backdrop-blur"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold tracking-tight text-brand-950 sm:text-4xl">
              {t.features.title}
            </h2>
            <p className="mt-3 text-base text-brand-800/75 sm:text-lg">
              {t.features.subtitle}
            </p>

            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {t.features.items.map((item, i) => (
                <li
                  key={item.title}
                  className="rounded-2xl border border-brand-100 bg-white p-4 shadow-sm"
                >
                  <span className="text-xl" aria-hidden>
                    {featureIcons[i]}
                  </span>
                  <h3 className="mt-2 font-bold text-brand-900">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-brand-800/70">
                    {item.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
