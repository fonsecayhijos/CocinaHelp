import Stripe from "stripe";
import type { PlanId } from "./plans";
import { normalizePlanId } from "./plans";

/** Paid plans sold via Stripe Checkout (monthly). */
export type PaidPlanId = Extract<PlanId, "huerto" | "unlimited">;

export function getStripeSecretKey(): string {
  return process.env.STRIPE_SECRET_KEY?.trim() || "";
}

export function getStripePublishableKey(): string {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() || "";
}

export function getStripeWebhookSecret(): string {
  return process.env.STRIPE_WEBHOOK_SECRET?.trim() || "";
}

/** Price ID for Ilimitado (STRIPE_PRICE_ILIMITADO preferred; STRIPE_PRICE_UNLIMITED alias). */
export function getUnlimitedPriceId(): string {
  return (
    process.env.STRIPE_PRICE_ILIMITADO?.trim() ||
    process.env.STRIPE_PRICE_UNLIMITED?.trim() ||
    ""
  );
}

export function getHuertoPriceId(): string {
  return process.env.STRIPE_PRICE_HUERTO?.trim() || "";
}

export function isStripeConfigured(): boolean {
  const secret = getStripeSecretKey();
  const huerto = getHuertoPriceId();
  const unlimited = getUnlimitedPriceId();
  return Boolean(
    secret &&
      secret.startsWith("sk_") &&
      huerto.startsWith("price_") &&
      unlimited.startsWith("price_"),
  );
}

/** App origin for success/cancel redirects. */
export function getAppUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }
  return "http://localhost:3000";
}

let stripeSingleton: Stripe | null = null;

export function getStripe(): Stripe {
  const key = getStripeSecretKey();
  if (!key) {
    throw new Error("Missing STRIPE_SECRET_KEY");
  }
  if (!stripeSingleton) {
    stripeSingleton = new Stripe(key, {
      apiVersion: "2026-06-24.dahlia",
      typescript: true,
    });
  }
  return stripeSingleton;
}

export function getPriceIdForPlan(plan: PaidPlanId): string {
  if (plan === "huerto") {
    const id = getHuertoPriceId();
    if (!id) throw new Error("Missing STRIPE_PRICE_HUERTO");
    return id;
  }
  const id = getUnlimitedPriceId();
  if (!id) {
    throw new Error("Missing STRIPE_PRICE_ILIMITADO (or STRIPE_PRICE_UNLIMITED)");
  }
  return id;
}

export function planFromPriceId(priceId: string | null | undefined): PlanId {
  if (!priceId) return "free";
  const huerto = getHuertoPriceId();
  const unlimited = getUnlimitedPriceId();
  if (huerto && priceId === huerto) return "huerto";
  if (unlimited && priceId === unlimited) return "unlimited";
  return "free";
}

export function isPaidPlanId(value: string): value is PaidPlanId {
  return value === "huerto" || value === "unlimited";
}

export function planFromCheckoutMetadata(
  metadata: Stripe.Metadata | null | undefined,
): PlanId {
  return normalizePlanId(metadata?.planId ?? metadata?.plan);
}
