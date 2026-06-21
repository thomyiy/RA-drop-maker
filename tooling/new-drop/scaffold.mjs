#!/usr/bin/env node
/**
 * Scaffold d'un nouveau drop : copie apps/_template → apps/<slug>,
 * seed apps/<slug>/project/ depuis playbook/, et pré-remplit le nom.
 *
 * Usage : node tooling/new-drop/scaffold.mjs <slug> "<Nom de marque>"
 * Ex.    : node tooling/new-drop/scaffold.mjs ombre-studio "Ombre Studio"
 *
 * Ensuite : remplir drop.config.ts + les docs project/ (cf. skill /new-drop),
 * puis `pnpm install` et `pnpm --filter <slug> build`.
 */
import { cpSync, readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const [slug, ...nameParts] = process.argv.slice(2);
const name = nameParts.join(" ").trim();

if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
  console.error("✗ slug invalide. Usage: node tooling/new-drop/scaffold.mjs <slug> \"<Nom>\"");
  console.error("  (slug en minuscules, chiffres et tirets uniquement)");
  process.exit(1);
}
if (!name) {
  console.error('✗ nom manquant. Ex: node tooling/new-drop/scaffold.mjs ombre-studio "Ombre Studio"');
  process.exit(1);
}

const dest = join(root, "apps", slug);
if (existsSync(dest)) {
  console.error(`✗ apps/${slug} existe déjà.`);
  process.exit(1);
}

// 1) Copier le template (sans artefacts).
cpSync(join(root, "apps", "_template"), dest, {
  recursive: true,
  filter: (src) => !/node_modules|\.next|next-env\.d\.ts/.test(src),
});

// 2) Renommer le package + pré-remplir le nom de marque.
const pkgPath = join(dest, "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
pkg.name = slug;
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

const cfgPath = join(dest, "drop.config.ts");
writeFileSync(cfgPath, readFileSync(cfgPath, "utf8").replace("Nouveau drop", name));

// Filtre pnpm du déploiement Railway → slug du drop.
const railwayPath = join(dest, "railway.json");
if (existsSync(railwayPath)) {
  writeFileSync(railwayPath, readFileSync(railwayPath, "utf8").replaceAll("drop-template", slug));
}

// 3) Seed des docs de lancement depuis le playbook.
const projectDir = join(dest, "project");
mkdirSync(projectDir, { recursive: true });
const playbook = join(root, "playbook");
for (const f of readdirSync(playbook)) {
  if (f.endsWith(".md") && f !== "README.md") {
    cpSync(join(playbook, f), join(projectDir, f.replace(/^\d+-/, "")));
  }
}
writeFileSync(
  join(projectDir, "README.md"),
  `# Projet — ${name}\n\nDocs de lancement (copiées depuis /playbook, à remplir).\n` +
    `Config technique : ../drop.config.ts\n`,
);

console.log(`✓ apps/${slug} créé (template + project/ seedé).`);
console.log("Suite :");
console.log(`  1. Remplir apps/${slug}/drop.config.ts (brand, theme, flow, produits, modules ops)`);
console.log(`  2. Remplir apps/${slug}/project/*.md`);
console.log(`  3. pnpm install && pnpm --filter ${slug} build`);
