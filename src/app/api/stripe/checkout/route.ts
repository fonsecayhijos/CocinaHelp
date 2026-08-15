import { NextResponse } from "next/server";
import {
  getAppUrl,
  getPriceIdForPlan,
  getStripe,
  isPaidPlanId,
  isStripeConfigured,
} from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/config";

export const runtime = "nodejs";

type Body = {
  planId?: string;
};

/**
 * Creates a Stripe Checkout Session (subscription, monthly) for Huerto or Ilimitado.
 * Redirect the browser to the returned `url`.
 */
export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      {
        error:
          "Stripe no está configurado. Añade STRIPE_SECRET_KEY, STRIPE_PRICE_HUERTO y STRIPE_PRICE_ILIMITADO en .env.local",
      },
      { status: 503 },
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const planId = body.planId?.trim() ?? "";
  if (!isPaidPlanId(planId)) {
    return NextResponse.json(
      { error: "planId debe ser 'huerto' o 'unlimited'" },
      { status: 400 },
    );
  }

  let userId: string | null = null;
  let email: string | null = null;

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        userId = user.id;
        email = user.email ?? null;
      }
    } catch {
      /* guest checkout allowed */
    }
  }

  const appUrl = getAppUrl();
  const priceId = getPriceIdForPlan(planId);
  const stripe = getStripe();

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/billing/cancel`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      locale: "auto",
      client_reference_id: userId ?? undefined,
      customer_email: email ?? undefined,
      metadata: {
        planId,
        ...(userId ? { userId } : {}),
      },
      subscription_data: {
        metadata: {
          planId,
          ...(userId ? { userId } : {}),
        },
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe no devolvió URL de Checkout" },
        { status: 502 },
      );
    }

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (err) {
    console.error("[stripe/checkout]", err);
    const message =
      err instanceof Error ? err.message : "Error al crear la sesión de pago";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
