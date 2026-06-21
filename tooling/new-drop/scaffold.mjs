#!/usr/bin/env node
/**
 * Scaffold d'un nouveau drop **dans son propre repo** (modèle polyrepo).
 * Copie templates/drop → <targetDir>, seed project/ depuis playbook/, et
 * pré-remplit le nom. Le repo généré consomme @thomyiy/* publiés.
 *
 * Usage : node tooling/new-drop/scaffold.mjs <slug> "<Nom de marque>" [targetDir]
 * Ex.    : node tooling/new-drop/scaffold.mjs ombre-studio "Ombre Studio"
 *          (par défaut, créé dans ../<slug>, à côté de RA-drop-maker)
 */
import { cpSync, readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

// Parse : dernier arg = targetDir s'il ressemble à un chemin, sinon défaut.
const args = process.argv.slice(2);
const slugArg = args[0];
let targetDir = null;
let nameParts = args.slice(1);
if (nameParts.length > 1 && (nameParts[nameParts.length - 1].includes("/") || nameParts[nameParts.length - 1].startsWith("."))) {
  targetDir = nameParts.pop();
}
const brandName = nameParts.join(" ").trim();

if (!slugArg || !/^[a-z0-9-]+$/.test(slugArg)) {
  console.error('✗ slug invalide. Usage: node tooling/new-drop/scaffold.mjs <slug> "<Nom>" [targetDir]');
  process.exit(1);
}
if (!brandName) {
  console.error('✗ nom manquant. Ex: node tooling/new-drop/scaffold.mjs ombre-studio "Ombre Studio"');
  process.exit(1);
}

const dest = targetDir ? resolve(targetDir) : resolve(root, "..", slugArg);
if (existsSync(dest)) {
  console.error(`✗ ${dest} existe déjà.`);
  process.exit(1);
}

// 1) Copier le template de drop (repo séparé).
cpSync(join(root, "templates", "drop"), dest, {
  recursive: true,
  filter: (src) => !/node_modules|\.next|next-env\.d\.ts/.test(src),
});

// 2) Substitutions (nom du package + nom de marque).
const pkgPath = join(dest, "package.json");
writeFileSync(pkgPath, readFileSync(pkgPath, "utf8").replaceAll("__SLUG__", slugArg));
for (const f of ["drop.config.ts", "README.md"]) {
  const p = join(dest, f);
  if (existsSync(p)) writeFileSync(p, readFileSync(p, "utf8").replaceAll("__NAME__", brandName));
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
  `# Projet — ${brandName}\n\nDocs de lancement (copiées depuis le playbook RA-drop-maker, à remplir).\n` +
    `Config technique : ../drop.config.ts\n`,
);

console.log(`✓ Drop « ${brandName} » créé dans : ${dest}`);
console.log("\nSuite :");
console.log(`  1. cd ${dest}`);
console.log("  2. Remplir drop.config.ts (brand, theme, flow, produits, modules ops) + project/*.md");
console.log("  3. export GITHUB_TOKEN=...   # read:packages (cf. .npmrc)");
console.log("  4. pnpm install && pnpm build");
console.log("  5. git init && créer le repo GitHub + push");
console.log("\n⚠️  Prérequis : les libs @thomyiy/* doivent être publiées (cf. docs/polyrepo-publication.md).");
