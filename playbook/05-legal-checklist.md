# Checklist légale (France / UE)

À copier dans `apps/<drop>/project/legal-checklist.md`. **Repère, pas conseil juridique** —
faire valider par un pro pour un lancement commercial.

## Pages obligatoires
- [ ] **Mentions légales** : éditeur (raison sociale, statut, SIREN), directeur de
      publication, hébergeur (Railway : nom + adresse), contact
- [ ] **CGV** : produits, prix TTC, commande, paiement, livraison & délais, droit de
      rétractation, garanties légales (conformité + vices cachés), réclamations, médiateur
- [ ] **Politique de confidentialité (RGPD)** : données collectées, finalités, base légale,
      durée, destinataires (Stripe, Notion, Gemini…), droits, contact DPO/référent
- [ ] **Cookies** : bandeau de consentement si traceurs non essentiels (analytics, ads)

## Spécificités à ne pas oublier
- [ ] **Produits personnalisés** : le droit de rétractation de 14 j **ne s'applique pas**
      aux biens personnalisés (art. L221-28 C. conso.) → le préciser dans les CGV
- [ ] **Données photo** (si conversion IA) : consentement d'usage, durée de conservation,
      suppression après traitement — déjà couvert côté app, à refléter dans la politique
- [ ] **Droits image / artiste** (collab) : contrat de cession/partage, crédits
- [ ] **TVA** : régime applicable, mentions sur factures
- [ ] **Médiateur de la consommation** : coordonnées indiquées (obligatoire e-commerce B2C)

## Côté technique (déjà en place dans le template)
- [ ] Routes `/mentions-legales`, `/cgv`, `/confidentialite` présentes et à jour
- [ ] Liens en pied de page
- [ ] Secrets hors du repo (variables d'environnement)
