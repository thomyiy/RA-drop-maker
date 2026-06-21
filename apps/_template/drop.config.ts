import { defineDrop } from "@thomyiy/config";

/**
 * Config du drop — SQUELETTE à remplir (cf. playbook/ + skill /new-drop).
 * Tous les modules ops (finance, logistics, inventory, accounting) sont
 * optionnels : n'ajouter que ceux qui concernent le projet.
 */
export const dropConfig = defineDrop({
  brand: {
    name: "Nouveau drop",
    tagline: "Baseline à définir",
    description: "Description courte du projet à définir.",
    email: "contact@example.com",
    // instagram: "https://instagram.com/…",
    // domain: "mon-drop.fr",
  },

  theme: "thelma", // clé d'un thème de @thomyiy/themes ("editorial" | "thelma" | …)
  flow: "simple", // "configurator" | "simple" | "quote"

  catalog: [
    // { id: "produit-1", name: "Produit", basePrice: 0 },
  ],

  content: {
    badges: [],
    // hero: { title: ["Ligne 1", "Ligne 2"], cta: "Découvrir" },
  },

  integrations: {
    payment: "none", // "stripe" | "none"
    leads: "none", // "notion" | "webhook" | "none"
    ai: "none", // "gemini" | "none"
  },
});

export default dropConfig;
