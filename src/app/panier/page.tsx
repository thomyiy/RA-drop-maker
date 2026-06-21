import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { getCart, formatMoney } from "@/lib/shopify";

export const metadata: Metadata = {
  title: "Panier",
};

export default async function PanierPage() {
  const cart = await getCart();

  return (
    <Container className="py-16">
      <h1 className="text-3xl text-ink sm:text-4xl">Votre panier</h1>

      {cart.lines.length === 0 ? (
        <div className="mt-10 rounded-lg border border-line bg-sand/30 p-12 text-center">
          <p className="text-ink-soft">Votre panier est vide pour l'instant.</p>
          <div className="mt-6">
            <ButtonLink href="/configurateur">Créer mon pendentif</ButtonLink>
          </div>
        </div>
      ) : (
        <div className="mt-10">
          {/* Le rendu des lignes et le checkout Shopify arrivent en Phase 3. */}
          <p className="text-ink-soft">
            Sous-total : {formatMoney(cart.subtotal)}
          </p>
        </div>
      )}
    </Container>
  );
}
