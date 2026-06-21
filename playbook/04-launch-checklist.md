# Checklist mise en ligne (go-live technique)

À copier dans `apps/<drop>/project/launch-checklist.md`. À dérouler avant d'ouvrir au public.

## Domaine & hébergement (Railway)
- [ ] Domaine acheté + DNS configuré (dédié par collab, ou sous-domaine)
- [ ] Service Railway créé (root dir = `apps/<drop>`, build pnpm filtré)
- [ ] HTTPS / certificat OK
- [ ] Variables d'environnement de **production** définies

## Intégrations (clés live)
- [ ] `STRIPE_SECRET_KEY` (live) + webhook si besoin · paiement test réel OK
- [ ] `NOTION_TOKEN` + `NOTION_LEADS_DATABASE_ID` · lead test arrive bien
- [ ] `GEMINI_API_KEY` · conversion photo testée (si flow `configurator`)
- [ ] `NEXT_PUBLIC_SITE_URL` = domaine de prod (redirections paiement)

## SEO & partage
- [ ] Titres + métadonnées par page
- [ ] Image OG (1200×630) + favicon
- [ ] `sitemap.xml` + `robots.txt`
- [ ] URLs propres, pas de page de test indexée

## Qualité
- [ ] Responsive mobile / tablette / desktop
- [ ] Performance (images optimisées, LCP correct)
- [ ] Accessibilité de base (contrastes, alt, focus)
- [ ] 404 et états vides soignés
- [ ] Build & lint verts (`pnpm build`, `pnpm lint`)

## Mesure
- [ ] Analytics installé (trafic + conversions)
- [ ] Suivi des commandes / paiements
- [ ] Alerte erreurs (monitoring)

## Légal présent (cf. `05-legal-checklist.md`)
- [ ] Mentions légales · CGV · Confidentialité · Cookies

## Go / No-go
- [ ] Commande de bout en bout validée
- [ ] Sauvegarde / rollback possible
- [ ] Responsable de surveillance identifié pour le Jour J
