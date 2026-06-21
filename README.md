# Jewel Memories

Boutique de **pendentifs gravés sur mesure**. Le client compose son bijou en
ligne (support, matière, gravure), prévisualise le rendu, puis commande.
Inspiré du modèle de [thelma.pet](https://thelma.pet) (cadres personnalisés par
IA), transposé au bijou gravé.

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4**
- **Shopify Storefront API** pour le commerce (paiement, commandes, stock) — _à brancher (Phase 3)_
- Polices : Cormorant Garamond (titres) + Inter (corps)

## Démarrage

```bash
npm install
npm run dev
```

Le site tourne sur [http://localhost:3000](http://localhost:3000) avec des
**données mock** (`src/lib/config/catalog.ts`), sans dépendance externe.

Pour brancher Shopify : copier `.env.example` en `.env.local` et renseigner les
identifiants Storefront.

## Structure

```
src/
  app/                  Pages (App Router)
    page.tsx            Accueil
    comment-ca-marche/  Le processus
    modeles/            Supports & matières
    qualite/            Savoir-faire
    faq/                Questions fréquentes
    configurateur/      Configurateur (parcours posé, interactivité en Phase 2)
    panier/             Panier (checkout Shopify en Phase 3)
    mentions-legales/ · cgv/ · confidentialite/
  components/
    layout/             Header, Footer, Logo
    ui/                 Container, Button, SectionHeading, PageHeader…
  lib/
    config/             Données catalogue & site (mock)
    shopify/            Couche commerce (mock → Shopify)
```

## Feuille de route

- **Phase 0 — Fondations** ✅ design system, pages vitrine, parcours configurateur
- **Phase 2 —** configurateur interactif (texte + symboles, aperçu canvas)
- **Phase 3 —** panier + checkout Shopify
- **Phase 4 —** mode photo gravée (upload + filtre)
- **Phase 5 —** mode photo stylisée (pipeline IA)
- **Phase 6 —** SEO, responsive, RGPD, performance

## Modes de gravure prévus

1. **Texte** — prénom, date, message (police, taille, position)
2. **Symbole** — bibliothèque de motifs
3. **Photo gravée** — upload + rendu gravure
4. **Photo stylisée** — transformation artistique IA puis gravure (effet signature)
