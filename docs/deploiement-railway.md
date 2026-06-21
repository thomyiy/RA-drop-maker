# Déploiement Railway

Le monorepo se déploie en **un service Railway par app** (`apps/*`). Chaque service
build/start son app via un filtre pnpm, depuis la racine du dépôt (pour résoudre les
packages `@ras/*` du workspace).

## Créer un service pour une app

1. **New Project → Deploy from GitHub repo** → choisir `ras-stack` (ou `jewel-memories`).
2. Service settings :
   - **Root Directory** : `/` (racine — nécessaire pour le workspace pnpm).
   - **Config-as-code path** : `apps/<app>/railway.json` (build & start déjà définis).
     *(ou définir manuellement les commandes ci-dessous)*
   - **Watch Paths** *(optionnel)* : `apps/<app>/**`, `packages/**` — pour ne redéployer que
     quand l'app ou le cœur change.
3. **Variables d'environnement** (par service) — cf. `apps/<app>/.env.example` :
   - `STRIPE_SECRET_KEY`
   - `NOTION_TOKEN`, `NOTION_LEADS_DATABASE_ID`
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_SITE_URL` (= domaine de prod)
   - *(optionnel)* `NEXT_PUBLIC_GOOGLE_CLIENT_ID`, `LEAD_WEBHOOK_URL`
4. **Domaine** : ajouter le domaine dédié de la collab (ou un sous-domaine) dans Networking.

## Commandes (si config manuelle)

```bash
# Build
pnpm install --frozen-lockfile && pnpm --filter <app> build
# Start  (Railway fournit la variable PORT, respectée par `next start`)
pnpm --filter <app> start
```

## Notes
- **pnpm** est détecté via `packageManager` (racine `package.json`) + `pnpm-lock.yaml`.
- `node-linker=hoisted` (`.npmrc`) assure la compat du Next « maison ».
- Un nouveau drop = un nouveau service : copier `apps/<app>/railway.json`, adapter le filtre,
  et renseigner les variables d'environnement du drop.
