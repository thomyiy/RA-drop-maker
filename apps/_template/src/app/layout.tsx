import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { getTheme, themeCssVars } from "@thomyiy/themes";
import { dropConfig } from "@drop";
import "./globals.css";

// Le thème du drop pilote les variables CSS de toute la page.
const theme = getTheme(dropConfig.theme);
const themeVars = themeCssVars(theme) as CSSProperties;

export const metadata: Metadata = {
  title: dropConfig.brand.name,
  description: dropConfig.brand.description,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" style={themeVars}>
      <body>{children}</body>
    </html>
  );
}
