import type { Dictionary, Locale } from "@/lib/i18n/types";

export const dictionaries: Record<Locale, Dictionary> = {
  es: {
    nav: {
      howItWorks: "Cómo funciona",
      pricing: "Planes",
      start: "Empezar",
      assistant: "Asistente",
      menu: "Menú",
    },
    hero: {
      title: "¿Qué cocino hoy?",
      subtitle:
        "Dinos qué tienes o sube una foto de la nevera o de la mesa y te proponemos una receta fácil, con pasos claros.",
      ctaPrimary: "Empezar gratis",
      ctaSecondary: "Probar el asistente",
      badge: "IA para cocinar en casa",
      imageAlts: [
        "Ingredientes para una receta de pasta",
        "Verduras y productos frescos en la mesa",
        "Nevera o mesa con alimentos para cocinar",
      ],
    },
    howItWorks: {
      title: "Cómo funciona",
      subtitle: "Tres pasos sencillos para decidir qué cocinar",
      steps: [
        {
          title: "1. Dinos qué tienes",
          description:
            "Escribe ingredientes o sube una foto de la nevera, la despensa o la mesa.",
        },
        {
          title: "2. Cuéntanos cómo lo quieres",
          description:
            "Rápido, económico, para hoy… o si quieres evitar algún alimento.",
        },
        {
          title: "3. Recibe la receta",
          description:
            "Nombre del plato, ingredientes, pasos claros y un consejo extra.",
        },
      ],
    },
    features: {
      title: "Por qué CocinaHelp",
      subtitle: "Ideas prácticas para cocinar en casa sin complicarte",
      imageAlt: "Ingredientes frescos listos para cocinar",
      tags: ["Rápido", "Con lo que tienes", "Pasos claros", "Para casa"],
      items: [
        {
          title: "Rápido y sencillo",
          description:
            "Recetas claras para el día a día, con pasos cortos y sin tecnicismos.",
        },
        {
          title: "Con lo que tienes",
          description:
            "Escribe ingredientes o sube una foto y te proponemos qué hacer.",
        },
        {
          title: "Pasos claros",
          description:
            "Ingredientes, tiempos y elaboración paso a paso.",
        },
      ],
    },
    

     pricing: {
      title: "Planes",
      subtitle: "Prueba una vez gratis. Si te encaja, 5,99 € al mes.",
      freeName: "Gratis",
      freeDesc: "Para probar CocinaHelp una vez.",
      freeFeatures: [
        "1 consulta (texto o una foto)",
        "1 receta con pasos claros",
        "Sin tarjeta para empezar",
      ],
      paidName: "CocinaHelp",
      paidDesc: "Ideas de recetas cuando las necesites.",
      paidFeatures: [
        "Consultas para el día a día",
        "Texto o foto de lo que tienes",
        "Recetas con ingredientes y pasos",
        "Cancela cuando quieras",
      ],
      recommended: "Recomendado",
      choosePlan: "Elegir plan",
      redirecting: "Redirigiendo…",
      perMonth: "/mes",
    },

    cta: {
      title: "¿Listo para decidir qué cocinar?",
      subtitle: "Prueba una consulta gratis y recibe una receta paso a paso.",
      button: "Empezar gratis",
    },
   assistant: {
      title: "Asistente de CocinaHelp",
      subtitle:
        "Escribe lo que tienes o sube una foto y te proponemos una receta fácil paso a paso.",
      uploadHint: "JPG, PNG o WEBP — se comprime en el navegador",
      placeholder: "Ej.: tengo pasta, tomate, ajo y queso…",
      send: "Enviar",
      thinking: "Preparando tu receta…",
      error: "No se pudo obtener la respuesta. Inténtalo de nuevo.",
      greeting:
        "Hola, soy el asistente de CocinaHelp. Dime qué tienes en casa o sube una foto y te propongo una receta.",
      quickPrompts: [
        "Tengo pasta, tomate y ajo",
        "Quiero algo en 20 minutos",
        "Solo huevos y patatas",
        "Cena fácil con pollo",
      ],
      limitMessages:
        "Has llegado al límite de mensajes de este periodo. Pasa al plan de pago o espera al próximo ciclo.",
      limitPhotos: "Has llegado al límite de fotos de este periodo.",
      limitPhotosPerMsg:
        "Demasiadas fotos en un solo mensaje. Prueba con menos.",
      usageMessages: "Mensajes",
      usagePhotos: "Fotos",
      unlimited: "Ilimitado",
    },
    footer: {
      tagline: "Recetas fáciles con lo que tienes en casa.",
      rights: "Todos los derechos reservados.",
      disclaimer:
        "Las sugerencias son orientativas y generadas por IA. No sustituyen el consejo de un profesional de la salud o de la nutrición. Revisa alergias e intolerancias.",
      links: {
        privacy: "Privacidad",
        terms: "Términos",
        contact: "Contacto",
      },
    },
    language: {
      label: "Idioma",
      es: "Español",
      de: "Deutsch",
      en: "English",
    },
    auth: {
      login: "Entrar",
      logout: "Salir",
      loginTitle: "Iniciar sesión",
      loginSubtitle: "Accede a tu cuenta de CocinaHelp",
      signupTitle: "Crear cuenta",
      signupSubtitle: "Regístrate gratis en unos segundos",
      email: "Email",
      password: "Contraseña",
      loginButton: "Entrar",
      signupButton: "Registrarse",
      magicButton: "Enviar enlace mágico",
      loading: "Un momento…",
      or: "o",
      noAccount: "¿Aún no tienes cuenta?",
      hasAccount: "¿Ya tienes cuenta?",
      goSignup: "Registrarse",
      goLogin: "Entrar",
      showPassword: "Mostrar",
      hidePassword: "Ocultar",
      emailRequired: "Introduce tu email para el enlace mágico.",
      magicSent: "Enlace enviado. Abre el email para entrar.",
      signupCheckEmail:
        "Cuenta creada. Si hace falta confirmar el email, revisa tu bandeja e inicia sesión.",
      errorGeneric: "Error de autenticación",
      errorCallback: "No se pudo completar el acceso. Inténtalo de nuevo.",
      supabaseMissingTitle: "Supabase no configurado",
      supabaseMissingBody:
        "Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local",
    },
    plants: {
      title: "Ideas de cocina",
      subtitle: "Inspiración con ingredientes habituales",
      carouselCta: "Ver ideas de cocina",
      askAssistant: "Pedir receta al asistente",
    },
  },

  de: {
    nav: {
      howItWorks: "So funktioniert’s",
      pricing: "Pläne",
      start: "Start",
      assistant: "Assistent",
      menu: "Menü",
    },
    hero: {
      title: "Was koche ich heute?",
      subtitle:
        "Sag uns, was du hast, oder lade ein Foto vom Kühlschrank oder Tisch hoch – wir schlagen ein einfaches Rezept mit klaren Schritten vor.",
      ctaPrimary: "Kostenlos starten",
      ctaSecondary: "Assistent testen",
      badge: "KI zum Kochen zu Hause",
      imageAlts: [
        "Zutaten für ein Nudelrezept",
        "Frisches Gemüse und Lebensmittel auf dem Tisch",
        "Kühlschrank oder Tisch mit Lebensmitteln",
      ],
    },
    howItWorks: {
      title: "So funktioniert’s",
      subtitle: "Drei einfache Schritte zum Kochen",
      steps: [
        {
          title: "1. Sag uns, was du hast",
          description:
            "Schreib Zutaten oder lade ein Foto vom Kühlschrank, Vorrat oder Tisch hoch.",
        },
        {
          title: "2. Sag uns, wie du es willst",
          description:
            "Schnell, günstig, für heute … oder ohne bestimmte Zutaten.",
        },
        {
          title: "3. Hol dir das Rezept",
          description:
            "Gerichtenname, Zutaten, klare Schritte und ein Extra-Tipp.",
        },
      ],
    },
    features: {
      title: "Warum CocinaHelp",
      subtitle: "Praktische Ideen zum Kochen zu Hause",
      imageAlt: "Frische Zutaten zum Kochen",
      tags: ["Schnell", "Mit dem, was da ist", "Klare Schritte", "Für Zuhause"],
      items: [
        {
          title: "Schnell und einfach",
          description:
            "Klare Rezepte für den Alltag – kurze Schritte, ohne Fachchinesisch.",
        },
        {
          title: "Mit dem, was du hast",
          description:
            "Schreib Zutaten oder lade ein Foto hoch – wir schlagen vor, was du kochen kannst.",
        },
        {
          title: "Klare Schritte",
          description:
            "Zutaten, Zeiten und Zubereitung Schritt für Schritt.",
        },
      ],
    },
    pricing: {
      title: "Pläne",
      subtitle: "Einmal gratis testen. Wenn es passt, 5,99 € im Monat.",
      freeName: "Kostenlos",
      freeDesc: "CocinaHelp einmal ausprobieren.",
      freeFeatures: [
        "1 Anfrage (Text oder ein Foto)",
        "1 Rezept mit klaren Schritten",
        "Keine Karte zum Start",
      ],
      paidName: "CocinaHelp",
      paidDesc: "Rezeptideen, wenn du sie brauchst.",
      paidFeatures: [
        "Anfragen für den Alltag",
        "Text oder Foto von dem, was du hast",
        "Rezepte mit Zutaten und Schritten",
        "Jederzeit kündbar",
      ],
      recommended: "Empfohlen",
      choosePlan: "Plan wählen",
      redirecting: "Weiterleitung…",
      perMonth: "/Monat",
    },
      ],
    },
    cta: {
      title: "Bereit zu entscheiden, was du kochst?",
      subtitle:
        "Teste eine kostenlose Anfrage und erhalte ein Rezept Schritt für Schritt.",
      button: "Kostenlos starten",
    },
    assistant: {
      title: "CocinaHelp Assistent",
      subtitle:
        "Schreib, was du hast, oder lade ein Foto hoch – wir schlagen ein einfaches Rezept vor.",
      uploadHint: "JPG, PNG oder WEBP – wird im Browser komprimiert",
      placeholder: "Z. B.: Ich habe Nudeln, Tomaten, Knoblauch und Käse…",
      send: "Senden",
      thinking: "Rezept wird vorbereitet…",
      error: "Antwort fehlgeschlagen. Bitte erneut versuchen.",
      greeting:
        "Hallo, ich bin der CocinaHelp-Assistent. Sag mir, was du zu Hause hast, oder lade ein Foto hoch.",
quickPrompts: [
  "Ich habe Nudeln, Tomaten und Knoblauch",
  "Etwas in 20 Minuten",
  "Nur Eier und Kartoffeln",
  "Einfaches Abendessen mit Hähnchen",
],      limitMessages:
        "Du hast das Nachrichtenlimit für diesen Zeitraum erreicht. Wechsle zum Abo oder warte auf den nächsten Zyklus.",
      limitPhotos: "Du hast das Fotolimit für diesen Zeitraum erreicht.",
      limitPhotosPerMsg:
        "Zu viele Fotos in einer Nachricht. Bitte weniger senden.",
      usageMessages: "Nachrichten",
      usagePhotos: "Fotos",
      unlimited: "Unbegrenzt",
    },
    footer: {
      tagline: "Einfache Rezepte mit dem, was du zu Hause hast.",
      rights: "Alle Rechte vorbehalten.",
      disclaimer:
        "Vorschläge sind orientierend und KI-generiert. Sie ersetzen keinen medizinischen oder ernährungsbezogenen Rat. Allergien und Unverträglichkeiten prüfen.",
      links: {
        privacy: "Datenschutz",
        terms: "Bedingungen",
        contact: "Kontakt",
      },
    },
    language: {
      label: "Sprache",
      es: "Español",
      de: "Deutsch",
      en: "English",
    },
    auth: {
      login: "Anmelden",
      logout: "Abmelden",
      loginTitle: "Anmelden",
      loginSubtitle: "Zugang zu deinem CocinaHelp-Konto",
      signupTitle: "Konto erstellen",
      signupSubtitle: "In wenigen Sekunden kostenlos registrieren",
      email: "E-Mail",
      password: "Passwort",
      loginButton: "Anmelden",
      signupButton: "Registrieren",
      magicButton: "Magic Link senden",
      loading: "Einen Moment…",
      or: "oder",
      noAccount: "Noch kein Konto?",
      hasAccount: "Schon ein Konto?",
      goSignup: "Registrieren",
      goLogin: "Anmelden",
      showPassword: "Zeigen",
      hidePassword: "Verbergen",
      emailRequired: "E-Mail für den Magic Link eingeben.",
      magicSent: "Link gesendet. E-Mail öffnen zum Anmelden.",
      signupCheckEmail:
        "Konto erstellt. Falls eine Bestätigung nötig ist, Posteingang prüfen und dann anmelden.",
      errorGeneric: "Authentifizierungsfehler",
      errorCallback: "Anmeldung fehlgeschlagen. Bitte erneut versuchen.",
      supabaseMissingTitle: "Supabase nicht konfiguriert",
      supabaseMissingBody:
        "NEXT_PUBLIC_SUPABASE_URL oder NEXT_PUBLIC_SUPABASE_ANON_KEY fehlt in .env.local",
    },
    plants: {
      title: "Kochideen",
      subtitle: "Inspiration mit gängigen Zutaten",
      carouselCta: "Kochideen ansehen",
      askAssistant: "Rezept vom Assistenten holen",
    },
  },

  en: {
    nav: {
      howItWorks: "How it works",
      pricing: "Plans",
      start: "Start",
      assistant: "Assistant",
      menu: "Menu",
    },
    hero: {
      title: "What should I cook today?",
      subtitle:
        "Tell us what you have or upload a photo of your fridge or table and we’ll suggest an easy recipe with clear steps.",
      ctaPrimary: "Start free",
      ctaSecondary: "Try the assistant",
      badge: "AI for home cooking",
      imageAlts: [
        "Ingredients for a pasta recipe",
        "Fresh vegetables and food on the table",
        "Fridge or table with groceries",
      ],
    },
    howItWorks: {
      title: "How it works",
      subtitle: "Three simple steps to decide what to cook",
      steps: [
        {
          title: "1. Tell us what you have",
          description:
            "Type ingredients or upload a photo of your fridge, pantry or table.",
        },
        {
          title: "2. Tell us how you want it",
          description:
            "Quick, budget-friendly, for today… or without certain foods.",
        },
        {
          title: "3. Get the recipe",
          description:
            "Dish name, ingredients, clear steps and an extra tip.",
        },
      ],
    },
    features: {
      title: "Why CocinaHelp",
      subtitle: "Practical ideas for cooking at home",
      imageAlt: "Fresh ingredients ready to cook",
      tags: ["Quick", "Use what you have", "Clear steps", "For home"],
      items: [
        {
          title: "Quick and simple",
          description:
            "Clear everyday recipes with short steps and no jargon.",
        },
        {
          title: "Use what you have",
          description:
            "Type ingredients or upload a photo and we’ll suggest what to cook.",
        },
        {
          title: "Clear steps",
          description:
            "Ingredients, times and step-by-step instructions.",
        },
      ],
    },
    pricing: {
      title: "Plans",
      subtitle: "Try once for free. If it fits, €5.99 per month.",
      freeName: "Free",
      freeDesc: "Try CocinaHelp once.",
      freeFeatures: [
        "1 consultation (text or one photo)",
        "1 recipe with clear steps",
        "No card required to start",
      ],
      paidName: "CocinaHelp",
      paidDesc: "Recipe ideas when you need them.",
      paidFeatures: [
        "Everyday consultations",
        "Text or photo of what you have",
        "Recipes with ingredients and steps",
        "Cancel anytime",
      ],
      recommended: "Recommended",
      choosePlan: "Choose plan",
      redirecting: "Redirecting…",
      perMonth: "/month",
    },
      ],
    },
    cta: {
      title: "Ready to decide what to cook?",
      subtitle: "Try one free query and get a step-by-step recipe.",
      button: "Start free",
    },
    assistant: {
      title: "CocinaHelp Assistant",
      subtitle:
        "Type what you have or upload a photo and we’ll suggest an easy recipe step by step.",
      uploadHint: "JPG, PNG or WEBP — compressed in the browser",
      placeholder: "e.g. I have pasta, tomatoes, garlic and cheese…",
      send: "Send",
      thinking: "Preparing your recipe…",
      error: "Could not get a response. Please try again.",
      greeting:
        "Hi, I’m the CocinaHelp assistant. Tell me what you have at home or upload a photo and I’ll suggest a recipe.",
quickPrompts: [
  "Ich habe Nudeln, Tomaten und Knoblauch",
  "Etwas in 20 Minuten",
  "Nur Eier und Kartoffeln",
  "Einfaches Abendessen mit Hähnchen",
],      limitMessages:
        "You’ve reached the message limit for this period. Upgrade or wait for the next cycle.",
      limitPhotos: "You’ve reached the photo limit for this period.",
      limitPhotosPerMsg:
        "Too many photos in one message. Try fewer.",
      usageMessages: "Messages",
      usagePhotos: "Photos",
      unlimited: "Unlimited",
    },
    footer: {
      tagline: "Easy recipes with what you already have at home.",
      rights: "All rights reserved.",
      disclaimer:
        "Suggestions are indicative and AI-generated. They do not replace professional health or nutrition advice. Check allergies and intolerances.",
      links: {
        privacy: "Privacy",
        terms: "Terms",
        contact: "Contact",
      },
    },
    language: {
      label: "Language",
      es: "Español",
      de: "Deutsch",
      en: "English",
    },
    auth: {
      login: "Log in",
      logout: "Log out",
      loginTitle: "Log in",
      loginSubtitle: "Access your CocinaHelp account",
      signupTitle: "Create account",
      signupSubtitle: "Sign up free in seconds",
      email: "Email",
      password: "Password",
      loginButton: "Log in",
      signupButton: "Sign up",
      magicButton: "Send magic link",
      loading: "One moment…",
      or: "or",
      noAccount: "No account yet?",
      hasAccount: "Already have an account?",
      goSignup: "Sign up",
      goLogin: "Log in",
      showPassword: "Show",
      hidePassword: "Hide",
      emailRequired: "Enter your email for the magic link.",
      magicSent: "Link sent. Open the email to sign in.",
      signupCheckEmail:
        "Account created. If email confirmation is required, check your inbox, then log in.",
      errorGeneric: "Authentication error",
      errorCallback: "Could not complete sign-in. Please try again.",
      supabaseMissingTitle: "Supabase not configured",
      supabaseMissingBody:
        "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local",
    },
    plants: {
      title: "Cooking ideas",
      subtitle: "Inspiration with everyday ingredients",
      carouselCta: "See cooking ideas",
      askAssistant: "Ask the assistant for a recipe",
    },
  },
};

export const defaultLocale: Locale = "es";