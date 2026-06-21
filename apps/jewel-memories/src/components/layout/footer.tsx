import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Logo } from "./logo";
import { footerNav, siteConfig } from "@/lib/config/site";

/** Pied de page : liens, contact, mentions. */
export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-sand/40">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            {siteConfig.tagline}. Pendentifs gravés sur mesure, fabriqués avec
            soin dans notre atelier.
          </p>
        </div>

        {footerNav.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold text-ink">{col.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {col.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-ink-soft transition-colors hover:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <div className="border-t border-line">
        <Container className="flex flex-col items-center justify-between gap-3 py-5 text-xs text-ink-soft sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. Tous droits réservés.
          </p>
          <a
            href={siteConfig.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-ink"
          >
            Instagram
          </a>
        </Container>
      </div>
    </footer>
  );
}
