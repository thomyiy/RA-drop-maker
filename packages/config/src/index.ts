import { z } from "zod";

/**
 * @ras/config — le contrat d'un « drop » (un site/marque/projet).
 * Même schéma pour tous les drops : c'est ce que l'on remplit par projet.
 */

export const Brand = z.object({
  name: z.string(),
  tagline: z.string(),
  description: z.string(),
  email: z.string().email(),
  instagram: z.string().url().optional(),
  domain: z.string().optional(),
});

/** Parcours d'achat du drop. */
export const Flow = z.enum(["configurator", "simple", "quote"]);

export const Integrations = z.object({
  payment: z.enum(["stripe", "none"]).default("none"),
  leads: z.enum(["notion", "webhook", "none"]).default("none"),
  ai: z.enum(["gemini", "none"]).default("none"),
});

/* ------------------------------------------------------------------ *
 * Modules « ops » d'un drop (tous optionnels, remplis selon le projet)
 * ------------------------------------------------------------------ */

/** Fiscalité & finance (France). */
export const Finance = z.object({
  currency: z.string().default("EUR"),
  /** Taux de TVA en % (FR : 20, 10, 5.5). */
  vatRate: z.number().default(20),
  /** Les prix du catalogue sont-ils saisis TTC (true) ou HT (false) ? */
  pricesIncludeVat: z.boolean().default(true),
  /** Régime fiscal de la structure qui porte le drop. */
  regime: z.enum(["micro", "reel", "franchise"]).optional(),
  /** Coût de revient unitaire moyen (indicatif, pour la marge). */
  costOfGoods: z.number().optional(),
  /** Marge cible en %. */
  targetMargin: z.number().optional(),
  shipping: z
    .object({ price: z.number().default(0), freeThreshold: z.number().optional() })
    .optional(),
});

/** Logistique & expédition. */
export const Logistics = z.object({
  carriers: z.array(z.string()).default([]),
  /** Délai [min, max] en jours ouvrés. */
  leadTimeDays: z.tuple([z.number(), z.number()]).optional(),
  zones: z.array(z.string()).default([]),
  tracking: z.boolean().default(false),
});

/** Stock & production. */
export const Inventory = z.object({
  mode: z.enum(["made-to-order", "stock", "limited-edition"]).default("made-to-order"),
  /** Quantité pour une édition limitée. */
  quantity: z.number().optional(),
  suppliers: z.array(z.string()).default([]),
});

/** Compta & SAV. */
export const Accounting = z.object({
  invoicing: z.enum(["stripe", "manual", "none"]).default("none"),
  returns: z
    .object({
      enabled: z.boolean().default(false),
      windowDays: z.number().optional(),
      note: z.string().optional(),
    })
    .optional(),
});

export const ProductChoice = z.object({
  id: z.string(),
  label: z.string(),
  priceDelta: z.number().default(0),
});

export const OptionGroup = z.object({
  id: z.string(),
  label: z.string(),
  choices: z.array(ProductChoice),
});

export const Product = z.object({
  id: z.string(),
  name: z.string(),
  meta: z.string().optional(),
  basePrice: z.number().nonnegative(),
  optionGroups: z.array(OptionGroup).default([]),
});

export const Content = z
  .object({
    badges: z.array(z.string()).default([]),
    hero: z
      .object({
        eyebrow: z.string().optional(),
        title: z.array(z.string()),
        subtitle: z.string().optional(),
        cta: z.string(),
      })
      .optional(),
    steps: z.array(z.object({ title: z.string(), body: z.string() })).default([]),
    faq: z.array(z.object({ q: z.string(), a: z.string().optional() })).default([]),
    testimonials: z
      .array(z.object({ quote: z.string(), author: z.string() }))
      .default([]),
  })
  .default({});

export const Drop = z.object({
  brand: Brand,
  /** Clé d'un thème de @ras/themes (ex. "editorial", "thelma"). */
  theme: z.string(),
  flow: Flow,
  catalog: z.array(Product).default([]),
  content: Content,
  integrations: Integrations.default({}),
  // Modules ops (optionnels) — remplis projet par projet :
  finance: Finance.optional(),
  logistics: Logistics.optional(),
  inventory: Inventory.optional(),
  accounting: Accounting.optional(),
});

export type Brand = z.infer<typeof Brand>;
export type Product = z.infer<typeof Product>;
export type Content = z.infer<typeof Content>;
export type Integrations = z.infer<typeof Integrations>;
export type Finance = z.infer<typeof Finance>;
export type Logistics = z.infer<typeof Logistics>;
export type Inventory = z.infer<typeof Inventory>;
export type Accounting = z.infer<typeof Accounting>;
export type Drop = z.infer<typeof Drop>;
export type FlowName = z.infer<typeof Flow>;

/** Valide et normalise la config d'un drop (échoue tôt si invalide). */
export function defineDrop(input: z.input<typeof Drop>): Drop {
  return Drop.parse(input);
}

/* ------------------------------------------------------------------ *
 * Calculateur fiscalité / finance (helpers purs)
 * ------------------------------------------------------------------ */

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Décompose un montant en HT / TVA / TTC. */
export function priceBreakdown(
  amount: number,
  opts: { vatRate?: number; includesVat?: boolean } = {},
): { ht: number; vat: number; ttc: number } {
  const rate = (opts.vatRate ?? 20) / 100;
  const includes = opts.includesVat ?? true;
  const ht = includes ? amount / (1 + rate) : amount;
  const ttc = includes ? amount : amount * (1 + rate);
  return { ht: round2(ht), vat: round2(ttc - ht), ttc: round2(ttc) };
}

/** Marge en % à partir d'un prix HT et d'un coût de revient. */
export function marginPct(priceHt: number, costOfGoods: number): number {
  if (priceHt <= 0) return 0;
  return round2(((priceHt - costOfGoods) / priceHt) * 100);
}
