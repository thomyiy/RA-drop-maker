---
name: new-drop
description: Créer un nouveau drop (site/marque/collection) dans le monorepo ras-stack. Utiliser quand on lance un nouveau projet/produit/collab. Pose les questions des modules, scaffolde l'app, remplit la config et les docs de lancement.
---

# Créer un nouveau drop

Tu es l'assistant de lancement de **Rainbow Ant Studio**. Objectif : monter un nouveau drop
en réutilisant le **cœur commun** (`@thomyiy/*`), **sans jamais forker le cœur**.

Lis d'abord `AGENTS.md` et `docs/atelier-stack-plan.md` (modèle « un drop = des modules »).

## 1. Recueillir les infos (les « modules »)
Poser les questions, module par module (cf. templates `playbook/`). Ne pas tout demander d'un
coup : aller à l'essentiel d'abord (cadrage, produits, flow, thème), le reste peut suivre.

- **Cadrage** (`brand`) : nom, baseline, description, email, domaine, instagram.
- **Identité** (`theme`) : thème existant (`editorial`, `thelma`) ou nouveau → ajouter une clé
  dans `packages/themes/src/themes.json` puis l'utiliser.
- **Produits** (`catalog`) : produits, options, **prix**.
- **Flow** : `configurator` · `simple` · `quote`.
- **Modules ops** (optionnels) : `finance` (TVA, marge…), `logistics`, `inventory`,
  `accounting`. Utiliser le calculateur `priceBreakdown` / `marginPct` de `@thomyiy/config`.
- **Intégrations** : `payment` (stripe), `leads` (notion/webhook), `ai` (gemini).

## 2. Scaffolder
```bash
node tooling/new-drop/scaffold.mjs <slug> "<Nom de marque>"
```
→ crée `apps/<slug>` (copie de `apps/_template`) et seed `apps/<slug>/project/` depuis
`playbook/`.

## 3. Remplir
- `apps/<slug>/drop.config.ts` : tous les champs collectés (validé par zod `defineDrop`).
- `apps/<slug>/project/*.md` : cocher/compléter les checklists de lancement.
- Si nouveau thème : l'ajouter à `@thomyiy/themes` (le même alimente site **et** maquettes PDF).

## 4. Vérifier
```bash
pnpm install
pnpm --filter <slug> build
pnpm --filter <slug> lint
```

## Règles
- Réutiliser `@thomyiy/config`, `@thomyiy/themes`, et (dès qu'ils existent) `@thomyiy/ui`, `@thomyiy/core`,
  `@thomyiy/commerce`. Le spécifique-marque vit **uniquement** dans `apps/<slug>`.
- Secrets via variables d'environnement, jamais en dur.
- Compat Next « maison » : lire `apps/<slug>/AGENTS.md` et `node_modules/next/dist/docs/`.
