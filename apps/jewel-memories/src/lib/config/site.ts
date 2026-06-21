import { dropConfig } from "@drop";

/**
 * Configuration globale du site, **dérivée du drop** (@ras/config).
 * Le spécifique-marque vit dans `drop.config.ts` — ne pas dupliquer ici.
 */
export const siteConfig = {
  name: dropConfig.brand.name,
  tagline: dropConfig.brand.tagline,
  description: dropConfig.brand.description,
  email: dropConfig.brand.email,
  instagram: dropConfig.brand.instagram ?? "",
};

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
