"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PhotoConverter } from "@/components/converter/photo-converter";
import { Button } from "@/components/ui/button";
import { LeadModal } from "./lead-modal";
import { formatPrice } from "@/lib/format";
import {
  materials,
  pendantSupports,
  type Material,
  type PendantSupport,
} from "@/lib/config/catalog";

/**
 * Parcours complet du configurateur (côté client) :
 *  1. choix du support et de la matière
 *  2. import + conversion de la photo en line art
 *  3. porte de capture de contact (modal, aperçu flouté)
 *  4. paiement
 */
export function ConfiguratorFlow({ geminiReady }: { geminiReady: boolean }) {
  const router = useRouter();
  const [supportId, setSupportId] = useState(pendantSupports[0].id);
  const [materialId, setMaterialId] = useState(materials[0].id);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const support = pendantSupports.find((s) => s.id === supportId)!;
  const material = materials.find((m) => m.id === materialId)!;
  const price = support.basePrice + material.priceModifier;
  const priceLabel = formatPrice(price);

  const configSummary = useMemo(
    () => ({
      support: support.name,
      material: material.name,
      price,
      currency: "EUR",
    }),
    [support.name, material.name, price],
  );

  const canContinue = Boolean(resultUrl);

  // Lance le paiement Stripe ; repli sur la page d'info si non configuré.
  async function handlePay(email?: string) {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: configSummary, email }),
      });
      const data = (await res.json()) as { url?: string };
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
    } catch {
      /* repli ci-dessous */
    }
    router.push("/paiement");
  }

  return (
    <div className="space-y-12">
      {/* Étape 1 — Support */}
      <Step n={1} title="Choisissez votre support">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {pendantSupports.map((s) => (
            <SupportCard
              key={s.id}
              support={s}
              selected={s.id === supportId}
              onSelect={() => setSupportId(s.id)}
            />
          ))}
        </div>
      </Step>

      {/* Étape 2 — Matière */}
      <Step n={2} title="Choisissez la matière">
        <div className="flex flex-wrap gap-3">
          {materials.map((m) => (
            <MaterialChip
              key={m.id}
              material={m}
              selected={m.id === materialId}
              onSelect={() => setMaterialId(m.id)}
            />
          ))}
        </div>
      </Step>

      {/* Étape 3 — Photo */}
      <Step n={3} title="Importez votre photo">
        {!geminiReady && (
          <div className="mb-5 rounded-lg border border-amber-300 bg-amber-50 px-5 py-4 text-sm text-amber-800">
            ⚙️ La conversion nécessite une clé <code>GEMINI_API_KEY</code> côté
            serveur pour être activée.
          </div>
        )}
        <PhotoConverter onResult={setResultUrl} />
      </Step>

      {/* Barre de récapitulatif + CTA */}
      <div className="sticky bottom-4 z-20">
        <div className="flex flex-col items-center justify-between gap-4 rounded-lg border border-line bg-cream/95 px-6 py-4 shadow-lg backdrop-blur sm:flex-row">
          <div className="text-sm text-ink-soft">
            <span className="text-ink">{support.name}</span> · {material.name}
            <span className="mx-2">·</span>
            <span className="text-lg font-medium text-ink">{priceLabel}</span>
          </div>
          <Button
            size="lg"
            disabled={!canContinue}
            onClick={() => setModalOpen(true)}
          >
            {canContinue ? "Découvrir & continuer" : "Convertissez une photo d'abord"}
          </Button>
        </div>
      </div>

      {modalOpen && resultUrl && (
        <LeadModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          previewUrl={resultUrl}
          priceLabel={priceLabel}
          config={configSummary}
          onPay={handlePay}
        />
      )}
    </div>
  );
}

/* ------------------------------ Sous-composants ------------------------------ */

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-4 flex items-center gap-3 text-lg text-ink">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-xs text-cream">
          {n}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function SupportCard({
  support,
  selected,
  onSelect,
}: {
  support: PendantSupport;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`rounded-lg border p-4 text-left text-sm transition-colors ${
        selected
          ? "border-gold ring-1 ring-gold"
          : "border-line hover:border-gold/60"
      }`}
    >
      <span className="block text-ink">{support.name}</span>
      <span className="block text-ink-soft">{support.shape}</span>
      <span className="mt-2 block text-xs text-gold-dark">
        dès {formatPrice(support.basePrice)}
      </span>
    </button>
  );
}

function MaterialChip({
  material,
  selected,
  onSelect,
}: {
  material: Material;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`rounded-full border px-4 py-2 text-sm transition-colors ${
        selected
          ? "border-gold bg-gold/10 text-ink"
          : "border-line text-ink hover:border-gold/60"
      }`}
    >
      {material.name}
      {material.priceModifier > 0 && (
        <span className="ml-1 text-xs text-ink-soft">
          +{formatPrice(material.priceModifier)}
        </span>
      )}
    </button>
  );
}
