# Atelier Stack — Plan d'architecture réutilisable

> **But** : un **cœur commun** qui sert tous les projets de l'atelier (produits, art, bijoux,
> collabs artistes), pour que chaque nouveau **drop** se monte vite — avec **Claude Code** —
> sans réécrire le moteur, et sans casser les drops déjà en ligne.
>
> **Statut** : plan à valider. Aucun code applicatif modifié à ce stade.

---

## 1. Principes directeurs

0. **Le repo contient TOUT pour lancer.** Pas seulement le template tech du site, mais aussi
   le **savoir-faire de lancement** : roadmaps, brief, kit de marque, checklists marketing /
   mise en ligne / légal. Code → `apps/` + `packages/` ; templates de lancement → `playbook/` ;
   docs remplies d'un drop → `apps/<drop>/project/`.
1. **Ce qui change par drop = 3 choses** : le **thème** (identité visuelle / artiste), le
   **contenu & produits**, et le **flow d'achat** (configurateur, achat simple, ou devis).
   Tout le reste est **mutualisé**.
2. **Le cœur ne se forke jamais.** Le spécifique d'un drop vit uniquement dans son app
   (`drop.config.ts` + thème + assets). Si un besoin récurrent apparaît, il **remonte dans le
   cœur**, il ne se duplique pas.
3. **Back-office unique.** L'atelier possède et héberge tout → un seul Stripe, un seul flux
   commandes/leads, une seule logique fab/expédition. Pas de plomberie par projet.
4. **Optimisé pour Claude Code.** Le monorepo embarque les **conventions, docs et un
   scaffold** pour qu'une session Claude Code neuve produise un drop conforme au cœur, sans
   diverger.
5. **Compat Next « maison ».** Ce dépôt utilise une version de Next aux conventions
   spécifiques (cf. `AGENTS.md` → lire `node_modules/next/dist/docs/`). Le plan reste
   framework-honnête : on documente et on s'aligne, on ne présume pas des APIs.

---

## 2. Vue d'ensemble (monorepo)

```
atelier-stack/                      Turborepo + pnpm workspaces
├─ packages/
│  ├─ config/      schéma zod d'un drop + helper defineDrop()  (contrat commun)
│  ├─ themes/      tokens de design (1 source) → Tailwind preset + générateur PDF
│  ├─ ui/          composants thémables : Hero, Steps, BeforeAfter, ProductCard, Modal…
│  ├─ core/        flows composables : Configurator · SimpleProduct · Quote
│  └─ commerce/    Stripe, commandes, capture lead (Notion/webhook), conversion IA (Gemini)
├─ apps/
│  ├─ _template/   app de départ qu'on copie pour un nouveau drop
│  ├─ jewel-memories/      drop pilote (migré depuis l'app actuelle)
│  │  ├─ drop.config.ts    le spécifique-marque (validé par @thomyiy/config)
│  │  └─ project/          docs NON-code du drop : brief, roadmap, marketing, checklists
│  └─ <prochain-drop>/     thin app : core + ui + 1 thème + drop.config.ts + project/
├─ playbook/       lancement réutilisable : roadmap, brief, kit de marque,
│                  checklists marketing / mise en ligne / légal
├─ design/
│  └─ mockups/     générateur de deck PDF (lit les MÊMES tokens que themes/)
├─ tooling/
│  └─ new-drop/    scaffold : copie _template, branche le thème, pré-remplit la config
├─ .claude/
│  ├─ skills/new-drop/     skill « /new-drop » pour Claude Code
│  └─ ...
├─ AGENTS.md / CLAUDE.md   conventions du dépôt (lecture obligatoire pour Claude Code)
└─ turbo.json, pnpm-workspace.yaml, changeset config
```

**Règle de dépendances** : `apps/*` → dépendent de `core, ui, themes, commerce, config`.
Les packages ne dépendent jamais d'une app. `commerce` ne dépend pas de `ui` (logique pure).

---

## 3. Les packages (rôles)

| Package | Rôle | Contenu clé |
|---|---|---|
| **config** | Le **contrat** d'un drop | schéma `zod`, `defineDrop()`, types partagés |
| **themes** | La **source unique** de design | tokens (couleur, typo, rayon, espacement) + presets Tailwind + export pour le PDF |
| **ui** | Composants **thémables** | `Hero`, `Steps`, `BeforeAfter`, `ProductCard`, `Badge`, `LeadModal`, `Button`… (lisent les tokens) |
| **core** | Les **flows** composables | `ConfiguratorFlow`, `SimpleProductFlow`, `QuoteFlow` + leur état |
| **commerce** | Le **back-office** mutualisé | client Stripe + `/checkout`, persistance lead (Notion/webhook/log), conversion photo→line art (Gemini), modèles de commande |

> Les intégrations restent **pilotées par variables d'environnement** (déjà le cas
> aujourd'hui : `STRIPE_SECRET_KEY`, `NOTION_TOKEN`/`NOTION_LEADS_DATABASE_ID`,
> `GEMINI_API_KEY`). Un drop active/désactive une intégration via sa config + ses env.

