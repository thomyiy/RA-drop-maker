import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ConfiguratorFlow } from "@/components/configurator/configurator-flow";
import { isGeminiConfigured } from "@/lib/gemini";

export const metadata: Metadata = {
  title: "Créer mon pendentif",
  description:
    "Composez votre pendentif : support, matière et photo transformée en line art noir & blanc par notre IA.",
};

// L'état dépend de l'environnement (clé Gemini) : on évalue à chaque requête.
export const dynamic = "force-dynamic";

/**
 * Configurateur — l'atelier de création.
 * Parcours : support → matière → photo (→ line art) → capture du contact →
 * paiement. La logique interactive vit dans <ConfiguratorFlow>.
 */
export default function ConfigurateurPage() {
  return (
    <Container className="py-12">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <p className="eyebrow mb-2">L&apos;atelier</p>
        <h1 className="text-3xl text-ink sm:text-4xl">Composez votre pendentif</h1>
        <p className="mt-3 text-ink-soft">
          Choisissez votre support, votre matière, puis importez une photo : notre
          IA la transforme en line art noir &amp; blanc, prêt à graver.
        </p>
      </div>

      <div className="mx-auto max-w-3xl">
        <ConfiguratorFlow geminiReady={isGeminiConfigured()} />
      </div>
    </Container>
  );
}
