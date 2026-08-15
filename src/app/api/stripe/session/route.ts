import { NextResponse } from "next/server";
import {
  getStripe,
  isStripeConfigured,
  planFromCheckoutMetadata,
  planFromPriceId,
} from "@/lib/stripe";
import type { PlanId } from "@/lib/plans";

export const runtime = "nodejs";

/**
 * Verifies a completed Checkout Session and returns the plan to activate.
 * Used by /billing/success after redirect from Stripe.
 */
export async function GET(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe no está configurado" },
      { status: 503 },
    );
  }

  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id")?.trim();

  if (!sessionId || !sessionId.startsWith("cs_")) {
    return NextResponse.json(
      { error: "session_id inválido" },
      { status: 400 },
    );
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items.data.price", "subscription"],
    });

    const paid =
      session.payment_status === "paid" ||
      session.payment_status === "no_payment_required" ||
      session.status === "complete";

    if (!paid) {
      return NextResponse.json(
        {
          ok: false,
          error: "El pago aún no está completado",
          payment_status: session.payment_status,
        },
        { status: 402 },
      );
    }

    let plan: PlanId = planFromCheckoutMetadata(session.metadata);

    if (plan === "free") {
      const priceId =
        session.line_items?.data?.[0]?.price &&
        typeof session.line_items.data[0].price === "object"
          ? session.line_items.data[0].price.id
          : null;
      plan = planFromPriceId(priceId);
    }

    if (plan === "free") {
      return NextResponse.json(
        { ok: false, error: "No se pudo determinar el plan de la sesión" },
        { status: 422 },
      );
    }

    return NextResponse.json({
      ok: true,
      plan,
      customerEmail: session.customer_details?.email ?? session.customer_email,
      subscriptionId:
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id ?? null,
    });
  } catch (err) {
    console.error("[stripe/session]", err);
    const message =
      err instanceof Error ? err.message : "Error al verificar la sesión";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