---

## 3 bis. Un drop = des **modules** (le « form » = schémas remplis par Claude Code)

`ras-stack` est l'**outil de lancement** : chaque drop se décrit en modules structurés.
Décision validée : le **« form » = les schémas** (`drop.config.ts` + docs `project/`),
**remplis avec Claude Code** (pas d'UI dédiée pour l'instant ; option ouverte plus tard).

| Module | Données (schéma `@thomyiy/config`) | Doc (`playbook/` → `project/`) | Code |
|---|---|---|---|
| Cadrage | `brand` | `01-brief` | — |
| Identité / design | `theme` | `02-brand-kit` | `@thomyiy/themes` |
| Produits | `catalog` | (brief) | `@thomyiy/core` |
| **Fiscalité & finance** | `finance` (+ `priceBreakdown`, `marginPct`) | `06-fiscalite-finance` | — |
| **Logistique** | `logistics` | `07-logistique` | — |
| **Stock & production** | `inventory` | `08-stock-production` | — |
| **Compta & SAV** | `accounting` | `09-compta-sav` | — |
| Site (tech) | `flow`, `integrations` | `04-launch` | `apps/<drop>` + `@thomyiy/*` |
| Marketing | — | `03-marketing` | — |
| Légal | — | `05-legal` | routes légales |

> **Extensible par design** : un nouveau besoin = un nouveau module (schéma optionnel dans
> `@thomyiy/config` + template `playbook/`). Les champs des modules ops sont **optionnels** : un
> drop ne remplit que ce qui le concerne.

---

## 4. Le contrat : `drop.config.ts`

Un drop = **un fichier validé**, même schéma pour tous. C'est ce que Claude Code remplit.

```ts
// apps/<drop>/drop.config.ts
import { defineDrop } from "@atelier/config";

export default defineDrop({
  brand: {
    name: "Jewel Memories",
    tagline: "Vos souvenirs, gravés pour toujours.",
    domain: "jewel-memories.fr",
    contactEmail: "bonjour@jewel-memories.fr",
  },

  theme: "thelma",                 // ← clé d'un thème de packages/themes (ou tokens inline)

  flow: "configurator",            // ← "configurator" | "simple" | "quote"

  catalog: [
    { id: "coeur", name: "Cœur", basePrice: 62, options: { material: ["argent","acier","or18k"] } },
    // …
  ],

  content: {
    hero:  { eyebrow: "Bijoux gravés sur mesure", title: ["Un souvenir.", "Un bijou gravé", "pour toujours."], cta: "Créer mon pendentif" },
    steps: [ /* … */ ],
    faq:   [ /* … */ ],
    testimonials: [ /* … */ ],
    badges: ["Livraison 7–10 j", "Écrin offert", "Fabrication française"],
  },

  integrations: {
    payment: "stripe",             // "stripe" | "none"
    leads:   "notion",             // "notion" | "webhook" | "none"
    ai:      "gemini",             // "gemini" | "none"
  },
});
```

`zod` **valide à la compilation/au boot** : un drop mal configuré échoue tôt, avec un message
clair — précieux pour fiabiliser le travail de Claude Code.

---

## 5. Flows composables (le point « parcours d'achat varie »)

`packages/core` expose des parcours prêts à brancher ; l'app n'en choisit qu'un via `flow` :

- **ConfiguratorFlow** — support → matière → photo (conversion IA) → aperçu → paiement.
  *(le parcours actuel de Jewel Memories)*
- **SimpleProductFlow** — produit → options → paiement. *(un drop « boutique » classique)*
- **QuoteFlow** — configuration → devis / capture de lead, **sans** paiement. *(pièces d'art
  sur commande, éditions limitées)*

Chaque flow consomme le même `content` + `catalog` et la même couche `commerce`. Ajouter un
4ᵉ flow = un nouveau module dans `core`, réutilisable par tous les drops suivants.

---

## 6. Système de thème : une source → site **et** maquettes

`packages/themes` est **la seule vérité** de l'identité visuelle :

```ts
// packages/themes/src/thelma.ts
export const thelma: ThemeTokens = {
  color: { ink:"#1A1714", paper:"#F6F3ED", accent:"#B07C5B", sand:"#E9E2D5", /* … */ },
  font:  { display:"Bricolage Grotesque", body:"Outfit" },
  radius:{ card:4, button:6 },
};
```

Ces tokens alimentent **deux** consommateurs :

1. le **site** (preset Tailwind / variables CSS) ;
2. le **générateur de maquettes PDF** (`design/mockups`).

→ Concrètement : pour un nouveau drop, **un seul thème** produit **le site ET le deck de
présentation** (les 2 styles déjà réalisés — « editorial » et « thelma » — deviennent les 2
premiers thèmes du catalogue).

---

