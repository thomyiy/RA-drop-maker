# RA-drop-maker — la fabrique à drops de Rainbow Ant Studio

**Le kit complet pour lancer une marque / un projet.** Ce repo est la **fabrique** : le cœur
publiable (`@ras/*`), les **outils** de lancement (`/new-drop`), le **playbook** (roadmaps,
marketing, légal), et un **drop de référence** (`apps/jewel-memories`).

> **Modèle polyrepo** : chaque projet/drop vit dans **son propre repo**, scaffoldé par ces
> outils et consommant les libs `@ras/*` **publiées**. Cf. `docs/polyrepo-publication.md`.

## Démarrer

```bash
pnpm install
pnpm dev          # lance les apps en dev (via turbo)
pnpm --filter jewel-memories dev   # une app en particulier
```

## Structure

| Dossier | Rôle |
|---|---|
| `packages/config`   | `@ras/config` — contrat d'un drop (schéma zod) |
| `packages/themes`   | `@ras/themes` — tokens design (site + maquettes) |
| `packages/ui`       | `@ras/ui` — composants thémables |
| `packages/core`     | `@ras/core` — flows d'achat composables |
| `packages/commerce` | `@ras/commerce` — Stripe, leads, conversion IA |
| `apps/*`            | les drops (sites) — code **+** `project/` (brief, roadmap, checklists remplis) |
| `playbook/`         | **lancement** : roadmap, brief, kit de marque, checklists marketing/mise en ligne/légal |
| `design/mockups`    | générateur de deck PDF |
| `docs/`             | plans & conventions |

> **Lancer un drop = code + ops + marketing**, tout est ici : le tech dans `apps/` +
> `packages/`, le savoir-faire de lancement dans `playbook/`, et les docs remplies du projet
> dans `apps/<drop>/project/`.

📐 Architecture & feuille de route : [`docs/atelier-stack-plan.md`](docs/atelier-stack-plan.md)
🤖 Conventions pour Claude Code : [`AGENTS.md`](AGENTS.md)

Déploiement : **Railway** · Gestionnaire de paquets : **pnpm** + **Turborepo**.
