/**
 * Couche commerce.
 *
 * ⚠️ Intégration Shopify (Phase 3) — à brancher ici.
 *
 * Le projet est conçu pour utiliser le **Shopify Storefront API** (GraphQL) :
 *   - SHOPIFY_STORE_DOMAIN      ex. "ma-boutique.myshopify.com"
 *   - SHOPIFY_STOREFRONT_TOKEN  jeton d'accès Storefront (public)
 *
 * En attendant les identifiants, on expose des fonctions mock avec la même
 * signature, afin que l'UI puisse être développée sans dépendance externe.
 */
import type { Cart, Money } from "./types";

const STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN;

/** Indique si une vraie connexion Shopify est configurée. */
export const isShopifyConfigured = Boolean(STORE_DOMAIN && STOREFRONT_TOKEN);

/** Formate un montant en euros pour l'affichage. */
export function formatMoney(money: Money): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: money.currencyCode,
    minimumFractionDigits: money.amount % 1 === 0 ? 0 : 2,
  }).format(money.amount);
}

/**
 * Récupère (ou crée) le panier courant.
 *
 * TODO(Phase 3): remplacer par une requête `cart` au Storefront API.
 */
export async function getCart(): Promise<Cart> {
  return {
    id: "mock-cart",
    lines: [],
    totalQuantity: 0,
    subtotal: { amount: 0, currencyCode: "EUR" },
  };
}
