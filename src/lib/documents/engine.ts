import { DOCUMENTS } from "./registry";
import type { RenderResult } from "./types";

export type GenerateOutcome =
  | { ok: true; result: RenderResult }
  | { ok: false; status: number; error: string; issues?: unknown };

/** Look up a document definition by slug. */
export function getDocument(slug: string) {
  return DOCUMENTS[slug];
}

export function hasDocument(slug: string): boolean {
  return slug in DOCUMENTS;
}

export function listDocuments(): string[] {
  return Object.keys(DOCUMENTS);
}

/**
 * The single entry point: validate raw form data against the document's schema,
 * render it, and return the bytes + metadata. Renderer-agnostic.
 */
export async function generateDocument(
  slug: string,
  raw: unknown,
): Promise<GenerateOutcome> {
  const def = getDocument(slug);
  if (!def) {
    return { ok: false, status: 404, error: `Unknown document type: ${slug}` };
  }

  const parsed = def.schema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      status: 400,
      error: "Validation failed",
      issues: parsed.error.flatten(),
    };
  }

  try {
    const buffer = await def.render(parsed.data);
    return {
      ok: true,
      result: {
        buffer,
        filename: def.buildFilename(parsed.data),
        contentType: def.contentType,
      },
    };
  } catch (e) {
    const error = e instanceof Error ? e.message : "Failed to render document";
    return { ok: false, status: 500, error };
  }
}
