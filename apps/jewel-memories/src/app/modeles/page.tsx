import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { ButtonLink } from "@/components/ui/button";
import { materials, pendantSupports } from "@/lib/config/catalog";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Nos modèles",
  description:
    "Découvrez nos formes de pendentifs et nos matières : argent 925, acier doré et or 18k.",
};

export default function ModelesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Nos modèles"
        title="Choisissez votre support"
        subtitle="Chaque forme est gravable. Sélectionnez la matière qui vous ressemble."
      />

      <Container className="py-16">
        {/* Supports */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pendantSupports.map((support) => (
            <article key={support.id} className="rounded-lg border border-line p-4">
              <div className="flex aspect-square items-center justify-center rounded bg-gradient-to-br from-sand to-cream">
                <span className="font-serif text-2xl text-gold">{support.name}</span>
              </div>
              <h2 className="mt-4 text-lg text-ink">{support.name}</h2>
              <p className="text-sm text-ink-soft">{support.shape}</p>
              <p className="mt-2 text-sm text-ink">
                dès {formatPrice(support.basePrice)}
              </p>
            </article>
          ))}
        </div>

        {/* Matières */}
        <section className="mt-20">
          <h2 className="text-2xl text-ink">Les matières</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {materials.map((m) => (
              <div key={m.id} className="rounded-lg border border-line bg-sand/30 p-6">
                <h3 className="text-lg text-ink">{m.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {m.description}
                </p>
                <p className="mt-3 text-sm font-medium text-gold-dark">
                  {m.priceModifier === 0
                    ? "Inclus"
                    : `+ ${formatPrice(m.priceModifier)}`}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-16 text-center">
          <ButtonLink href="/configurateur" size="lg">
            Personnaliser mon pendentif
          </ButtonLink>
        </div>
      </Container>
    </>
  );
}
