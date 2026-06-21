import { Client } from "@notionhq/client";

/**
 * Enregistrement des leads dans une base Notion.
 *
 * Variables d'environnement :
 *   - NOTION_TOKEN              jeton d'intégration interne Notion
 *   - NOTION_LEADS_DATABASE_ID  id de la base « Leads »
 *
 * Schéma de base attendu (créé pour vous, voir README) :
 *   - Email      (titre)
 *   - Source     (sélection : email / google)
 *   - Support    (texte)
 *   - Matière    (texte)
 *   - Prix       (nombre)
 *   - Capturé le (date)
 */

export function isNotionConfigured(): boolean {
  return Boolean(process.env.NOTION_TOKEN && process.env.NOTION_LEADS_DATABASE_ID);
}

export type LeadRecord = {
  email: string;
  name?: string;
  source: "email" | "google";
  support?: string;
  material?: string;
  price?: number;
};

function richText(value: string) {
  return { rich_text: [{ text: { content: value } }] };
}

/** Crée une ligne de lead dans la base Notion. Lève en cas d'échec. */
export async function createNotionLead(lead: LeadRecord): Promise<void> {
  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_LEADS_DATABASE_ID;
  if (!token || !databaseId) {
    throw new Error("Notion non configuré (NOTION_TOKEN / NOTION_LEADS_DATABASE_ID).");
  }

  const notion = new Client({ auth: token });

  // Propriétés optionnelles ajoutées seulement si présentes, pour rester
  // tolérant à un schéma de base légèrement différent.
  const properties: Record<string, unknown> = {
    Email: { title: [{ text: { content: lead.email } }] },
    Source: { select: { name: lead.source } },
    "Capturé le": { date: { start: new Date().toISOString() } },
  };
  if (lead.support) properties["Support"] = richText(lead.support);
  if (lead.material) properties["Matière"] = richText(lead.material);
  if (typeof lead.price === "number") properties["Prix"] = { number: lead.price };

  await notion.pages.create({
    parent: { database_id: databaseId },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    properties: properties as any,
  });
}
