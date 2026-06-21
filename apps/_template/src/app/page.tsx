import { getTheme } from "@ras/themes";
import { dropConfig } from "@drop";

/**
 * Page d'accueil du template — entièrement pilotée par `drop.config.ts`.
 * Sert de point de départ : à enrichir avec @ras/ui + @ras/core (flows).
 */
export default function Home() {
  const t = getTheme(dropConfig.theme).color;
  const { brand, content, flow, theme } = dropConfig;
  const title = content.hero?.title ?? [brand.name];
  const cta = content.hero?.cta ?? "Découvrir";

  return (
    <main style={{ maxWidth: 920, margin: "0 auto", padding: "96px 24px" }}>
      <p style={{ textTransform: "uppercase", letterSpacing: "0.16em", fontSize: 12, color: t.mute }}>
        {brand.tagline}
      </p>

      <h1
        style={{
          fontFamily: "var(--font-display), Georgia, serif",
          fontSize: 64,
          lineHeight: 1.02,
          color: t.ink,
          margin: "16px 0 0",
        }}
      >
        {title.map((line, i) => (
          <span key={i} style={{ display: "block", color: i === title.length - 1 ? t.accentDark : t.ink }}>
            {line}
          </span>
        ))}
      </h1>

      <p style={{ marginTop: 20, maxWidth: 540, fontSize: 17, color: t.inkSoft }}>
        {brand.description}
      </p>

      <div style={{ marginTop: 28, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <a
          href="#"
          style={{
            background: t.ink,
            color: t.onInk,
            padding: "14px 24px",
            borderRadius: "var(--radius-button)",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          {cta}
        </a>
        {content.badges.map((b) => (
          <span
            key={b}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              border: `1px solid ${t.line}`,
              borderRadius: 999,
              padding: "8px 14px",
              fontSize: 13,
              color: t.inkSoft,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: 999, background: t.accent }} />
            {b}
          </span>
        ))}
      </div>

      <footer style={{ marginTop: 80, paddingTop: 20, borderTop: `1px solid ${t.line}`, fontSize: 13, color: t.mute }}>
        Template Rainbow Ant Studio · thème <strong>{theme}</strong> · flow <strong>{flow}</strong>
        <br />
        Piloté par <code>drop.config.ts</code> + <code>@ras/themes</code>. À enrichir avec @ras/ui & @ras/core.
      </footer>
    </main>
  );
}
