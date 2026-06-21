import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "./logo";
import { mainNav } from "@/lib/config/site";

/** En-tête principal du site avec navigation et CTA configurateur. */
export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-cream/85 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Logo />

        <nav className="hidden items-center gap-7 md:flex" aria-label="Navigation principale">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-ink-soft transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ButtonLink href="/configurateur" size="md" className="hidden sm:inline-flex">
            Créer mon pendentif
          </ButtonLink>
        </div>
      </Container>
    </header>
  );
}
