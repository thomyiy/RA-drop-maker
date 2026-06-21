# Rainbow Ant Studio — `RA-drop-maker` (la fabrique à drops)

Le **kit complet pour lancer une marque/projet** : le template tech **et** le savoir-faire de
lancement (roadmaps, marketing, légal). Ce repo est la **fabrique** : un **cœur publiable**
(`packages/@ras/*`), les **outils** (`/new-drop`), le **playbook**, et un **drop de
référence** (`apps/jewel-memories`).

> **Modèle polyrepo** : chaque drop vit dans **son propre repo**, scaffoldé par ces outils et
> consommant `@ras/*` **publiés** (cf. `docs/polyrepo-publication.md`). `apps/*` ici sert au
> dev/dogfood du cœur. Plan complet : **`docs/atelier-stack-plan.md`**.

## Règles d'or (non négociables)

1. **Ne forke jamais le cœur.** Le code spécifique à un drop vit **uniquement** dans son app
   (`apps/<drop>/`). Si un besoin est récurrent, il **remonte** dans `packages/*`, il ne se
   duplique pas.
2. **Ce qui change par drop = 3 choses** : le **thème** (`@ras/themes`), le **contenu &
   produits** (`drop.config.ts` de l'app), le **flow d'achat** (`@ras/core`). Tout le reste
   est mutualisé.
3. **Intégrations pilotées par variables d'environnement** (Stripe, Notion, Gemini). Jamais
   de secret en dur.
4. **Compat Next « maison ».** La version de Next ici a des conventions spécifiques : lis
   `apps/<app>/AGENTS.md` et `node_modules/next/dist/docs/` avant d'écrire du code Next. Ne
   présume pas des APIs d'après ta mémoire.

## Structure

```
packages/
  config/    @ras/config    contrat d'un drop (schéma zod, defineDrop)
  themes/    @ras/themes     tokens design → Tailwind preset + générateur PDF
  ui/        @ras/ui         composants thémables (Hero, Steps, BeforeAfter…)
  core/      @ras/core       flows : Configurator · SimpleProduct · Quote
  commerce/  @ras/commerce   Stripe, leads (Notion/webhook), conversion IA (Gemini)
apps/
  jewel-memories/            drop pilote (code)
    drop.config.ts           le spécifique-marque (validé par @ras/config)
    project/                 docs NON-code du drop : brief, roadmap, marketing, checklists
playbook/                    templates de lancement réutilisables (roadmap, marketing, légal…)
design/mockups/              générateur de deck PDF (mêmes thèmes que @ras/themes)
docs/                        plans & conventions
```

> **Un drop = code + ops + marketing.** Le code va dans `apps/<drop>` + `packages/*`. Les
> docs de lancement (brief, roadmap, checklists) vont dans `apps/<drop>/project/`, remplies à
> partir des templates de `playbook/`.

> État : les packages `@ras/*` sont des **stubs** ; ils sont remplis au fil des phases
> décrites dans `docs/atelier-stack-plan.md`.

## Outillage

- **pnpm** (workspaces) + **Turborepo**. `node-linker=hoisted` (cf. `.npmrc`) pour la compat.
- Scripts racine : `pnpm dev | build | lint` (délégués à `turbo`).
- Déploiement cible : **Railway** (un service par app, build pnpm filtré).
- Versionnage du cœur : semver + `changesets` (à mettre en place en Phase 3).

## Créer un nouveau drop

Utiliser le skill **`/new-drop`** (Claude Code pose les questions des modules, scaffolde et
remplit). Sous le capot :

```bash
pnpm new-drop <slug> "<Nom de marque>"   # copie apps/_template → apps/<slug> + seed project/
```

Puis remplir `apps/<slug>/drop.config.ts` (validé par `@ras/config`) et les docs
`apps/<slug>/project/*.md` (issues de `playbook/`). Détails : `.claude/skills/new-drop/`.
