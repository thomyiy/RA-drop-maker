# Fiscalité & finance

À copier dans `apps/<drop>/project/fiscalite.md`. Alimente le module `finance` de
`drop.config.ts`. **Repère, pas conseil fiscal** — valider avec un comptable.

## Structure & régime
- [ ] Structure porteuse (micro-entreprise / société) :
- [ ] Régime de TVA : franchise en base / réel · **taux** (20 % standard, 10 %, 5,5 %) :
- [ ] N° TVA intracommunautaire (si applicable) :

## Prix & marge (par produit)
> Le calculateur est dans `@thomyiy/config` : `priceBreakdown()` (HT/TVA/TTC) et `marginPct()`.

| Produit | Prix TTC | Prix HT | TVA | Coût revient | Marge |
|---|---|---|---|---|---|
| | | | | | |

- [ ] Les prix du catalogue sont en **TTC** ou **HT** ? (→ `finance.pricesIncludeVat`)
- [ ] Coût de revient unitaire (fab + matière + emballage) :
- [ ] **Marge cible** (%) :
- [ ] Frais de port (offerts ? seuil ?) :

## Seuils & rentabilité
- [ ] Point mort (nb de ventes pour couvrir les coûts fixes) :
- [ ] Seuil de franchise TVA surveillé (si micro) :
- [ ] Objectif de CA du drop :

## Config à remplir
```ts
finance: {
  currency: "EUR",
  vatRate: 20,
  pricesIncludeVat: true,
  regime: "reel",            // "micro" | "reel" | "franchise"
  costOfGoods: 0,            // coût de revient moyen
  targetMargin: 0,           // %
  shipping: { price: 0, freeThreshold: 0 },
}
```
