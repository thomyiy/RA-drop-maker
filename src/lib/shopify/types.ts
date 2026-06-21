/**
 * Types du domaine commerce, indépendants de la source de données.
 * (Aujourd'hui alimentés par des données mock, demain par Shopify.)
 */

export type Money = {
  amount: number;
  currencyCode: "EUR";
};

/** Personnalisation attachée à un article du panier. */
export type EngravingCustomization = {
  mode: "texte" | "photo" | "photo-stylisee" | "symbole";
  /** Texte gravé, le cas échéant. */
  text?: string;
  /** Identifiant du symbole choisi, le cas échéant. */
  symbolId?: string;
  /** URL de l'image importée (CDN), le cas échéant. */
  imageUrl?: string;
};

export type CartLine = {
  id: string;
  supportId: string;
  materialId: string;
  quantity: number;
  unitPrice: Money;
  customization: EngravingCustomization;
};

export type Cart = {
  id: string;
  lines: CartLine[];
  totalQuantity: number;
  subtotal: Money;
};
