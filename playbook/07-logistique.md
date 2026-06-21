# Logistique & expédition

À copier dans `apps/<drop>/project/logistique.md`. Alimente le module `logistics`.

## Transport
- [ ] Transporteur(s) : (Colissimo, Mondial Relay, Chronopost, UPS…)
- [ ] Zones livrées : (FR, UE, international)
- [ ] Délais [min, max] jours ouvrés :
- [ ] Suivi/tracking fourni au client ?
- [ ] Tarifs par zone / poids :

## Emballage
- [ ] Écrin / packaging (le cas échéant) :
- [ ] Protection + matériaux (recyclables ?) :
- [ ] Insert / carte de remerciement / notice :

## Process
- [ ] Qui prépare & expédie (atelier, prestataire) ?
- [ ] Étiquettes & bordereaux (outil) :
- [ ] Gestion des retours / colis perdus :

## Config à remplir
```ts
logistics: {
  carriers: ["Colissimo"],
  leadTimeDays: [7, 10],
  zones: ["FR", "UE"],
  tracking: true,
}
```
