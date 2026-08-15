"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

const stepIcons = [
  <CameraIcon key="cam" />,
  <ChatIcon key="chat" />,
  <LeafIcon key="leaf" />,
];

export function HowItWorks() {
  const { t } = useLanguage();

  return (
    <section id="como-funciona" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-brand-950 sm:text-4xl">
            {t.howItWorks.title}
          </h2>
          <p className="mt-3 text-base text-brand-800/75 sm:text-lg">
            {t.howItWorks.subtitle}
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {t.howItWorks.steps.map((step, i) => (
            <article
              key={step.title}
              className="relative rounded-2xl border border-brand-100 bg-gradient-to-b from-brand-50/80 to-white p-6 shadow-sm transition hover:border-brand-200 hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md shadow-brand-600/20">
                {stepIcons[i]}
              </div>
              <h3 className="text-lg font-bold text-brand-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-800/75">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CameraIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M11 20A7 7 0 019.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}
