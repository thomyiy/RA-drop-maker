import Stripe from "stripe";

/**
 * Client Stripe (paiement de la commande).
 * Variable d'environnement : STRIPE_SECRET_KEY (sk_test_… ou sk_live_…).
 */

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

let cached: Stripe | null = null;

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY manquante.");
  cached ??= new Stripe(key);
  return cached;
}
