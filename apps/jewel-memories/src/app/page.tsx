import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  engravingModes,
  howItWorksSteps,
  pendantSupports,
} from "@/lib/config/catalog";
import { formatPrice } from "@/lib/format";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <EngravingModes />
      <Gallery />
      <Testimonials />
      <FinalCta />
    </>
  );
}

/* ----------------------------- Hero ----------------------------- */
function Hero() {
  return (
    <section className="relative overflow-hidden">
      <Container className="grid items-center gap-12 py-20 md:grid-cols-2 md:py-28">
        <div className="max-w-xl">
          <p className="eyebrow mb-4">Bijoux gravés sur mesure</p>
          <h1 className="text-5xl leading-[1.05] text-ink sm:text-6xl">
            Un souvenir.
            <br />
            Un bijou gravé pour toujours.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ink-soft">
            Transformez un prénom, une photo ou un symbole qui compte en un
            pendentif gravé à la main. Composez-le en ligne, prévisualisez le
            rendu, et recevez votre pièce sous écrin.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <ButtonLink href="/configurateur" size="lg">
              Créer mon pendentif
            </ButtonLink>
            <Link
              href="/comment-ca-marche"
              className="text-sm font-medium text-ink-soft underline-offset-4 hover:text-ink hover:underline"
            >
              Comment ça marche →
            </Link>
          </div>
          <p className="mt-6 text-sm text-ink-soft">
            ✦ Fabrication artisanale · Livraison en 7–10 jours · Écrin offert
          </p>
        </div>

        <div className="relative">
          <PendantHeroVisual />
        </div>
      </Container>
    </section>
  );
}

/** Visuel illustratif du hero (placeholder SVG en attendant les photos). */
function PendantHeroVisual() {
  return (
    <div className="relative mx-auto aspect-4/5 w-full max-w-md rounded-lg border border-line bg-gradient-to-br from-sand to-cream shadow-sm">
      <svg
        viewBox="0 0 200 250"
        className="absolute inset-0 h-full w-full p-10 text-gold"
        fill="none"
      >
        <line x1="100" y1="0" x2="80" y2="70" stroke="currentColor" strokeWidth="1.5" />
        <line x1="100" y1="0" x2="120" y2="70" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="100" cy="135" r="62" stroke="currentColor" strokeWidth="2" />
        <circle cx="100" cy="135" r="52" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        <text
          x="100"
          y="148"
          textAnchor="middle"
          className="fill-current font-serif"
          fontSize="34"
        >
          Léa
        </text>
      </svg>
      <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs uppercase tracking-widest text-ink-soft">
        Aperçu de gravure
      </span>
    </div>
  );
}

/* -------------------------- How it works -------------------------- */
function HowItWorks() {
  return (
    <section id="comment-ca-marche" className="py-20">
      <SectionHeading
        eyebrow="Comment ça marche"
        title="De votre souvenir au bijou, en 4 étapes"
        subtitle="Un parcours simple et guidé, entièrement en ligne."
      />
      <Container className="mt-12">
        <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {howItWorksSteps.map((step, i) => (
            <li key={step.title} className="relative">
              <span className="font-serif text-4xl text-gold/70">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-lg text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

/* ------------------------ Engraving modes ------------------------ */
function EngravingModes() {
  return (
    <section className="bg-sand/40 py-20">
      <SectionHeading
        eyebrow="Personnalisation"
        title="Trois façons de graver votre histoire"
        subtitle="Photo en line art, texte ou symbole : choisissez le mode qui raconte votre souvenir."
      />
      <Container className="mt-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {engravingModes.map((mode) => (
            <div
              key={mode.id}
              className="flex flex-col rounded-lg border border-line bg-cream p-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg text-ink">{mode.name}</h3>
                {!mode.available && (
                  <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold-dark">
                    Bientôt
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm font-medium text-gold-dark">{mode.short}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                {mode.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ---------------------------- Gallery ---------------------------- */
function Gallery() {
  return (
    <section className="py-20">
      <SectionHeading
        eyebrow="Nos modèles"
        title="Des supports pensés pour durer"
        subtitle="Argent 925, acier doré ou or 18k — chaque forme est gravable selon vos envies."
      />
      <Container className="mt-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pendantSupports.map((support) => (
            <article key={support.id} className="group">
              <div className="flex aspect-square items-center justify-center rounded-lg border border-line bg-gradient-to-br from-sand to-cream transition-shadow group-hover:shadow-sm">
                <PendantShape id={support.id} />
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <h3 className="text-base text-ink">{support.name}</h3>
                <span className="text-sm text-ink-soft">
                  dès {formatPrice(support.basePrice)}
                </span>
              </div>
              <p className="text-sm text-ink-soft">{support.shape}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 text-center">
          <ButtonLink href="/modeles" variant="outline">
            Voir tous les modèles
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

/** Forme stylisée d'un pendentif (placeholder). */
function PendantShape({ id }: { id: string }) {
  const c = "stroke-gold";
  const common = { fill: "none", strokeWidth: 2 } as const;
  return (
    <svg viewBox="0 0 100 100" className="h-24 w-24">
      {id === "medaille-ronde" && <circle cx="50" cy="52" r="34" className={c} {...common} />}
      {id === "ovale" && <ellipse cx="50" cy="52" rx="28" ry="36" className={c} {...common} />}
      {id === "plaque-rectangle" && (
        <rect x="22" y="28" width="56" height="48" rx="6" className={c} {...common} />
      )}
      {id === "coeur" && (
        <path
          d="M50 80 L24 52 a16 16 0 0 1 26-20 a16 16 0 0 1 26 20 Z"
          className={c}
          {...common}
        />
      )}
    </svg>
  );
}

/* -------------------------- Testimonials -------------------------- */
const testimonials = [
  {
    quote:
      "J'ai fait graver le prénom de ma fille. Le rendu est délicat et la qualité irréprochable.",
    author: "Camille R.",
  },
  {
    quote:
      "Un cadeau parfait pour les 30 ans de mon compagnon. L'écrin et la finition font la différence.",
    author: "Sophie L.",
  },
  {
    quote:
      "Service au top, livraison rapide, et la gravure est exactement comme sur l'aperçu.",
    author: "Marc D.",
  },
];

function Testimonials() {
  return (
    <section className="bg-ink py-20 text-cream">
      <SectionHeading
        eyebrow="Avis clients"
        title="Ils ont gravé leur souvenir"
        className="[&_h2]:text-cream [&_p]:text-cream/70"
      />
      <Container className="mt-12">
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.author}
              className="rounded-lg border border-cream/15 bg-cream/5 p-6"
            >
              <div className="text-gold-soft" aria-hidden>
                ★★★★★
              </div>
              <blockquote className="mt-3 text-sm leading-relaxed text-cream/90">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-4 text-sm font-medium text-cream/70">
                {t.author}
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ---------------------------- Final CTA ---------------------------- */
function FinalCta() {
  return (
    <section className="py-24">
      <Container className="rounded-lg border border-line bg-sand/50 px-6 py-16 text-center">
        <h2 className="mx-auto max-w-2xl text-4xl text-ink">
          Et si votre prochain souvenir devenait un bijou ?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-ink-soft">
          Composez votre pendentif en quelques minutes et prévisualisez le rendu
          de la gravure en direct.
        </p>
        <div className="mt-8">
          <ButtonLink href="/configurateur" size="lg">
            Créer mon pendentif
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
