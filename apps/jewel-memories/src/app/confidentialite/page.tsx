import type { Metadata } from "next";
import { LegalLayout } from "@/components/ui/prose";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
};

export default function ConfidentialitePage() {
  return (
    <LegalLayout title="Politique de confidentialité" updatedAt="21/06/2026">
      <p>
        Nous accordons une grande importance à la protection de vos données
        personnelles et des photos que vous nous confiez. Version provisoire à
        finaliser avec un conseil juridique.
      </p>
      <h2>Photos importées</h2>
      <p>
        Les photos téléversées pour la gravure sont utilisées uniquement pour la
        réalisation de votre commande et ne sont jamais partagées à des fins
        commerciales.
      </p>
      <h2>Vos droits</h2>
      <p>
        Conformément au RGPD, vous disposez d'un droit d'accès, de rectification
        et de suppression de vos données en nous contactant.
      </p>
    </LegalLayout>
  );
}
