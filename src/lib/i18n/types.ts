export type Locale = "es" | "de" | "en";

export type Dictionary = {
  nav: {
    howItWorks: string;
    pricing: string;
    start: string;
    assistant: string;
    menu: string;
  };
  hero: {
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    badge: string;
    imageAlts: [string, string, string];
  };
  howItWorks: {
    title: string;
    subtitle: string;
    steps: {
      title: string;
      description: string;
    }[];
  };
  features: {
    title: string;
    subtitle: string;
    imageAlt: string;
    tags: string[];
    items: {
      title: string;
      description: string;
    }[];
  };
  pricing: {
    title: string;
    subtitle: string;
    perMonth: string;
    free: string;
    popular: string;
    cta: string;
    plans: {
      name: string;
      price: string;
      description: string;
      features: string[];
      highlighted?: boolean;
    }[];
  };
  cta: {
    title: string;
    subtitle: string;
    button: string;
  };
  assistant: {
    title: string;
    subtitle: string;
    uploadTitle: string;
    uploadHint: string;
    uploadButton: string;
    chatTitle: string;
    chatPlaceholder: string;
    chatSend: string;
    chatWelcome: string;
    comingSoon: string;
    clearChat: string;
    removePhoto: string;
    typing: string;
    apiReady: string;
    apiMissing: string;
    apiChecking: string;
    usageMessages: string;
    usagePhotos: string;
    unlimited: string;
    planLabel: string;
    planFree: string;
    planHuerto: string;
    planUnlimited: string;
    limitMessages: string;
    limitPhotos: string;
    limitPhotosPerMsg: string;
    errorGeneric: string;
    errorImage: string;
    quickPrompts: string[];
    topicsHint: string;
    disclaimer: string;
  };
  plants: {
    title: string;
    subtitle: string;
    ideal: string;
    light: string;
    water: string;
    tips: string;
    problems: string;
    askAssistant: string;
    back: string;
    carouselCta: string;
  };
  footer: {
    tagline: string;
    disclaimer: string;
    rights: string;
    links: {
      privacy: string;
      terms: string;
      contact: string;
    };
  };
  language: {
    label: string;
    es: string;
    de: string;
    en: string;
  };
  auth: {
    login: string;
    logout: string;
    loginTitle: string;
    loginSubtitle: string;
    signupTitle: string;
    signupSubtitle: string;
    email: string;
    password: string;
    loginButton: string;
    signupButton: string;
    magicButton: string;
    loading: string;
    or: string;
    noAccount: string;
    hasAccount: string;
    goSignup: string;
    goLogin: string;
    showPassword: string;
    hidePassword: string;
    emailRequired: string;
    magicSent: string;
    signupCheckEmail: string;
    errorGeneric: string;
    errorCallback: string;
    supabaseMissingTitle: string;
    supabaseMissingBody: string;
  };
};
