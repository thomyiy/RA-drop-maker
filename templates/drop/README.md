# __NAME__

Drop **Rainbow Ant Studio**, scaffoldé depuis `RA-drop-maker`. Consomme les libs
mutualisées `@thomyiy/*` (publiées sur GitHub Packages) — **on ne forke pas le cœur**.

## Démarrer
```bash
export GITHUB_TOKEN=...   # token avec read:packages (cf. .npmrc)
pnpm install
pnpm dev
```

## Structure
- `drop.config.ts` — le spécifique-marque (brand, theme, flow, produits, modules ops)
- `src/app/*` — pages (rendues depuis la config + `@thomyiy/ui`)
- `project/` — docs de lancement (brief, roadmap, marketing, checklists)

## Déploiement
Railway (cf. `railway.json`) : `pnpm install && pnpm build` puis `pnpm start`.
Variables d'environnement : voir `.env.example`.
