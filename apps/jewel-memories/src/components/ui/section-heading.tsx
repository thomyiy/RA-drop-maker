import { Container } from "./container";
import { cn } from "@/lib/utils";

/** En-tête de section : surtitre + titre + sous-titre optionnel. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <Container
      className={cn(
        "max-w-2xl",
        align === "center" ? "text-center" : "text-left",
        className,
      )}
    >
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="text-3xl sm:text-4xl text-ink">{title}</h2>
      {subtitle && (
        <p className="mt-4 text-base leading-relaxed text-ink-soft">{subtitle}</p>
      )}
    </Container>
  );
}
