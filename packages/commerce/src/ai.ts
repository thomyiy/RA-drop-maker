import { GoogleGenAI } from "@google/genai";

/**
 * Conversion d'une photo en line art noir & blanc via l'API Gemini
 * (modèle d'édition d'images « Nano Banana », gemini-2.5-flash-image).
 *
 * Variables d'environnement :
 *   - GEMINI_API_KEY     (obligatoire)
 *   - GEMINI_IMAGE_MODEL (optionnel) surcharge du modèle
 */

const MODEL = process.env.GEMINI_IMAGE_MODEL ?? "gemini-2.5-flash-image";

const LINE_ART_PROMPT = [
  "Convert this photo into clean black and white line art.",
  "Use confident single-weight black outlines on a pure white background.",
  "Keep only the essential contours and a few key interior lines; remove",
  "shading, gradients, grayscale, color and background clutter.",
  "The result must be a minimal, elegant line drawing suitable for laser",
  "engraving on a small jewelry pendant. High contrast, pure #000000 lines",
  "on pure #FFFFFF, no gray.",
].join(" ");

export type ConversionResult = {
  /** Image résultante encodée en data URL (image/png base64). */
  dataUrl: string;
};

export class GeminiNotConfiguredError extends Error {
  constructor() {
    super("GEMINI_API_KEY manquante : la conversion n'est pas configurée.");
    this.name = "GeminiNotConfiguredError";
  }
}

export class GeminiNoImageError extends Error {
  constructor(message = "Le modèle n'a pas renvoyé d'image.") {
    super(message);
    this.name = "GeminiNoImageError";
  }
}

/** Indique si une clé Gemini est présente côté serveur. */
export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}

/**
 * Transforme une image (base64 + mimeType) en line art noir & blanc.
 * @returns une data URL `image/png;base64,...`
 */
export async function convertToLineArt(
  base64Image: string,
  mimeType: string,
): Promise<ConversionResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new GeminiNotConfiguredError();

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [
      {
        role: "user",
        parts: [
          { text: LINE_ART_PROMPT },
          { inlineData: { mimeType, data: base64Image } },
        ],
      },
    ],
  });

  const parts = response.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    const inline = part.inlineData;
    if (inline?.data) {
      const outMime = inline.mimeType ?? "image/png";
      return { dataUrl: `data:${outMime};base64,${inline.data}` };
    }
  }

  throw new GeminiNoImageError();
}
