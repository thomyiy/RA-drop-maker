# Stock & production

À copier dans `apps/<drop>/project/stock.md`. Alimente le module `inventory`.

## Mode de production
- [ ] **À la commande** (made-to-order, pas de surstock)
- [ ] **Sur stock** (quantités définies)
- [ ] **Édition limitée** (quantité figée → compteur)

## Si stock / édition limitée
- [ ] Quantité totale :
- [ ] Seuil d'alerte / rupture :
- [ ] Numérotation des pièces ?

## Production
- [ ] Fournisseurs / ateliers partenaires :
- [ ] Matières & approvisionnement :
- [ ] Capacité de production (pièces/semaine) :
- [ ] Délai de réassort :
- [ ] Contrôle qualité (à l'unité ?) :

## Config à remplir
```ts
inventory: {
  mode: "made-to-order",   // "made-to-order" | "stock" | "limited-edition"
  quantity: 0,             // si édition limitée
  suppliers: [],
}
```
