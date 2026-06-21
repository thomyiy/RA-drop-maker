import { Container } from "./container";

/** Mise en page typographique simple pour les pages de contenu légal. */
export function LegalLayout({
  title,
  updatedAt,
  children,
}: {
  title: string;
  updatedAt: string;
  children: React.ReactNode;
}) {
  return (
    <Container className="max-w-2xl py-16">
      <h1 className="text-3xl text-ink sm:text-4xl">{title}</h1>
      <p className="mt-2 text-sm text-ink-soft">Dernière mise à jour : {updatedAt}</p>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink-soft [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:text-ink">
        {children}
      </div>
    </Container>
  );
}
