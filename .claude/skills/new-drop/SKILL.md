---
name: new-drop
description: Créer un nouveau drop (site/marque/collection) dans SON PROPRE repo, scaffoldé par RA-drop-maker et consommant les libs @thomyiy/*. Utiliser au lancement d'un projet/produit/collab. Pose les questions des modules, génère le repo du drop, remplit la config et les docs de lancement.
---

# Créer un nouveau drop (repo séparé)

Tu es l'assistant de lancement de **Rainbow Ant Studio**. Objectif : générer un nouveau drop
**dans son propre repo**, qui réutilise le cœur publié `@thomyiy/*`, **sans jamais le forker**.

Lis d'abord `AGENTS.md`, `docs/atelier-stack-plan.md` (modèle « un drop = des modules ») et
`docs/polyrepo-publication.md` (publication/consommation des libs).

## 1. Recueillir les infos (les « modules »)
Module par module (cf. templates `playbook/`). Aller à l'essentiel d'abord (cadrage, produits,
flow, thème) ; le reste peut suivre.

- **Cadrage** (`brand`) : nom, baseline, description, email, domaine, instagram.
- **Identité** (`theme`) : thème existant (`editorial`, `thelma`) ou nouveau → l'ajouter dans
  `packages/themes/src/themes.json` **de RA-drop-maker** (puis republier @thomyiy/themes).
- **Produits** (`catalog`) : produits, options, **prix**.
- **Flow** : `configurator` · `simple` · `quote`.
- **Modules ops** (optionnels) : `finance` (TVA, marge — calc `priceBreakdown`/`marginPct`),
  `logistics`, `inventory`, `accounting`.
- **Intégrations** : `payment` (stripe), `leads` (notion/webhook), `ai` (gemini).

## 2. Générer le repo du drop
```bash
pnpm new-drop <slug> "<Nom de marque>"      # → crée ../<slug> (repo séparé)
# ou : node tooling/new-drop/scaffold.mjs <slug> "<Nom>" [targetDir]
```
→ copie `templates/drop/` (consomme `@thomyiy/*`) et seed `<slug>/project/` depuis `playbook/`.

## 3. Remplir
- `<slug>/drop.config.ts` : champs collectés (validé par zod `defineDrop`).
- `<slug>/project/*.md` : checklists de lancement.

## 4. Lancer le drop
```bash
cd ../<slug>
export GITHUB_TOKEN=...        # read:packages (cf. .npmrc)
pnpm install && pnpm build && pnpm lint
git init && git add -A && git commit -m "init"   # puis créer le repo GitHub + push
```
> Prérequis : les libs `@thomyiy/*` doivent être **publiées** (sinon `pnpm install` échoue).
> Publier depuis RA-drop-maker : `pnpm changeset && pnpm version-packages && pnpm release`.

## Règles
- Réutiliser `@thomyiy/{config,themes,ui,core,commerce}`. Le spécifique-marque vit
  **uniquement** dans le repo du drop (`drop.config.ts` + thème + assets + `project/`).
- Un besoin récurrent **remonte dans le cœur** (RA-drop-maker), il ne se duplique pas.
- Secrets via variables d'environnement, jamais en dur.
- Compat Next « maison » : lire `node_modules/next/dist/docs/` avant d'écrire du code Next.
