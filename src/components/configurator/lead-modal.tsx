"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { GoogleSignin } from "./google-signin";

type Props = {
  open: boolean;
  onClose: () => void;
  /** Line art généré, affiché flouté avant la capture du contact. */
  previewUrl: string;
  /** Prix formaté (ex. « 69 € »). */
  priceLabel: string;
  /** Résumé de config transmis avec le lead. */
  config: Record<string, unknown>;
  /** Déclenché quand l'utilisateur passe au paiement. */
  onPay: () => void;
};

type Status = "capture" | "submitting" | "revealed";

/**
 * Porte de capture de contact.
 *
 * Affiche l'aperçu de la création floutée ; pour le révéler et accéder au
 * paiement, l'utilisateur saisit son email ou se connecte avec Google.
 */
export function LeadModal({
  open,
  onClose,
  previewUrl,
  priceLabel,
  config,
  onPay,
}: Props) {
  const [status, setStatus] = useState<Status>("capture");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [capturedEmail, setCapturedEmail] = useState<string | null>(null);

  // Fermeture au clavier (Échap) + verrouillage du scroll de fond.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  async function submitLead(payload: { email?: string; googleCredential?: string }) {
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, config }),
      });
      const data = (await res.json()) as { ok?: boolean; email?: string; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Une erreur est survenue.");
      }
      setCapturedEmail(data.email ?? payload.email ?? null);
      setStatus("revealed");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
      setStatus("capture");
    }
  }

  const revealed = status === "revealed";
  const googleEnabled = Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Découvrir ma création"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      {/* Fond */}
      <button
        aria-label="Fermer"
        onClick={onClose}
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
      />

      {/* Panneau */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-lg border border-line bg-cream shadow-xl">
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-cream/80 text-ink-soft hover:text-ink"
        >
          ✕
        </button>

        {/* Aperçu (flouté tant que le contact n'est pas donné) */}
        <div className="relative aspect-square w-full bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt={revealed ? "Votre création" : "Aperçu de votre création (flouté)"}
            className={`h-full w-full object-contain transition-[filter] duration-700 ${
              revealed ? "" : "blur-xl scale-105"
            }`}
          />
          {!revealed && (
            <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-ink/30 to-transparent p-6">
              <p className="rounded-full bg-cream/90 px-4 py-1.5 text-xs font-medium text-ink">
                🔒 Aperçu verrouillé
              </p>
            </div>
          )}
        </div>

        {/* Contenu */}
        <div className="p-6 sm:p-8">
          {!revealed ? (
            <>
              <h2 className="text-2xl text-ink">Découvrez votre création</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Renseignez votre email ou connectez-vous avec Google pour
                révéler votre line art en haute définition et finaliser votre
                pendentif.
              </p>

              <form
                className="mt-5 space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  submitLead({ email });
                }}
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@email.com"
                  autoComplete="email"
                  className="h-12 w-full rounded-full border border-line bg-white px-5 text-sm text-ink outline-none focus:border-gold"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={status === "submitting"}
                >
                  {status === "submitting" ? "Un instant…" : "Révéler ma création"}
                </Button>
              </form>

              {googleEnabled && (
                <>
                  <GoogleDivider />
                  <GoogleSignin
                    onCredential={(credential) =>
                      submitLead({ googleCredential: credential })
                    }
                  />
                </>
              )}

              {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

              <p className="mt-5 text-center text-xs text-ink-soft">
                En continuant, vous acceptez d'être recontacté au sujet de votre
                création. Voir notre{" "}
                <a href="/confidentialite" className="underline">
                  politique de confidentialité
                </a>
                .
              </p>
            </>
          ) : (
            <div className="text-center">
              <p className="eyebrow">Création débloquée ✦</p>
              <h2 className="mt-1 text-2xl text-ink">Votre pendentif est prêt</h2>
              {capturedEmail && (
                <p className="mt-1 text-sm text-ink-soft">
                  Un récapitulatif vous attend à {capturedEmail}.
                </p>
              )}
              <p className="mt-4 text-3xl text-ink">{priceLabel}</p>
              <Button size="lg" className="mt-5 w-full" onClick={onPay}>
                Procéder au paiement
              </Button>
              <button
                onClick={onClose}
                className="mt-3 text-sm text-ink-soft underline-offset-4 hover:text-ink hover:underline"
              >
                Continuer à modifier
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GoogleDivider() {
  return (
    <div className="my-5 flex items-center gap-3 text-xs text-ink-soft">
      <span className="h-px flex-1 bg-line" />
      ou
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
