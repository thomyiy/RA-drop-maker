import { Hero, Section } from "@thomyiy/ui";
import { dropConfig } from "@drop";

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
          Drop Rainbow Ant Studio · thème <strong>{theme}</strong> · flow <strong>{flow}</strong> ·
          composé avec <code>@thomyiy/ui</code>, piloté par <code>drop.config.ts</code>.
        </p>
      </Section>
    </main>
  );
}
