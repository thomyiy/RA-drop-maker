import { Hero, Section } from "@ras/ui";
import { dropConfig } from "@drop";

/**
 * Page d'accueil du template — composée depuis @ras/ui, pilotée par `drop.config.ts`.
 * À enrichir avec d'autres blocs (@ras/ui) et les flows (@ras/core).
 */
export default function Home() {
  const { brand, content, flow, theme } = dropConfig;

  return (
    <main>
      <Hero
        eyebrow={content.hero?.eyebrow ?? brand.tagline}
        title={content.hero?.title ?? [brand.name]}
        subtitle={brand.description}
        cta={{ label: content.hero?.cta ?? "Découvrir", href: "#" }}
        badges={content.badges}
      />
      <Section surface>
        <p style={{ fontSize: 13, color: "var(--color-mute)" }}>
          Template Rainbow Ant Studio · thème <strong>{theme}</strong> · flow <strong>{flow}</strong> · composé
          avec <code>@ras/ui</code>, piloté par <code>drop.config.ts</code>.
        </p>
      </Section>
    </main>
  );
}
