# Mise en ligne — Jewel Memories

Copie de `playbook/04-launch-checklist.md`, état au fil de l'eau.

## Domaine & hébergement (Railway)
- [ ] Domaine `jewel-memories.fr` + DNS
- [ ] Service Railway (root `apps/jewel-memories`)
- [ ] HTTPS
- [ ] Variables d'environnement de production

## Intégrations (clés live)
- [x] Code paiement Stripe (`/api/checkout`, redirection Checkout) — *clé test*
- [ ] `STRIPE_SECRET_KEY` **live** + test de paiement réel
- [x] Code leads Notion (`/api/lead`) + repli webhook/log
- [ ] `NOTION_TOKEN` + `NOTION_LEADS_DATABASE_ID` + test lead réel
- [x] Conversion photo Gemini (`/api/convert`)
- [ ] `GEMINI_API_KEY` de prod + test
- [ ] `NEXT_PUBLIC_SITE_URL` = domaine de prod

## SEO & partage
- [ ] Métadonnées par page
- [ ] Image OG + favicon définitif
- [ ] sitemap.xml + robots.txt

## Qualité
- [x] Build & lint verts (`pnpm build`, `pnpm lint`)
- [ ] Responsive vérifié sur mobile
- [ ] Performance images
- [ ] Accessibilité de base

## Légal
- [x] Pages `/mentions-legales`, `/cgv`, `/confidentialite` présentes
- [ ] Contenu validé (cf. `playbook/05-legal-checklist.md`, dont exception rétractation)

## Go / No-go
- [ ] Commande de bout en bout validée en prod
- [ ] Responsable de surveillance Jour J
