# ras-stack — Rainbow Ant Studio

Monorepo de l'atelier : un **cœur commun** réutilisable (`packages/@ras/*`) et un dossier par
**drop** (`apps/*` — produits, art, bijoux, collabs artistes).

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
| `apps/*`            | les drops (sites) |
| `design/mockups`    | générateur de deck PDF |
| `docs/`             | plans & conventions |

📐 Architecture & feuille de route : [`docs/atelier-stack-plan.md`](docs/atelier-stack-plan.md)
🤖 Conventions pour Claude Code : [`AGENTS.md`](AGENTS.md)

Déploiement : **Railway** · Gestionnaire de paquets : **pnpm** + **Turborepo**.
