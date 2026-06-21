import { NextResponse } from "next/server";
import {
  convertToLineArt,
  isGeminiConfigured,
  GeminiNoImageError,
} from "@/lib/gemini";

export const runtime = "nodejs";
export const maxDuration = 60;

const ACCEPTED = ["image/png", "image/jpeg"];
const MAX_BYTES = 8 * 1024 * 1024; // 8 Mo

/**
 * POST /api/convert
 * Body : multipart/form-data, champ `image` (PNG ou JPEG).
 * Réponse : { dataUrl: "data:image/png;base64,..." }
 */
export async function POST(request: Request) {
  if (!isGeminiConfigured()) {
    return NextResponse.json(
      {
        error:
          "Service de conversion indisponible (clé GEMINI_API_KEY non configurée).",
      },
      { status: 503 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Requête invalide : envoyez un fichier en multipart/form-data." },
      { status: 400 },
    );
  }

  const file = formData.get("image");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Aucune image reçue (champ « image » attendu)." },
      { status: 400 },
    );
  }

  if (!ACCEPTED.includes(file.type)) {
    return NextResponse.json(
      { error: "Format non supporté : importez un PNG ou un JPEG." },
      { status: 415 },
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Image trop lourde (8 Mo maximum)." },
      { status: 413 },
    );
  }

  const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");

  try {
    const result = await convertToLineArt(base64, file.type);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof GeminiNoImageError) {
      return NextResponse.json(
        {
          error:
            "La conversion n'a pas abouti. Réessayez avec une photo plus nette et bien cadrée.",
        },
        { status: 502 },
      );
    }
    console.error("[/api/convert] erreur:", err);
    return NextResponse.json(
      { error: "Une erreur est survenue pendant la conversion." },
      { status: 500 },
    );
  }
}
