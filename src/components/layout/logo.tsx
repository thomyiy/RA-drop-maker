import Link from "next/link";
import { siteConfig } from "@/lib/config/site";

/** Logo textuel (wordmark) avec petit pictogramme de pendentif. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2.5 text-ink ${className ?? ""}`}
      aria-label={`${siteConfig.name} — accueil`}
    >
      <svg
        width="22"
        height="26"
        viewBox="0 0 22 26"
        fill="none"
        aria-hidden="true"
        className="text-gold"
      >
        <path
          d="M11 2.5 5 6v5l6 12 6-12V6l-6-3.5Z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <circle cx="11" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      <span className="font-serif text-xl tracking-tight">{siteConfig.name}</span>
    </Link>
  );
}
