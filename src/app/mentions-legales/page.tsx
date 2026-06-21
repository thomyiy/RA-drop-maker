import type { Metadata } from "next";
import { LegalLayout } from "@/components/ui/prose";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Mentions légales",
};

export default function MentionsLegalesPage() {
  return (
    <LegalLayout title="Mentions légales" updatedAt="21/06/2026">
      <p>
        Le présent site est édité par {siteConfig.name}. Les informations
        légales définitives (raison sociale, SIRET, hébergeur, directeur de
        publication) seront complétées avant la mise en ligne.
      </p>
      <h2>Éditeur du site</h2>
      <p>{siteConfig.name} — contact : {siteConfig.email}</p>
      <h2>Hébergement</h2>
      <p>À compléter (ex. Vercel Inc.).</p>
      <h2>Propriété intellectuelle</h2>
      <p>
        L'ensemble des contenus (textes, visuels, créations) est la propriété de{" "}
        {siteConfig.name}, sauf mention contraire.
      </p>
    </LegalLayout>
  );
}
