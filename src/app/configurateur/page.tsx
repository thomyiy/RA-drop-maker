import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { engravingModes, materials, pendantSupports } from "@/lib/config/catalog";

export const metadata: Metadata = {
  title: "Créer mon pendentif",
  description:
    "Composez votre pendentif gravé sur mesure : support, matière et gravure, avec aperçu en direct.",
};

/**
 * Configurateur — version d'amorçage (Phase 0).
 *
 * À ce stade, on pose la structure du parcours (support → matière → gravure
 * → aperçu). La logique interactive (canvas, upload, panier) sera implémentée
 * en Phase 2 et au-delà.
 */
export default function ConfigurateurPage() {
  return (
    <Container className="py-12">
      <div className="mb-8">
        <p className="eyebrow mb-2">Configurateur</p>
        <h1 className="text-3xl text-ink sm:text-4xl">Composez votre pendentif</h1>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        {/* Colonne de gauche : aperçu */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="flex aspect-square items-center justify-center rounded-lg border border-line bg-gradient-to-br from-sand to-cream">
            <div className="text-center">
              <div className="font-serif text-3xl text-gold">Aperçu</div>
              <p className="mt-2 text-sm text-ink-soft">
                La prévisualisation en direct arrive en Phase 2.
              </p>
            </div>
          </div>
        </div>

        {/* Colonne de droite : étapes */}
        <div className="space-y-10">
          <Step n={1} title="Choisissez votre support">
            <div className="grid grid-cols-2 gap-3">
              {pendantSupports.map((s) => (
                <div
                  key={s.id}
                  className="rounded-lg border border-line p-4 text-sm hover:border-gold"
                >
                  <span className="text-ink">{s.name}</span>
                  <br />
                  <span className="text-ink-soft">{s.shape}</span>
                </div>
              ))}
            </div>
          </Step>

          <Step n={2} title="Choisissez la matière">
            <div className="flex flex-wrap gap-3">
              {materials.map((m) => (
                <span
                  key={m.id}
                  className="rounded-full border border-line px-4 py-2 text-sm text-ink hover:border-gold"
                >
                  {m.name}
                </span>
              ))}
            </div>
          </Step>

          <Step n={3} title="Choisissez le mode de gravure">
            <div className="grid gap-3 sm:grid-cols-2">
              {engravingModes.map((mode) => (
                <div
                  key={mode.id}
                  className="rounded-lg border border-line p-4 text-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-ink">{mode.name}</span>
                    {!mode.available && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-gold-dark">
                        Bientôt
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-ink-soft">{mode.short}</p>
                </div>
              ))}
            </div>
          </Step>

          <div className="rounded-lg border border-dashed border-gold/50 bg-gold/5 p-5 text-sm text-ink-soft">
            🛠️ Le configurateur interactif (saisie, upload photo, aperçu en
            direct sur le bijou et ajout au panier) sera développé dans les
            prochaines phases. Cette page pose le parcours et le design.
          </div>

          <ButtonLink href="/modeles" variant="outline">
            ← Revenir aux modèles
          </ButtonLink>
        </div>
      </div>
    </Container>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-4 flex items-center gap-3 text-lg text-ink">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-xs text-cream">
          {n}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}
