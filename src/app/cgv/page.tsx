import type { Metadata } from "next";
import { LegalLayout } from "@/components/ui/prose";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
};

export default function CgvPage() {
  return (
    <LegalLayout title="Conditions générales de vente" updatedAt="21/06/2026">
      <p>
        Les présentes conditions générales de vente régissent les ventes de
        bijoux personnalisés réalisées sur le site. Version provisoire à
        finaliser avant la mise en ligne commerciale.
      </p>
      <h2>Produits personnalisés</h2>
      <p>
        Les bijoux étant gravés à la demande, ils sont considérés comme
        confectionnés selon les spécifications du client et ne peuvent faire
        l'objet d'un droit de rétractation (art. L221-28 du Code de la
        consommation), sauf défaut de fabrication.
      </p>
      <h2>Prix et paiement</h2>
      <p>Les prix sont indiqués en euros, toutes taxes comprises.</p>
      <h2>Livraison</h2>
      <p>Livraison sous 7 à 10 jours ouvrés après validation de la commande.</p>
    </LegalLayout>
  );
}
