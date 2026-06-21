# Jewel Memories

Boutique de **pendentifs gravés sur mesure**. Le client importe une photo,
notre IA la transforme en **line art noir & blanc** prêt à graver, puis il
compose son bijou (support, matière). Inspiré du modèle de
[thelma.pet](https://thelma.pet), transposé au bijou gravé.

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4**
- **API Gemini** (`@google/genai`, modèle `gemini-2.5-flash-image`) pour la
  conversion photo → line art
- Polices : Cormorant Garamond (titres) + Inter (corps)

## Démarrage

```bash
npm install
cp .env.example .env.local   # puis renseignez GEMINI_API_KEY
npm run dev
```

Le site tourne sur [http://localhost:3000](http://localhost:3000). Sans clé
Gemini, le site fonctionne mais l'atelier de conversion affiche un message
d'indisponibilité (le reste du contenu s'appuie sur des données mock dans
`src/lib/config/catalog.ts`).

Obtenez une clé sur [Google AI Studio](https://aistudio.google.com/apikey).

## Conversion photo → line art

- **UI** : `src/components/converter/photo-converter.tsx` (composant client :
  upload PNG/JPEG, aperçu avant/après, téléchargement).
- **API** : `src/app/api/convert/route.ts` (POST `multipart/form-data`, champ
  `image`) → renvoie `{ dataUrl }`.
- **Modèle** : `src/lib/gemini.ts` envoie la photo + une consigne de style au
  modèle d'image Gemini et récupère le tracé noir & blanc.

## Structure

```
src/
  app/                  Pages (App Router)
    page.tsx            Accueil
    comment-ca-marche/  Le processus
    modeles/            Supports & matières
    qualite/            Savoir-faire
    faq/                Questions fréquentes
    configurateur/      L'atelier : conversion photo → line art
    api/convert/        Route serveur de conversion (Gemini)
    mentions-legales/ · cgv/ · confidentialite/
  components/
    layout/             Header, Footer, Logo
    converter/          PhotoConverter (upload + conversion)
    ui/                 Container, Button, SectionHeading, PageHeader…
  lib/
    gemini.ts           Appel API Gemini (line art)
    format.ts           Formatage des prix
    config/             Données catalogue & site (mock)
```

## Modes de gravure

1. **Photo en line art** — upload + conversion IA (fonctionnalité phare)
2. **Texte** — prénom, date, message (à venir : éditeur interactif)
3. **Symbole** — bibliothèque de motifs (à venir)
