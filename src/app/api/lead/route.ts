import { NextResponse } from "next/server";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type LeadBody = {
  email?: string;
  googleCredential?: string;
  /** Résumé de la configuration choisie (support, matière, prix…). */
  config?: Record<string, unknown>;
};

type GoogleTokenInfo = {
  email?: string;
  email_verified?: string | boolean;
  aud?: string;
  name?: string;
};

/**
 * Vérifie un identifiant Google (JWT issu de Google Identity Services) et en
 * extrait l'email. Vérification légère via l'endpoint tokeninfo de Google,
 * sans dépendance supplémentaire.
 */
async function verifyGoogleCredential(
  jwt: string,
): Promise<{ email: string; name?: string } | null> {
  try {
    const res = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(jwt)}`,
    );
    if (!res.ok) return null;
    const info = (await res.json()) as GoogleTokenInfo;

    const expectedAud = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (expectedAud && info.aud !== expectedAud) return null;

    const verified =
      info.email_verified === true || info.email_verified === "true";
    if (!info.email || !verified) return null;

    return { email: info.email, name: info.name };
  } catch {
    return null;
  }
}

/**
 * Enregistre le lead. Si LEAD_WEBHOOK_URL est défini, on le transmet (ex. CRM,
 * Zapier, Make, Notion…). Sinon, on le journalise — à brancher sur le canal
 * définitif (base de données, email, CRM).
 */
async function persistLead(lead: {
  email: string;
  name?: string;
  source: "email" | "google";
  config?: Record<string, unknown>;
}) {
  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, capturedAt: new Date().toISOString() }),
      });
      return;
    } catch (err) {
      console.error("[/api/lead] échec du webhook:", err);
    }
  }
  console.log("[/api/lead] nouveau lead:", JSON.stringify(lead));
}

/**
 * POST /api/lead
 * Body JSON : { email?, googleCredential?, config? }
 * Capture un contact (email saisi ou connexion Google) avant la révélation
 * de l'aperçu et le paiement.
 */
export async function POST(request: Request) {
  let body: LeadBody;
  try {
    body = (await request.json()) as LeadBody;
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  let email: string | undefined;
  let name: string | undefined;
  let source: "email" | "google" = "email";

  if (body.googleCredential) {
    const verified = await verifyGoogleCredential(body.googleCredential);
    if (!verified) {
      return NextResponse.json(
        { error: "Connexion Google invalide. Réessayez ou saisissez votre email." },
        { status: 401 },
      );
    }
    email = verified.email;
    name = verified.name;
    source = "google";
  } else if (body.email) {
    email = body.email.trim().toLowerCase();
  }

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Adresse email invalide." },
      { status: 422 },
    );
  }

  await persistLead({ email, name, source, config: body.config });

  return NextResponse.json({ ok: true, email });
}
