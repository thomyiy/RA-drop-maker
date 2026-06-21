"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const ACCEPTED = ["image/png", "image/jpeg"];
const MAX_BYTES = 8 * 1024 * 1024;

type Status = "idle" | "loading" | "done" | "error";

/**
 * Outil d'atelier : l'utilisateur importe une photo (PNG/JPEG flat),
 * on la convertit en line art noir & blanc via l'API Gemini (/api/convert).
 *
 * `onResult` remonte le line art généré (data URL) au flow parent, ou `null`
 * quand l'utilisateur change/retire sa photo.
 */
export function PhotoConverter({
  onResult,
}: {
  onResult?: (dataUrl: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setFile(null);
    setOriginalUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setResultUrl(null);
    setStatus("idle");
    setError(null);
    onResult?.(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function onSelect(selected: File | undefined) {
    setError(null);
    setResultUrl(null);
    setStatus("idle");
    onResult?.(null);
    if (!selected) return;

    if (!ACCEPTED.includes(selected.type)) {
      setError("Format non supporté : choisissez un PNG ou un JPEG.");
      return;
    }
    if (selected.size > MAX_BYTES) {
      setError("Image trop lourde (8 Mo maximum).");
      return;
    }

    setOriginalUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(selected);
    });
    setFile(selected);
  }

  async function convert() {
    if (!file) return;
    setStatus("loading");
    setError(null);
    setResultUrl(null);

    try {
      const body = new FormData();
      body.append("image", file);
      const res = await fetch("/api/convert", { method: "POST", body });
      const data = (await res.json()) as { dataUrl?: string; error?: string };

      if (!res.ok || !data.dataUrl) {
        throw new Error(data.error ?? "La conversion a échoué.");
      }
      setResultUrl(data.dataUrl);
      setStatus("done");
      onResult?.(data.dataUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue.");
      setStatus("error");
    }
  }

  return (
    <div className="space-y-8">
      {/* Zone de dépôt / sélection */}
      {!originalUrl ? (
        <label
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            onSelect(e.dataTransfer.files?.[0]);
          }}
          className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-line bg-sand/30 px-6 py-16 text-center transition-colors hover:border-gold"
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg"
            className="sr-only"
            onChange={(e) => onSelect(e.target.files?.[0] ?? undefined)}
          />
          <span className="text-3xl text-gold">＋</span>
          <span className="mt-3 font-medium text-ink">
            Importez votre photo
          </span>
          <span className="mt-1 text-sm text-ink-soft">
            PNG ou JPEG, 8 Mo maximum · glissez-déposez ou cliquez
          </span>
        </label>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Original */}
          <figure>
            <div className="overflow-hidden rounded-lg border border-line bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={originalUrl}
                alt="Photo importée"
                className="aspect-square w-full object-contain"
              />
            </div>
            <figcaption className="mt-2 text-center text-sm text-ink-soft">
              Votre photo
            </figcaption>
          </figure>

          {/* Résultat */}
          <figure>
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-line bg-white">
              {status === "loading" && (
                <div className="flex flex-col items-center gap-3 text-ink-soft">
                  <Spinner />
                  <span className="text-sm">Conversion en cours…</span>
                </div>
              )}
              {status !== "loading" && resultUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={resultUrl}
                  alt="Line art généré"
                  className="h-full w-full object-contain"
                />
              )}
              {status !== "loading" && !resultUrl && (
                <span className="px-6 text-center text-sm text-ink-soft">
                  Le line art apparaîtra ici
                </span>
              )}
            </div>
            <figcaption className="mt-2 text-center text-sm text-ink-soft">
              Line art noir & blanc
            </figcaption>
          </figure>
        </div>
      )}

      {error && (
        <p className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {/* Actions */}
      {originalUrl && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button onClick={convert} disabled={status === "loading"} size="lg">
            {status === "done" ? "Reconvertir" : "Convertir en line art"}
          </Button>
          {resultUrl && (
            <a
              href={resultUrl}
              download="line-art.png"
              className="inline-flex h-11 items-center justify-center rounded-full border border-ink/20 px-6 text-sm font-medium text-ink transition-colors hover:border-gold hover:text-gold-dark"
            >
              Télécharger
            </a>
          )}
          <button
            onClick={reset}
            className="text-sm text-ink-soft underline-offset-4 hover:text-ink hover:underline"
          >
            Changer de photo
          </button>
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg className="h-7 w-7 animate-spin text-gold" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path
        d="M22 12a10 10 0 0 1-10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
