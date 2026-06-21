import { defineDrop } from "@ras/config";

/**
 * Configuration du drop « Jewel Memories ».
 * Source unique du spécifique-marque : alimente le site (siteConfig dérivé)
 * et, à terme, le générateur de maquettes.
 */
export const dropConfig = defineDrop({
  brand: {
    name: "Jewel Memories",
    tagline: "Vos souvenirs, gravés pour toujours",
    description:
      "Des pendentifs gravés sur mesure d'après vos souvenirs : un prénom, une photo, un symbole.",
    email: "contact@jewel-memories.com",
    instagram: "https://instagram.com/jewelmemories",
    domain: "jewel-memories.fr",
  },

  theme: "editorial", // identité visuelle actuelle de l'app (cf. @ras/themes)
  flow: "configurator",

  catalog: [
    { id: "medaille-ronde", name: "Médaille ronde", meta: "Ronde · Ø 18 mm", basePrice: 59 },
    { id: "plaque-rectangle", name: "Plaque rectangle", meta: "Rectangle · 25 × 15 mm", basePrice: 64 },
    { id: "coeur", name: "Cœur", meta: "Cœur · 17 mm", basePrice: 62 },
    { id: "medaillon-ovale", name: "Médaillon ovale", meta: "Ovale · 22 × 16 mm", basePrice: 66 },
  ],

  content: {
    badges: ["Livraison 7–10 j", "Écrin offert", "Fabrication française"],
  },

  integrations: {
    payment: "stripe",
    leads: "notion",
    ai: "gemini",
  },
});

export default dropConfig;
