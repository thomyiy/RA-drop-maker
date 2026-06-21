# apps/_template — point de départ d'un drop

App **minimale, pilotée par config + thème** : la page d'accueil se rend depuis
`drop.config.ts` et le thème de `@ras/themes`. Sert de base à copier pour un nouveau drop.

> ⚠️ Ne pas développer de fonctionnalités spécifiques ici. Ce dossier reste **générique**.
> Pour créer un drop, utiliser le skill **`/new-drop`** (ou `tooling/new-drop/scaffold.mjs`),
> qui copie ce template vers `apps/<slug>` et seed `project/` depuis `playbook/`.

## Contenu
- `drop.config.ts` — squelette de config (brand, theme, flow, modules ops…)
- `src/app/layout.tsx` — injecte les tokens du thème en variables CSS
- `src/app/page.tsx` — landing rendue depuis la config
- `globals.css` — reset minimal (couleurs/typo via variables de thème)

## À enrichir (au fil des phases)
- `@ras/ui` : composants thémables (Hero, Steps, BeforeAfter…)
- `@ras/core` : flows (Configurator · SimpleProduct · Quote)
- `@ras/commerce` : Stripe, leads, conversion IA
