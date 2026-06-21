# Playbook — lancer un drop chez Rainbow Ant Studio

Ce dossier contient **tout le non-code** pour lancer un site / une marque / un projet :
roadmaps, briefs, kit de marque, et checklists (marketing, mise en ligne, légal).

> Le **code** vit dans `apps/*` + `packages/@ras/*`.
> Le **savoir-faire de lancement** vit ici, dans `playbook/`.
> Le **projet concret** (docs remplies d'un drop) vit dans `apps/<drop>/project/`.

## Comment s'en servir

1. **Nouveau projet** → on copie ces templates dans `apps/<drop>/project/` et on les remplit.
   (À terme, le scaffold `new-drop` le fera automatiquement — cf. `docs/atelier-stack-plan.md`.)
2. On suit la **roadmap** (`00-roadmap.md`) phase par phase.
3. Avant le go-live, on déroule les checklists **marketing**, **mise en ligne** et **légal**.

## Contenu

| Fichier | Rôle | Module `@ras/config` |
|---|---|---|
| `00-roadmap.md` | Roadmap type, de l'idée au lancement (phases + jalons) | — |
| `01-brief.md` | Brief de projet/marque (à remplir au cadrage) | `brand` |
| `02-brand-kit.md` | Identité : naming, ton, logo, couleurs/typo | `theme` (→ `@ras/themes`) |
| `03-marketing-checklist.md` | Pré-lancement · Jour J · Post-lancement | — |
| `04-launch-checklist.md` | Mise en ligne technique (domaine, paiement, SEO, perf…) | `integrations` |
| `05-legal-checklist.md` | Mentions légales, CGV, RGPD (France) | — |
| `06-fiscalite-finance.md` | TVA, régime, coût de revient, marge, prix HT/TTC | `finance` |
| `07-logistique.md` | Transporteurs, délais, zones, emballage | `logistics` |
| `08-stock-production.md` | Mode de production, quantités, fournisseurs | `inventory` |
| `09-compta-sav.md` | Facturation, retours, SAV | `accounting` |

> Le **« form »** d'un drop = ces docs + le schéma `drop.config.ts` (validé par `@ras/config`).
> On les remplit **avec Claude Code**, projet par projet. Le calculateur fiscalité
> (`priceBreakdown`, `marginPct`) est dans `@ras/config`.

Chaque checklist utilise des cases `- [ ]` : on coche dans la copie du projet, pas ici.
