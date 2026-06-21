import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PhotoConverter } from "@/components/converter/photo-converter";
import { isGeminiConfigured } from "@/lib/gemini";
import { materials, pendantSupports } from "@/lib/config/catalog";

export const metadata: Metadata = {
  title: "Créer mon pendentif",
  description:
    "Importez une photo : notre IA la transforme en line art noir & blanc, prêt à graver sur votre pendentif.",
};

// La disponibilité de l'atelier dépend de l'environnement (clé Gemini) :
// on évalue donc la page à chaque requête plutôt qu'au build.
export const dynamic = "force-dynamic";

/**
 * Configurateur — l'atelier de création.
 *
 * Cœur du parcours : l'utilisateur importe une photo (PNG/JPEG) et obtient un
 * line art noir & blanc généré par l'API Gemini. Le choix du support et de la
 * matière encadre la composition.
 */
export default function ConfigurateurPage() {
  const ready = isGeminiConfigured();

  return (
    <Container className="py-12">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <p className="eyebrow mb-2">L'atelier</p>
        <h1 className="text-3xl text-ink sm:text-4xl">
          Transformez votre photo en line art
        </h1>
        <p className="mt-3 text-ink-soft">
          Importez une photo nette et bien cadrée. Notre IA la convertit en un
          tracé noir & blanc épuré, prêt à être gravé sur votre pendentif.
        </p>
      </div>

      {!ready && (
        <div className="mx-auto mb-8 max-w-2xl rounded-lg border border-amber-300 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          ⚙️ La conversion nécessite une clé <code>GEMINI_API_KEY</code> côté
          serveur. Ajoutez-la dans <code>.env.local</code> pour activer
          l'atelier.
        </div>
      )}

      <div className="mx-auto max-w-3xl">
        <PhotoConverter />
      </div>

      {/* Conseils */}
      <div className="mx-auto mt-12 max-w-3xl rounded-lg border border-line bg-sand/30 p-6">
        <h2 className="text-lg text-ink">Pour un meilleur rendu</h2>
        <ul className="mt-3 space-y-2 text-sm text-ink-soft">
          <li>• Choisissez une photo nette, bien éclairée et contrastée.</li>
          <li>• Cadrez sur le sujet (visage, animal, objet) sur fond simple.</li>
          <li>• Les images « flat » (à plat, vue de face) donnent les plus beaux tracés.</li>
        </ul>
      </div>

      {/* Support & matière (composition autour de la gravure) */}
      <div className="mx-auto mt-16 max-w-3xl">
        <h2 className="text-xl text-ink">Votre pendentif</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Le line art sera gravé sur le support et la matière de votre choix.
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-ink">Support</h3>
            <div className="grid grid-cols-2 gap-3">
              {pendantSupports.map((s) => (
                <div
                  key={s.id}
                  className="rounded-lg border border-line p-3 text-sm hover:border-gold"
                >
                  <span className="text-ink">{s.name}</span>
                  <br />
                  <span className="text-ink-soft">{s.shape}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-ink">Matière</h3>
            <div className="flex flex-wrap gap-2">
              {materials.map((m) => (
                <span
                  key={m.id}
                  className="rounded-full border border-line px-4 py-2 text-sm text-ink hover:border-gold"
                >
                  {m.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
