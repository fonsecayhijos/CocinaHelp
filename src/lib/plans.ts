/**
 * CocinaHelp plans
 * free | huerto (pago) | unlimited
 */
export type PlanId = "free" | "huerto" | "unlimited";

export type PlanLimits = {
  messagesPerDay: number | null;
  photoAnalysesPerMonth: number | null;
  photosPerMessage: number;
};

export type Plan = {
  id: PlanId;
  name: string;
  limits: PlanLimits;
  priceLabel?: string;
  priceEuros?: number;
};

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: "free",
    name: "Gratis",
    priceLabel: "0 €",
    priceEuros: 0,
    limits: {
      messagesPerDay: 5,
      photoAnalysesPerMonth: 3,
      photosPerMessage: 3,
    },
  },
  huerto: {
    id: "huerto",
    name: "CocinaHelp",
    priceLabel: "5,99 €/mes",
    priceEuros: 5.99,
    limits: {
      messagesPerDay: 40,
      photoAnalysesPerMonth: 60,
      photosPerMessage: 4,
    },
  },
  unlimited: {
    id: "unlimited",
    name: "Ilimitado",
    priceLabel: "—",
    priceEuros: 0,
    limits: {
      messagesPerDay: null,
      photoAnalysesPerMonth: null,
      photosPerMessage: 4,
    },
  },
};

export const PLAN_LIMITS = PLANS;
export const DEFAULT_PLAN: PlanId = "free";

export function getPlan(id?: PlanId | string | null): Plan {
  if (id === "huerto" || id === "unlimited" || id === "free") {
    return PLANS[id];
  }
  return PLANS.free;
}

export function getPlanLimits(id?: PlanId | string | null): PlanLimits {
  return getPlan(id).limits;
}

export function isPlanId(value: string): value is PlanId {
  return value === "free" || value === "huerto" || value === "unlimited";
}
/** Orden del desplegable de planes */
export const PLAN_ORDER: PlanId[] = ["free", "huerto", "unlimited"];

export function planName(id: PlanId | string): string {
  return getPlan(id).name;
}
const PLAN_STORAGE_KEY = "cocinahelp_plan_v1";

export function getStoredPlanId(): PlanId {
  if (typeof window === "undefined") return DEFAULT_PLAN;
  try {
    const raw = localStorage.getItem(PLAN_STORAGE_KEY);
    if (raw && isPlanId(raw)) return raw;
  } catch {
    /* ignore */
  }
  return DEFAULT_PLAN;
}

export function setStoredPlanId(id: PlanId): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PLAN_STORAGE_KEY, id);
  } catch {
    /* ignore */
  }
}
export const PLAN_CHANGED_EVENT = "cocinahelp-plan-changed";

export function normalizePlanId(
  value: string | null | undefined,
): PlanId {
  if (value === "huerto" || value === "unlimited" || value === "free") {
    return value;
  }
  return "free";
}