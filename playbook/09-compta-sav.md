# Compta & SAV

À copier dans `apps/<drop>/project/compta-sav.md`. Alimente le module `accounting`.

## Facturation
- [ ] Émission des factures : Stripe / manuel / aucun
- [ ] Mentions légales facture (raison sociale, SIREN, TVA) :
- [ ] Export comptable (outil, fréquence) :
- [ ] Rapprochement paiements Stripe ↔ commandes :

## Retours & remboursements
- [ ] Retours autorisés ? (⚠️ **produit personnalisé = pas de rétractation**, art. L221-28)
- [ ] Fenêtre de retour (jours) si applicable :
- [ ] Politique de remboursement (défaut, casse, erreur) :
- [ ] Procédure SAV (contact, délai de réponse) :

## Suivi client
- [ ] Emails transactionnels (confirmation, expédition) :
- [ ] Gestion des réclamations :
- [ ] Médiateur de la consommation (obligatoire B2C) :

## Config à remplir
```ts
accounting: {
  invoicing: "stripe",      // "stripe" | "manual" | "none"
  returns: { enabled: false, note: "Personnalisé : non remboursable (hors défaut)." },
}
```
