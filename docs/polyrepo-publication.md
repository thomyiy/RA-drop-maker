# Modèle polyrepo & publication des libs

## Le modèle
- **`RA-drop-maker`** = la **fabrique** : le cœur publiable (`@thomyiy/*`), les outils
  (`/new-drop`, scaffold), le `playbook/`, les templates, et un **drop de référence**
  (`apps/jewel-memories`) pour développer/tester le cœur.
- **Chaque projet/drop = son propre repo**, scaffoldé par les outils RAS, qui **consomme
  `@thomyiy/*` en dépendances versionnées** (publiées sur GitHub Packages).

```
RA-drop-maker (fabrique)                         mon-drop (repo séparé)
  packages/@thomyiy/* ──publish──▶ GitHub Packages ──install──▶ "@thomyiy/ui": "^0.1.0"
  tooling/new-drop ──scaffold──────────────────────────────▶ structure du repo de drop
  playbook/ ──seed─────────────────────────────────────────▶ project/*.md
```

## Registre & scope (décidé)
- **Scope** : `@thomyiy` (compte GitHub propriétaire) → publiable sur **GitHub Packages**.
- **Registre** : `https://npm.pkg.github.com` (cf. `.npmrc` + `publishConfig` des packages).

## Versionnage (en place)
- **changesets** : `pnpm changeset` (décrire un changement) → `pnpm version-packages`
  (bump + changelog) → `pnpm release` (publie les `@thomyiy/*` modifiés).
- Les apps (`jewel-memories`, `drop-template`) sont **ignorées** (non publiées).

## Publier (depuis la fabrique)
1. Auth : exporter un token GitHub avec le scope `write:packages` →
   `export GITHUB_TOKEN=...` (lu par `.npmrc`).
2. `pnpm changeset` → décrire le changement.
3. `pnpm version-packages` → bump des versions + changelogs.
4. `pnpm release` → publie sur GitHub Packages.

## Consommer depuis un repo de drop
`.npmrc` du drop :
```
@thomyiy:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
node-linker=hoisted
```
`package.json` du drop :
```json
{ "dependencies": {
  "@thomyiy/config": "^0.1.0", "@thomyiy/themes": "^0.1.0", "@thomyiy/ui": "^0.1.0",
  "@thomyiy/core": "^0.1.0", "@thomyiy/commerce": "^0.1.0"
} }
```
`next.config.ts` :
```ts
transpilePackages: ["@thomyiy/config","@thomyiy/themes","@thomyiy/ui","@thomyiy/core","@thomyiy/commerce"]
```

> Le scaffold `/new-drop` (version polyrepo) génère ce repo prêt à l'emploi (`.npmrc`,
> `package.json`, `next.config`, `drop.config.ts`, `project/` seedé). Voir `templates/drop/`.