## 7. Workflow « nouveau drop avec Claude Code » ⭐

C'est le cœur de ton besoin. Le monorepo est outillé pour qu'une session Claude Code neuve
soit **rapide et disciplinée** :

1. **`AGENTS.md` / `CLAUDE.md` racine** — règles non négociables : « réutilise
   `@atelier/core`, `@atelier/ui`, `@atelier/themes` ; ne forke jamais le cœur ; tout le
   spécifique va dans `apps/<drop>` ; pour créer un drop, suis `docs/new-drop.md` ».
2. **Skill `/new-drop`** (`.claude/skills/new-drop`) — Claude Code la lance, répond à
   3 questions (marque, thème, flow), et le scaffold copie `apps/_template`, branche le
   thème, génère un `drop.config.ts` pré-rempli.
3. **`apps/_template`** — app minimale exemplaire (bonnes importations, structure type).
4. **READMEs d'API par package** — chaque package documente sa surface publique (quels
   composants, quels flows, quelles props) → Claude Code a le contexte sans deviner.
5. **Checklist de drop** (`docs/new-drop.md`) — étapes : config → thème → contenu/produits →
   env → vérif build/lint → deck PDF → déploiement.

> Résultat : un nouveau drop = surtout **remplir `drop.config.ts` + choisir/créer un thème**.
> Claude Code reste cantonné au spécifique ; le moteur reste commun et stable.

---

## 8. Mises à jour & stabilité des drops livrés

- **Monorepo + dépendances workspace** : les apps consomment `core/ui/themes` du dépôt.
- **`changesets`** pour versionner le cœur et tenir un **changelog** discipliné (semver).
- **CI Turborepo** : tout changement du cœur **rebuild toutes les apps** → on détecte une
  régression avant prod.
- **Un drop en ligne reste figé tant qu'on ne le redéploie pas.** Pour lui pousser un
  correctif : on le redéploie (il reprend le cœur à jour). On contrôle donc **drop par
  drop**, sans surprise — exactement la stratégie « centralisé + versionné » validée.

---

## 9. Migration depuis l'app actuelle (incrémental, sans casse)

**Phase 1 — Rendre Jewel Memories pilotable par config** *(dans le repo actuel, zéro
monorepo)*
- Extraire `drop.config.ts` (brand, catalog, content, integrations).
- Extraire les **tokens de thème** (`thelma`) et brancher Tailwind + le générateur PDF
  dessus.
- Isoler le parcours actuel comme `ConfiguratorFlow`.
- **Livrable** : l'app fonctionne à l'identique, mais 100 % pilotée par config/thème.
  *C'est le vrai déverrouillage, et c'est sans risque.*

**Phase 2 — Extraire le monorepo**
- Créer Turborepo + pnpm ; déplacer le code générique dans `packages/{config,themes,ui,core,commerce}`.
- Jewel Memories devient `apps/jewel-memories` (thin app).
- **Livrable** : 1 drop tourne au-dessus des packages partagés.

**Phase 3 — Outillage Claude Code**
- `apps/_template`, skill `/new-drop`, `AGENTS.md`, `docs/new-drop.md`, READMEs d'API,
  `changesets` + CI.
- **Test grandeur nature** : lancer le **prochain drop** via Claude Code et mesurer le temps.

**Phase 4 — second thème/flow**
- Ajouter `SimpleProductFlow` et un 2ᵉ thème artiste au premier vrai nouveau projet
  (durcit l'abstraction sur un cas réel).

---

## 10. Stack technique proposée

| Sujet | Choix | Pourquoi |
|---|---|---|
| Monorepo | **Turborepo + pnpm workspaces** | standard, cache de build, rapide |
| Validation config | **zod** | échec tôt + types dérivés |
| Versionnage cœur | **changesets** | changelog + semver disciplinés |
| Thème | **tokens TS → preset Tailwind + export PDF** | 1 source pour site + maquettes |
| Paiement / Leads / IA | **Stripe / Notion(webhook) / Gemini**, par env | déjà en place, on garde |
| Maquettes | **ReportLab** (générateur PDF existant) | déjà fonctionnel, branché sur les thèmes |

---

## 11. Décisions à confirmer avant de coder

1. **Nom du scope npm** des packages : `@atelier/*` ? (sinon, lequel ?)
2. **Hébergement/déploiement** cible des apps (Vercel ? autre ?) — influe sur la CI.
3. **Domaines des drops** : sous-domaines `drop.atelier.com` ou domaines dédiés par collab ?
4. **Comptes clients / panier multi-produits** nécessaires dès maintenant, ou drops mono-produit pour démarrer ?
5. On démarre la **Phase 1 dans ce repo**, ou on crée **directement le monorepo** (Phase 2) ?

---

### Prochaine étape proposée
Valider ce plan (et les points §11), puis je lance la **Phase 1** : transformer Jewel
Memories en app **config-driven + thème** — le socle réutilisable, livré sans toucher au
comportement actuel.
