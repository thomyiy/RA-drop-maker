import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { ButtonLink } from "@/components/ui/button";
import { howItWorksSteps } from "@/lib/config/catalog";

export const metadata: Metadata = {
  title: "Comment ça marche",
  description:
    "De votre souvenir au bijou gravé : découvrez les 4 étapes pour créer votre pendentif sur mesure.",
};

export default function CommentCaMarchePage() {
  return (
    <>
      <PageHeader
        eyebrow="Le processus"
        title="Comment ça marche"
        subtitle="Créer un bijou gravé n'a jamais été aussi simple. Tout se passe en ligne, en quelques minutes."
      />

      <Container className="py-16">
        <ol className="mx-auto max-w-2xl space-y-10">
          {howItWorksSteps.map((step, i) => (
            <li key={step.title} className="flex gap-6">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/40 font-serif text-xl text-gold-dark">
                {i + 1}
              </span>
              <div>
                <h2 className="text-xl text-ink">{step.title}</h2>
                <p className="mt-2 leading-relaxed text-ink-soft">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-16 text-center">
          <ButtonLink href="/configurateur" size="lg">
            Créer mon pendentif
          </ButtonLink>
        </div>
      </Container>
    </>
  );
}
