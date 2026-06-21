import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const display = Cormorant_Garamond({
  variable: "--font-display",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jewel-memories.com"),
  title: {
    default: "Jewel Memories — Pendentifs gravés sur mesure",
    template: "%s · Jewel Memories",
  },
  description:
    "Des pendentifs gravés à la main d'après vos souvenirs : un prénom, une photo, un symbole. Bijoux personnalisés fabriqués en France.",
  openGraph: {
    title: "Jewel Memories — Pendentifs gravés sur mesure",
    description:
      "Transformez un souvenir en bijou gravé : texte, photo ou symbole. Fabrication artisanale.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
