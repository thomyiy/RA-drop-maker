import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-cream hover:bg-gold-dark",
  outline: "border border-ink/20 text-ink hover:border-gold hover:text-gold-dark",
  ghost: "text-ink hover:text-gold-dark",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

/** Bouton-lien (usage principal : CTA vers le configurateur). */
export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: CommonProps & { href: string }) {
  return (
    <Link href={href} className={cn(base, variants[variant], sizes[size], className)}>
      {children}
    </Link>
  );
}

/** Bouton natif (formulaires, actions). */
export function Button({
  type = "button",
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
