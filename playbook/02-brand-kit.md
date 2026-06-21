# Kit de marque

À copier dans `apps/<drop>/project/brand-kit.md`. C'est le pont entre l'identité et le code :
les couleurs/typo deviennent un **thème** dans `@ras/themes`.

## Naming
- **Nom** :
- **Baseline / accroche** :
- **Disponibilité** : domaine `.fr`/`.com` libre ? · @ réseaux libres ? · marque INPI ?

## Ton de voix
- **3 adjectifs** :
- **On dit / on ne dit pas** :
- **Exemples de phrases** (hero, bouton, confirmation) :

## Logo & symbole
- **Logo** (fichier, variantes : couleur / mono / favicon) :
- **Symbole / motif récurrent** :

## Couleurs → thème `@ras/themes`
| Token | Rôle | Valeur |
|---|---|---|
| `ink` | texte principal | |
| `bg` / `surface` | fonds | |
| `accent` / `accentDark` | accent | |
| `sand` / `line` | neutres / filets | |

> Reporter ces valeurs dans `packages/themes/src/themes.json` sous une nouvelle clé
> (ex. `"<marque>"`), puis `theme: "<marque>"` dans `drop.config.ts`.
> Ce même thème alimente **le site ET le deck de maquettes**.

## Typographie
- **Display** (titres) :
- **Body** (texte) :
- Police dispo dans `design/mockups` (canvas-fonts) ? sinon l'ajouter.

## Assets
- [ ] Logo (SVG + PNG)
- [ ] Favicon / icône app
- [ ] Image de partage (OG, 1200×630)
- [ ] Photos produit / visuels artiste
- [ ] Écrin / packaging (le cas échéant)
