/** Concatène des classes conditionnelles (utilitaire léger, sans dépendance). */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
