import { useMemo, useState } from "react";

/**
 * Logique « headless » du parcours configurateur (sans présentation).
 * La mise en forme (JSX/styles) reste dans le drop → pas de couplage CSS.
 */

export type ConfigSupport = { id: string; name: string; basePrice: number };
export type ConfigMaterial = { id: string; name: string; priceModifier: number };

export type ConfigSummary = {
  support: string;
  material: string;
  price: number;
  currency: string;
};

export type UseConfiguratorArgs = {
  supports: ConfigSupport[];
  materials: ConfigMaterial[];
  currency?: string;
  /** Endpoint de création de session de paiement. Défaut: /api/checkout */
  checkoutPath?: string;
  /** Page de repli si le paiement n'est pas configuré. Défaut: /paiement */
  fallbackPath?: string;
  /** Navigation (ex. router.push de Next). */
  navigate: (path: string) => void;
};

export function useConfigurator(args: UseConfiguratorArgs) {
  const { supports, materials } = args;
  const currency = args.currency ?? "EUR";

  const [supportId, setSupportId] = useState(supports[0].id);
  const [materialId, setMaterialId] = useState(materials[0].id);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const support = supports.find((s) => s.id === supportId)!;
  const material = materials.find((m) => m.id === materialId)!;
  const price = support.basePrice + material.priceModifier;

  const configSummary = useMemo<ConfigSummary>(
    () => ({ support: support.name, material: material.name, price, currency }),
    [support.name, material.name, price, currency],
  );

  const canContinue = Boolean(resultUrl);

  /** Lance le paiement (Stripe Checkout) ; repli sur fallbackPath sinon. */
  async function pay(email?: string): Promise<void> {
    try {
      const res = await fetch(args.checkoutPath ?? "/api/checkout", {
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
    args.navigate(args.fallbackPath ?? "/paiement");
  }

  return {
    supportId, setSupportId,
    materialId, setMaterialId,
    resultUrl, setResultUrl,
    modalOpen, setModalOpen,
    support, material, price, currency,
    configSummary, canContinue, pay,
  };
}

/** Formatte un prix (par défaut EUR, locale fr-FR). */
export function formatPrice(amount: number, currency = "EUR"): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}
