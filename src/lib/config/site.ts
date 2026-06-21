/**
 * Configuration globale du site (nom, navigation, coordonnées).
 */
export const siteConfig = {
  name: "Jewel Memories",
  tagline: "Vos souvenirs, gravés pour toujours",
  description:
    "Des pendentifs gravés sur mesure d'après vos souvenirs : un prénom, une photo, un symbole.",
  email: "contact@jewel-memories.com",
  instagram: "https://instagram.com/jewelmemories",
} as const;

export type NavItem = {
  label: string;
  href: string;
};

/** Navigation principale (header). */
export const mainNav: NavItem[] = [
  { label: "Comment ça marche", href: "/comment-ca-marche" },
  { label: "Nos modèles", href: "/modeles" },
  { label: "Qualité", href: "/qualite" },
  { label: "FAQ", href: "/faq" },
];

/** Liens de pied de page regroupés par colonne. */
export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Créer",
    items: [
      { label: "Créer mon pendentif", href: "/configurateur" },
      { label: "Nos modèles", href: "/modeles" },
      { label: "Comment ça marche", href: "/comment-ca-marche" },
    ],
  },
  {
    title: "La maison",
    items: [
      { label: "Qualité & savoir-faire", href: "/qualite" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Informations",
    items: [
      { label: "Mentions légales", href: "/mentions-legales" },
      { label: "CGV", href: "/cgv" },
      { label: "Confidentialité", href: "/confidentialite" },
    ],
  },
];
