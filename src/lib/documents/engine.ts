import { DOCUMENTS } from "./registry";
import { sendEmail } from "../email/send";
import type { DocumentDefinition, RenderedFile } from "./types";

/** Look up a document definition by slug. */
export function getDocument(slug: string): DocumentDefinition | undefined {
  return DOCUMENTS[slug];
}

export function hasDocument(slug: string): boolean {
  return slug in DOCUMENTS;
}

export function listDocuments(): string[] {
  return Object.keys(DOCUMENTS);
}

/** Formats a document offers, e.g. ["pdf","docx","xlsx"]. */
export function formatsFor(slug: string): string[] {
  return getDocument(slug)?.formats.map((f) => f.format) ?? [];
}

type ValidationFail = {
  ok: false;
  status: number;
  error: string;
  issues?: unknown;
};

/** Validate raw input and render every supported format. */
async function renderAll(
  def: DocumentDefinition,
  raw: unknown,
): Promise<{ ok: true; data: unknown; files: RenderedFile[] } | ValidationFail> {
  const parsed = def.schema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      status: 400,
      error: "Validation failed",
      issues: parsed.error.flatten(),
    };
  }
  const data = parsed.data;
  const base = def.buildBaseName(data);
  const files: RenderedFile[] = [];
  for (const fmt of def.formats) {
    const buffer = await fmt.render(data);
    files.push({
      format: fmt.format,
      buffer,
      filename: `${base}.${fmt.ext}`,
      contentType: fmt.contentType,
    });
  }
  return { ok: true, data, files };
}

export type GenerateOutcome =
  | { ok: true; result: RenderedFile }
  | { ok: false; status: number; error: string; issues?: unknown };

/**
 * Validate and render the primary (first) format only — used by the legacy
 * single-file download route.
 */
export async function generateDocument(
  slug: string,
  raw: unknown,
): Promise<GenerateOutcome> {
  const def = getDocument(slug);
  if (!def) {
    return { ok: false, status: 404, error: `Unknown document type: ${slug}` };
  }
  try {
    const rendered = await renderAll(def, raw);
    if (!rendered.ok) return rendered;
    return { ok: true, result: rendered.files[0] };
  } catch (e) {
    const error = e instanceof Error ? e.message : "Failed to render document";
    return { ok: false, status: 500, error };
  }
}

export type SendOutcome =
  | { ok: true; sentTo: string[]; filenames: string[]; formats: string[] }
  | { ok: false; status: number; error: string; issues?: unknown };

/**
 * The live entry point: validate, render every format, and email them as
 * attachments to the document's configured recipients. No file is returned to
 * the browser — delivery is email-only.
 */
export async function sendDocument(
  slug: string,
  raw: unknown,
): Promise<SendOutcome> {
  const def = getDocument(slug);
  if (!def) {
    return { ok: false, status: 404, error: `Unknown document type: ${slug}` };
  }

  let data: unknown;
  let files: RenderedFile[];
  try {
    const rendered = await renderAll(def, raw);
    if (!rendered.ok) return rendered;
    data = rendered.data;
    files = rendered.files;
  } catch (e) {
    const error = e instanceof Error ? e.message : "Failed to render document";
    return { ok: false, status: 500, error };
  }

  const summary = def.emailSummary?.(data);
  const formatList = files.map((f) => f.format.toUpperCase()).join(", ");
  const text = [
    `A new ${def.title} has been submitted via the MW Staff Hub.`,
    "",
    summary ?? "",
    summary ? "" : null,
    `Attached: ${files.map((f) => f.filename).join(", ")} (${formatList}).`,
    "",
    "— MW Staff Hub",
  ]
    .filter((l) => l !== null)
    .join("\n");

  const result = await sendEmail({
    to: def.recipients,
    subject: def.emailSubject(data),
    text,
    attachments: files.map((f) => ({ filename: f.filename, content: f.buffer })),
  });

  if (!result.ok) {
    return { ok: false, status: 502, error: result.error };
  }

  return {
    ok: true,
    sentTo: def.recipients,
    filenames: files.map((f) => f.filename),
    formats: files.map((f) => f.format),
  };
}
