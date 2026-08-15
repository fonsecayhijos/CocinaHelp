import { NextResponse } from "next/server";
import type Stripe from "stripe";
import {
  getStripe,
  getStripeWebhookSecret,
  planFromCheckoutMetadata,
  planFromPriceId,
} from "@/lib/stripe";
import type { PlanId } from "@/lib/plans";
import { normalizePlanId } from "@/lib/plans";

export const runtime = "nodejs";

/**
 * Stripe webhooks (test + live).
 * Events: checkout.session.completed, customer.subscription.updated/deleted.
 *
 * Optional: set SUPABASE_SERVICE_ROLE_KEY to persist plan on auth.users metadata.
 */
export async function POST(request: Request) {
  const secret = getStripeWebhookSecret();
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    if (secret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, secret);
    } else if (process.env.NODE_ENV === "development" && !secret) {
      // Dev fallback without webhook signing (never use in production).
      event = JSON.parse(body) as Stripe.Event;
      console.warn(
        "[stripe/webhook] STRIPE_WEBHOOK_SECRET missing — accepting unsigned payload (dev only)",
      );
    } else {
      return NextResponse.json(
        { error: "Missing STRIPE_WEBHOOK_SECRET or stripe-signature" },
        { status: 400 },
      );
    }
  } catch (err) {
    console.error("[stripe/webhook] signature", err);
    const message =
      err instanceof Error ? err.message : "Invalid webhook signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription") break;

        const plan = await resolvePlanFromSession(session);
        const userId =
          session.metadata?.userId ||
          session.client_reference_id ||
          undefined;

        if (plan !== "free" && userId) {
          await persistUserPlan(userId, plan, {
            stripeCustomerId:
              typeof session.customer === "string"
                ? session.customer
                : session.customer?.id,
            stripeSubscriptionId:
              typeof session.subscription === "string"
                ? session.subscription
                : session.subscription?.id,
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const plan = resolvePlanFromSubscription(sub);
        const userId = sub.metadata?.userId;
        if (userId) {
          const active =
            sub.status === "active" || sub.status === "trialing";
          await persistUserPlan(userId, active ? plan : "free", {
            stripeCustomerId:
              typeof sub.customer === "string" ? sub.customer : sub.customer?.id,
            stripeSubscriptionId: sub.id,
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.userId;
        if (userId) {
          await persistUserPlan(userId, "free", {
            stripeCustomerId:
              typeof sub.customer === "string" ? sub.customer : sub.customer?.id,
            stripeSubscriptionId: sub.id,
          });
        }
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error("[stripe/webhook] handler", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function resolvePlanFromSession(
  session: Stripe.Checkout.Session,
): Promise<PlanId> {
  let plan = planFromCheckoutMetadata(session.metadata);
  if (plan !== "free") return plan;

  try {
    const stripe = getStripe();
    const full = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ["line_items.data.price"],
    });
    const priceId =
      full.line_items?.data?.[0]?.price &&
      typeof full.line_items.data[0].price === "object"
        ? full.line_items.data[0].price.id
        : null;
    return planFromPriceId(priceId);
  } catch {
    return plan;
  }
}

function resolvePlanFromSubscription(sub: Stripe.Subscription): PlanId {
  const fromMeta = planFromCheckoutMetadata(sub.metadata);
  if (fromMeta !== "free") return fromMeta;
  const priceId = sub.items.data[0]?.price?.id;
  return planFromPriceId(priceId);
}

async function persistUserPlan(
  userId: string,
  plan: PlanId,
  extra: {
    stripeCustomerId?: string | null;
    stripeSubscriptionId?: string | null;
  },
): Promise<void> {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!serviceKey || !url) {
    console.info(
      `[stripe/webhook] plan=${plan} user=${userId} (no SUPABASE_SERVICE_ROLE_KEY — client success page will set local plan)`,
    );
    return;
  }

  try {
    const { createClient } = await import("@supabase/supabase-js");
    const admin = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: existing, error: getErr } =
      await admin.auth.admin.getUserById(userId);
    if (getErr || !existing.user) {
      console.warn("[stripe/webhook] user not found", userId, getErr);
      return;
    }

    const prev = (existing.user.user_metadata ?? {}) as Record<string, unknown>;
    const { error } = await admin.auth.admin.updateUserById(userId, {
      user_metadata: {
        ...prev,
        botanic_plan: normalizePlanId(plan),
        stripe_customer_id: extra.stripeCustomerId ?? prev.stripe_customer_id,
        stripe_subscription_id:
          extra.stripeSubscriptionId ?? prev.stripe_subscription_id,
      },
    });

    if (error) {
      console.error("[stripe/webhook] updateUserById", error);
    } else {
      console.info(`[stripe/webhook] updated plan=${plan} user=${userId}`);
    }
  } catch (err) {
    console.error("[stripe/webhook] persistUserPlan", err);
  }
}
