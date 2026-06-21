import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Délais, matières, entretien, livraison, retours : toutes les réponses sur nos pendentifs gravés.",
};

const faq = [
  {
    q: "Quels délais pour recevoir mon bijou ?",
    a: "Chaque pièce est fabriquée à la commande. Comptez 7 à 10 jours ouvrés entre la validation de votre gravure et la réception.",
  },
  {
    q: "Que puis-je faire graver ?",
    a: "Un texte (prénom, date, message court), un symbole de notre bibliothèque, et bientôt une photo — y compris une version stylisée de votre image.",
  },
  {
    q: "Quelles matières proposez-vous ?",
    a: "Argent 925, acier inoxydable plaqué or, et or 18 carats. Chaque matière est gravable et adaptée au port quotidien.",
  },
  {
    q: "Comment entretenir mon pendentif gravé ?",
    a: "Un chiffon doux suffit pour raviver l'éclat. Évitez le contact prolongé avec l'eau, les parfums et les produits cosmétiques.",
  },
  {
    q: "La chaîne est-elle incluse ?",
    a: "Oui, chaque pendentif est livré avec une chaîne assortie à la matière choisie, ainsi qu'un écrin offert.",
  },
  {
    q: "Puis-je retourner un bijou personnalisé ?",
    a: "Les pièces gravées étant personnalisées, elles ne sont pas reprises sauf défaut de fabrication. Dans ce cas, nous remplaçons votre bijou sans frais.",
  },
];

export default function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="Questions fréquentes"
        title="On répond à tout"
        subtitle="Vous ne trouvez pas votre réponse ? Écrivez-nous, nous répondons rapidement."
      />

      <Container className="max-w-2xl py-16">
        <div className="divide-y divide-line">
          {faq.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg text-ink">
                {item.q}
                <span className="text-gold transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 leading-relaxed text-ink-soft">{item.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </>
  );
}
