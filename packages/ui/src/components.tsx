import type { CSSProperties, ReactNode } from "react";

/**
 * @ras/ui — composants thémables. Style via les variables CSS injectées par
 * @ras/themes (var(--color-*), var(--font-*), var(--radius-*)). Aucune dépendance
 * à Tailwind : utilisable par n'importe quel drop.
 */

type Variant = "primary" | "outline" | "accent";

export function Button({
  href = "#",
  variant = "primary",
  full = false,
  children,
}: {
  href?: string;
  variant?: Variant;
  full?: boolean;
  children: ReactNode;
}) {
  const base: CSSProperties = {
    display: full ? "block" : "inline-block",
    textAlign: "center",
    padding: "14px 24px",
    borderRadius: "var(--radius-button)",
    fontWeight: 600,
    fontSize: 14,
    textDecoration: "none",
    cursor: "pointer",
    border: "1px solid transparent",
  };
  const variants: Record<Variant, CSSProperties> = {
    primary: { background: "var(--color-ink)", color: "var(--color-on-ink)" },
    accent: { background: "var(--color-accent)", color: "var(--color-on-accent)" },
    outline: { background: "transparent", color: "var(--color-ink)", borderColor: "var(--color-ink)" },
  };
  return (
    <a href={href} style={{ ...base, ...variants[variant] }}>
      {children}
    </a>
  );
}

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        border: "1px solid var(--color-line)",
        borderRadius: 999,
        padding: "8px 14px",
        fontSize: 13,
        color: "var(--color-ink-soft)",
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--color-accent)" }} />
      {children}
    </span>
  );
}

export function Container({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", ...style }}>{children}</div>;
}

export function Section({
  children,
  surface = false,
  style,
}: {
  children: ReactNode;
  surface?: boolean;
  style?: CSSProperties;
}) {
  return (
    <section style={{ background: surface ? "var(--color-surface)" : "var(--color-bg)", padding: "72px 0", ...style }}>
      <Container>{children}</Container>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p style={{ textTransform: "uppercase", letterSpacing: "0.16em", fontSize: 12, fontWeight: 600, color: "var(--color-mute)" }}>
      {children}
    </p>
  );
}

export function Hero({
  eyebrow,
  title,
  subtitle,
  cta,
  badges = [],
}: {
  eyebrow?: string;
  title: string[];
  subtitle?: string;
  cta?: { label: string; href?: string };
  badges?: string[];
}) {
  return (
    <Section>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h1
        style={{
          fontFamily: "var(--font-display), Georgia, serif",
          fontSize: 60,
          lineHeight: 1.04,
          color: "var(--color-ink)",
          margin: "14px 0 0",
        }}
      >
        {title.map((line, i) => (
          <span key={i} style={{ display: "block", color: i === title.length - 1 ? "var(--color-accent-dark)" : "var(--color-ink)" }}>
            {line}
          </span>
        ))}
      </h1>
      {subtitle ? (
        <p style={{ marginTop: 20, maxWidth: 540, fontSize: 17, color: "var(--color-ink-soft)" }}>{subtitle}</p>
      ) : null}
      <div style={{ marginTop: 28, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        {cta ? <Button href={cta.href}>{cta.label}</Button> : null}
        {badges.map((b) => (
          <Badge key={b}>{b}</Badge>
        ))}
      </div>
    </Section>
  );
}

export function Steps({ items }: { items: { title: string; body: string }[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${items.length}, 1fr)`, gap: 26 }}>
      {items.map((s, i) => (
        <div key={i}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 30, color: "var(--color-accent-soft)" }}>
            {String(i + 1).padStart(2, "0")}
          </div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--color-ink)", margin: "8px 0 6px" }}>
            {s.title}
          </h3>
          <p style={{ fontSize: 13, color: "var(--color-ink-soft)" }}>{s.body}</p>
        </div>
      ))}
    </div>
  );
}

export function ProductCard({
  name,
  meta,
  price,
  href = "#",
}: {
  name: string;
  meta?: string;
  price?: string;
  href?: string;
}) {
  return (
    <a
      href={href}
      style={{
        display: "block",
        textDecoration: "none",
        border: "1px solid var(--color-line)",
        borderRadius: "var(--radius-card)",
        padding: 20,
        background: "var(--color-surface)",
      }}
    >
      <div style={{ height: 120, borderRadius: 2, background: "var(--color-sand)", marginBottom: 14 }} />
      <div style={{ fontFamily: "var(--font-display)", fontSize: 17, color: "var(--color-ink)" }}>{name}</div>
      {meta ? <div style={{ fontSize: 12, color: "var(--color-mute)", marginTop: 2 }}>{meta}</div> : null}
      {price ? <div style={{ fontWeight: 700, color: "var(--color-accent-dark)", marginTop: 10 }}>{price}</div> : null}
    </a>
  );
}

export function ProductGrid({ children }: { children: ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 24 }}>{children}</div>;
}
