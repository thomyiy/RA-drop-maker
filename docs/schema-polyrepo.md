# Schéma — comment marche RA-drop-maker

## 1. Le principe : une fabrique → des drops

```mermaid
flowchart TB
    subgraph FAB["🏭 RA-drop-maker (CE repo = la fabrique)"]
        direction TB
        CORE["📦 packages/@thomyiy/*<br/>config · themes · ui · core · commerce<br/><b>le cœur mutualisé</b>"]
        TPL["📁 templates/drop/<br/>squelette d'un repo de drop"]
        PLAY["📚 playbook/<br/>docs lancement (roadmap, marketing, légal)"]
        SKILL["🤖 /new-drop + pnpm new-drop<br/>le wizard qui scaffolde"]
        DOG["🧪 apps/jewel-memories<br/>drop de dogfood (test interne)"]
    end

    REG["🌐 GitHub Packages<br/>@thomyiy/* <b>publiés</b> (versionnés)"]

    subgraph DROP1["🪐 Repo drop A (séparé)"]
        D1["drop.config.ts + thème<br/>project/ (docs)"]
    end
    subgraph DROP2["🪐 Repo drop B (séparé)"]
        D2["drop.config.ts + thème<br/>project/ (docs)"]
    end

    CORE -->|"pnpm release"| REG
    SKILL -->|"copie templates/ + seed playbook/"| DROP1
    SKILL -->|"copie templates/ + seed playbook/"| DROP2
    REG -.->|"pnpm install (consomme)"| DROP1
    REG -.->|"pnpm install (consomme)"| DROP2
```

## 2. Ce qui change vs ce qui est mutualisé

```mermaid
flowchart LR
    subgraph CHANGE["🎨 Change à CHAQUE drop"]
        T["thème<br/>@thomyiy/themes"]
        C["contenu & produits<br/>drop.config.ts"]
        F["flow d'achat<br/>configurator / simple / quote"]
    end
    subgraph SHARED["♻️ Mutualisé (jamais forké)"]
        UI["UI (Hero, Steps…)"]
        CO["core (logique flows)"]
        CM["commerce (Stripe, leads, IA)"]
        CF["config (schéma zod)"]
    end
    CHANGE -->|"3 leviers"| APP["site du drop"]
    SHARED -->|"importé tel quel"| APP
```

## 3. Le flux de bout en bout

```
   TOI                FABRIQUE                    REGISTRE            DROP (repo séparé)
    │                    │                           │                      │
    │ pnpm release ─────►│  publie @thomyiy/* ──────►│ (versions figées)    │
    │                    │                           │                      │
    │ /new-drop ────────►│  copie templates/         │                      │
    │  "mon-drop"        │  + seed playbook/ ────────┼─────────────────────►│ repo créé
    │                    │                           │                      │
    │ remplir ───────────────────────────────────────────────────────────►│ drop.config.ts
    │  config + thème    │                           │                      │ + thème
    │                    │                           │                      │
    │ pnpm install ──────────────────────────────────┤ tire @thomyiy/* ────►│ build ✅
    │ pnpm build         │                           │                      │
    │                    │                           │                      ▼
    │                    │                           │                  🚀 Railway
```

**À retenir :** la fabrique **produit** (publie les libs + scaffolde) ; chaque drop **consomme**
les libs publiées et n'a que SON spécifique (thème + config + flow). Le cœur ne se duplique jamais.
