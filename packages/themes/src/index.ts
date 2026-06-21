import themesData from "./themes.json";

/**
 * @ras/themes — source unique des identités visuelles.
 * Les tokens vivent dans `themes.json` → consommés par le site (TS) ET par le
 * générateur de maquettes PDF (Python lit le même fichier).
 */

export type ThemeColor = {
  ink: string;
  inkSoft: string;
  mute: string;
  bg: string;
  surface: string;
  sand: string;
  line: string;
  lineStrong: string;
  accent: string;
  accentDark: string;
  accentSoft: string;
  onAccent: string;
  onInk: string;
};

export type ThemeTokens = {
  name: string;
  label: string;
  color: ThemeColor;
  font: { display: string; body: string };
  radius: { card: number; button: number };
};

export const themes = themesData as Record<string, ThemeTokens>;
export const themeNames = Object.keys(themes);

export function getTheme(name: string): ThemeTokens {
  const t = themes[name];
  if (!t) {
    throw new Error(
      `@ras/themes: thème inconnu « ${name} » (disponibles : ${themeNames.join(", ")})`,
    );
  }
  return t;
}

/** Variables CSS prêtes à injecter dans :root — ex. { "--color-ink": "#…", … }. */
export function themeCssVars(t: ThemeTokens): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [key, val] of Object.entries(t.color)) {
    vars[`--color-${kebab(key)}`] = val;
  }
  vars["--radius-card"] = `${t.radius.card}px`;
  vars["--radius-button"] = `${t.radius.button}px`;
  vars["--font-display"] = t.font.display;
  vars["--font-body"] = t.font.body;
  return vars;
}

function kebab(s: string): string {
  return s.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
}
