import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Qualité & savoir-faire",
  description:
    "Gravure laser de précision, matériaux nobles et contrôle qualité : découvrez notre savoir-faire.",
};

const commitments = [
  {
    title: "Gravure laser de précision",
    body: "Chaque gravure est réalisée au laser pour un trait net, durable et fidèle à votre aperçu, jusque dans les plus fins détails.",
  },
  {
    title: "Des matériaux nobles",
    body: "Argent massif 925, acier inoxydable plaqué or, ou or 18 carats : des matières choisies pour traverser le temps.",
  },
  {
    title: "Contrôle à l'unité",
    body: "Chaque pièce est inspectée à la main avant l'expédition. Aucune ne part sans avoir été vérifiée.",
  },
  {
    title: "Fabrication responsable",
    body: "Production à la commande, sans surstock, et emballages soignés en matériaux recyclables.",
  },
];

export default function QualitePage() {
  return (
    <>
      <PageHeader
        eyebrow="Notre savoir-faire"
        title="Une qualité qui se transmet"
        subtitle="Parce qu'un bijou-souvenir doit durer toute une vie, nous ne transigeons sur rien."
      />

      <Container className="py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {commitments.map((c) => (
            <div key={c.title} className="rounded-lg border border-line p-7">
              <h2 className="text-xl text-ink">{c.title}</h2>
              <p className="mt-3 leading-relaxed text-ink-soft">{c.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-lg bg-ink p-10 text-center text-cream">
          <p className="font-serif text-2xl">
            « Un bijou n'a de valeur que par l'histoire qu'il porte. »
          </p>
          <p className="mt-3 text-sm text-cream/60">L'atelier Jewel Memories</p>
        </div>
      </Container>
    </>
  );
}
