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
});

export type Brand = z.infer<typeof Brand>;
export type Product = z.infer<typeof Product>;
export type Content = z.infer<typeof Content>;
export type Integrations = z.infer<typeof Integrations>;
export type Drop = z.infer<typeof Drop>;
export type FlowName = z.infer<typeof Flow>;

/** Valide et normalise la config d'un drop (échoue tôt si invalide). */
export function defineDrop(input: z.input<typeof Drop>): Drop {
  return Drop.parse(input);
}
