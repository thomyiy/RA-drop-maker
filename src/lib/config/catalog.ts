/**
 * Catalogue produit (données mock).
 *
 * Cette couche décrit les options du configurateur : supports de pendentifs,
 * matières et modes de gravure.
 */

/** Mode de gravure proposé au client. */
export type EngravingMode = {
  id: "photo" | "texte" | "symbole";
  name: string;
  short: string;
  description: string;
  /** Disponible dès maintenant, ou bientôt (phases ultérieures). */
  available: boolean;
};

export const engravingModes: EngravingMode[] = [
  {
    id: "photo",
    name: "Photo en line art",
    short: "Votre photo transformée en trait",
    description:
      "Importez une photo (PNG ou JPEG) : notre IA la transforme en line art noir & blanc, prêt à graver. L'effet signature de Jewel Memories.",
    available: true,
  },
  {
    id: "texte",
    name: "Texte gravé",
    short: "Un prénom, une date, un mot",
    description:
      "Gravez un prénom, une date ou un message court. Choisissez la police, la taille et la position.",
    available: true,
  },
  {
    id: "symbole",
    name: "Symbole",
    short: "Cœur, infini, signe astral…",
    description:
      "Sélectionnez un motif dans notre bibliothèque de symboles et composez votre pendentif.",
    available: true,
  },
];

/** Matière d'un pendentif. */
export type Material = {
  id: string;
  name: string;
  description: string;
  /** Modificateur de prix appliqué au support, en euros. */
  priceModifier: number;
};

export const materials: Material[] = [
  {
    id: "argent-925",
    name: "Argent 925",
    description: "Argent massif, gravure nette et lumineuse.",
    priceModifier: 0,
  },
  {
    id: "acier-dore",
    name: "Acier doré",
    description: "Acier inoxydable plaqué or, résistant au quotidien.",
    priceModifier: 10,
  },
  {
    id: "or-jaune-18k",
    name: "Or jaune 18k",
    description: "Or massif 18 carats, pour les pièces d'exception.",
    priceModifier: 280,
  },
];

/** Support / forme de pendentif. */
export type PendantSupport = {
  id: string;
  name: string;
  shape: string;
  basePrice: number; // prix de base en euros (matière argent)
  image: string; // chemin public (placeholder pour l'instant)
};

export const pendantSupports: PendantSupport[] = [
  {
    id: "medaille-ronde",
    name: "Médaille ronde",
    shape: "Ronde · Ø 18 mm",
    basePrice: 59,
    image: "/products/medaille-ronde.svg",
  },
  {
    id: "plaque-rectangle",
    name: "Plaque rectangle",
    shape: "Rectangle · 25 × 15 mm",
    basePrice: 64,
    image: "/products/plaque-rectangle.svg",
  },
  {
    id: "coeur",
    name: "Cœur",
    shape: "Cœur · 17 mm",
    basePrice: 62,
    image: "/products/coeur.svg",
  },
  {
    id: "ovale",
    name: "Médaillon ovale",
    shape: "Ovale · 22 × 16 mm",
    basePrice: 66,
    image: "/products/ovale.svg",
  },
];

/** Étapes du parcours « comment ça marche ». */
export const howItWorksSteps = [
  {
    title: "Choisissez votre support",
    description:
      "Forme du pendentif, matière (argent, acier doré, or) et chaîne assortie.",
  },
  {
    title: "Composez la gravure",
    description:
      "Texte, photo ou symbole : prévisualisez le rendu en direct sur votre bijou.",
  },
  {
    title: "Nous gravons à la main",
    description:
      "Chaque pièce est gravée au laser dans notre atelier, puis contrôlée une à une.",
  },
  {
    title: "Livraison soignée",
    description:
      "Votre bijou arrive sous écrin, prêt à offrir, en 7 à 10 jours ouvrés.",
  },
];
