# apps/_template — point de départ d'un drop

App **minimale, pilotée par config + thème** : la page d'accueil se rend depuis
`drop.config.ts` et le thème de `@thomyiy/themes`. Sert de base à copier pour un nouveau drop.

> ⚠️ Rôle : **dogfood in-repo** — vérifie en CI que le cœur (`@thomyiy/*`) compose bien une
> app via le workspace. **Ce n'est pas** le template d'un nouveau drop : un drop réel est un
> **repo séparé** généré par `/new-drop` à partir de **`templates/drop/`** (qui consomme les
> `@thomyiy/*` publiés). Cf. `docs/polyrepo-publication.md`.

## Contenu
- `drop.config.ts` — squelette de config (brand, theme, flow, modules ops…)
- `src/app/layout.tsx` — injecte les tokens du thème en variables CSS
- `src/app/page.tsx` — landing rendue depuis la config
- `globals.css` — reset minimal (couleurs/typo via variables de thème)

## À enrichir (au fil des phases)
- `@thomyiy/ui` : composants thémables (Hero, Steps, BeforeAfter…)
- `@thomyiy/core` : flows (Configurator · SimpleProduct · Quote)
- `@thomyiy/commerce` : Stripe, leads, conversion IA
