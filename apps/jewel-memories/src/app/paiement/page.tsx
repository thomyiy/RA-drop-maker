import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Paiement",
  robots: { index: false },
};

/**
 * Étape de paiement — placeholder.
 *
 * Le prestataire de paiement n'est pas encore branché (Stripe recommandé).
 * Cette page matérialise la dernière étape du parcours en attendant.
 */
export default function PaiementPage() {
  return (
    <Container className="max-w-xl py-20 text-center">
      <p className="eyebrow mb-3">Dernière étape</p>
      <h1 className="text-3xl text-ink sm:text-4xl">Finaliser votre commande</h1>
      <p className="mt-4 text-ink-soft">
        Le paiement sécurisé sera disponible très prochainement. Votre
        configuration et vos coordonnées ont bien été enregistrées : nous
        revenons vers vous pour finaliser votre pendentif.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/configurateur" variant="outline">
          ← Revenir à ma création
        </ButtonLink>
        <ButtonLink href="/">Retour à l&apos;accueil</ButtonLink>
      </div>
    </Container>
  );
}
