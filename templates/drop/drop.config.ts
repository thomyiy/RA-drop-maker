import { defineDrop } from "@thomyiy/config";

/**
 * Config du drop — SQUELETTE à remplir (cf. playbook/ + skill /new-drop).
 * Modules ops (finance, logistics, inventory, accounting) optionnels.
 */
export const dropConfig = defineDrop({
  brand: {
    name: "__NAME__",
    tagline: "Baseline à définir",
    description: "Description courte du projet à définir.",
    email: "contact@example.com",
  },

  theme: "thelma", // "editorial" | "thelma" | … (cf. @thomyiy/themes)
  flow: "simple", // "configurator" | "simple" | "quote"

  catalog: [],
  content: { badges: [] },
  integrations: { payment: "none", leads: "none", ai: "none" },
});

export default dropConfig;
