import { Container } from "./container";

/** Bandeau d'en-tête standard pour les pages internes. */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="border-b border-line bg-sand/40">
      <Container className="max-w-3xl py-16 text-center">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="text-4xl text-ink sm:text-5xl">{title}</h1>
        {subtitle && (
          <p className="mx-auto mt-4 max-w-xl text-ink-soft">{subtitle}</p>
        )}
      </Container>
    </div>
  );
}
