"use client";

import { useEffect, useRef } from "react";

/* Types minimaux de Google Identity Services (script externe). */
type GoogleId = {
  accounts: {
    id: {
      initialize: (config: {
        client_id: string;
        callback: (resp: { credential?: string }) => void;
      }) => void;
      renderButton: (
        parent: HTMLElement,
        options: Record<string, string | number>,
      ) => void;
    };
  };
};

declare global {
  interface Window {
    google?: GoogleId;
  }
}

const SCRIPT_SRC = "https://accounts.google.com/gsi/client";

/**
 * Bouton « Continuer avec Google » (Google Identity Services).
 * Rendu uniquement si NEXT_PUBLIC_GOOGLE_CLIENT_ID est défini.
 * Remonte le JWT (credential) au parent, qui le vérifie côté serveur.
 */
export function GoogleSignin({
  onCredential,
}: {
  onCredential: (credential: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId || !ref.current) return;

    let cancelled = false;

    function init() {
      if (cancelled || !window.google || !ref.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId!,
        callback: (resp) => {
          if (resp.credential) onCredential(resp.credential);
        },
      });
      ref.current.innerHTML = "";
      window.google.accounts.id.renderButton(ref.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "pill",
        width: 320,
      });
    }

    if (window.google) {
      init();
    } else {
      const existing = document.querySelector<HTMLScriptElement>(
        `script[src="${SCRIPT_SRC}"]`,
      );
      if (existing) {
        existing.addEventListener("load", init);
      } else {
        const script = document.createElement("script");
        script.src = SCRIPT_SRC;
        script.async = true;
        script.defer = true;
        script.onload = init;
        document.head.appendChild(script);
      }
    }

    return () => {
      cancelled = true;
    };
  }, [clientId, onCredential]);

  if (!clientId) return null;

  return <div ref={ref} className="flex justify-center" />;
}
