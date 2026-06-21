import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Merci pour votre commande",
  robots: { index: false },
};

/** Page de confirmation après un paiement Stripe réussi. */
export default function PaiementSuccesPage() {
  return (
    <Container className="max-w-xl py-20 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-2xl text-gold-dark">
        ✓
      </div>
      <h1 className="mt-5 text-3xl text-ink sm:text-4xl">Merci !</h1>
      <p className="mt-4 text-ink-soft">
        Votre paiement a bien été reçu. Nous lançons la fabrication de votre
        pendentif gravé et vous tenons informé par email à chaque étape.
      </p>
      <div className="mt-8">
        <ButtonLink href="/">Retour à l&apos;accueil</ButtonLink>
      </div>
    </Container>
  );
}
