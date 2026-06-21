# Modèle polyrepo & publication des libs

## Le modèle
- **`RA-drop-maker`** = la **fabrique** : le cœur publiable (`@ras/*`), les outils
  (`/new-drop`, scaffold), le `playbook/`, les templates, et un **drop de référence**
  (`apps/jewel-memories`) pour développer/tester le cœur.
- **Chaque projet/drop = son propre repo**, scaffoldé par les outils RAS, qui **consomme
  `@ras/*` en dépendances versionnées** (publiées sur un registre privé).

```
RA-drop-maker (fabrique)                 mon-drop (repo séparé)
  packages/@ras/* ──published──▶ registre ──installed──▶ "@ras/ui": "^0.1.0"
  tooling/new-drop ──scaffold──────────────────────────▶ structure du repo de drop
  playbook/ ──seed─────────────────────────────────────▶ project/*.md
```

## Versionnage (déjà en place)
- **changesets** : `pnpm changeset` (décrire un changement) → `pnpm version-packages`
  (bump + changelog) → `pnpm release` (publie les `@ras/*` modifiés).
- Les apps (`jewel-memories`, `drop-template`) sont **ignorées** (non publiées).

## ⚠️ Décision requise : registre + scope
Pour publier `@ras/*`, il faut fixer **où** et **sous quel scope**.

> **Contrainte GitHub Packages** : un package `@scope/x` ne se publie que si **`scope` ==
> le compte/org propriétaire** du repo. Le repo est actuellement sous **`thomyiy`** (compte
> perso) → en l'état, GitHub Packages n'accepterait que `@thomyiy/*`, pas `@ras/*`.

Options :

| Option | Scope | Pour | Action requise |
|---|---|---|---|
| **A. Org GitHub** (recommandé) | `@ras` ou `@rainbow-ant-studio` | garder la marque, publier sur GitHub Packages | créer une **org GitHub** (idéalement nommée `ras`) et y déplacer `RA-drop-maker` |
| **B. Compte perso** | `@thomyiy` | publier **tout de suite** sans org | renommer le scope `@ras` → `@thomyiy` partout |
| **C. Autre registre** | `@ras` | garder `@ras` sans org GitHub | npm privé / Verdaccio (héberger un registre) |

**Reco : Option A** (org GitHub `ras`) — garde le branding `@ras`, publication GitHub
Packages native, et prépare proprement le passage en repos séparés.

## Publier (une fois le scope/registre fixés)
`.npmrc` à la racine :
```
@ras:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```
Puis : `pnpm changeset && pnpm version-packages && pnpm release`.

## Consommer depuis un repo de drop
`.npmrc` du drop : mêmes lignes (`@ras:registry` + token).
`package.json` du drop :
```json
{ "dependencies": { "@ras/config": "^0.1.0", "@ras/themes": "^0.1.0", "@ras/ui": "^0.1.0",
  "@ras/core": "^0.1.0", "@ras/commerce": "^0.1.0" } }
```
`next.config.ts` : `transpilePackages: ["@ras/config","@ras/themes","@ras/ui","@ras/core","@ras/commerce"]`.

> Le scaffold `/new-drop` (version polyrepo) générera ce repo prêt à l'emploi — **après**
> que le scope/registre soit fixé.
