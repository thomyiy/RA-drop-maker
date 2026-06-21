import { NextResponse } from "next/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export const runtime = "nodejs";

type CheckoutBody = {
  config?: {
    support?: string;
    material?: string;
    price?: number;
  };
  /** Email déjà capturé, pour préremplir Stripe (optionnel). */
  email?: string;
};

/**
 * POST /api/checkout
 * Crée une session Stripe Checkout pour la commande en cours et renvoie son URL.
 */
export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Paiement indisponible (clé STRIPE_SECRET_KEY non configurée)." },
      { status: 503 },
    );
  }

  let body: CheckoutBody;
  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const support = body.config?.support ?? "Pendentif personnalisé";
  const material = body.config?.material ?? "";
  const price = body.config?.price;

  if (typeof price !== "number" || price <= 0) {
    return NextResponse.json({ error: "Prix invalide." }, { status: 422 });
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ??
    request.headers.get("origin") ??
    new URL(request.url).origin;

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: Math.round(price * 100),
            product_data: {
              name: `Pendentif gravé — ${support}`,
              description: material ? `Matière : ${material}` : undefined,
            },
          },
        },
      ],
      customer_email: body.email,
      success_url: `${origin}/paiement/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/configurateur`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[/api/checkout] erreur:", err);
    return NextResponse.json(
      { error: "Impossible d'initier le paiement." },
      { status: 500 },
    );
  }
}
