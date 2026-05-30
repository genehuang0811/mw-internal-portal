/**
 * Client helper: POST form data to the document engine, which renders every
 * supported format (PDF/Word/Excel) and emails them to the document's
 * configured recipients. Nothing downloads to the device. Shared by every live
 * form so submit behaves identically across the portal.
 */
const FORMAT_LABEL: Record<string, string> = {
  pdf: "PDF",
  docx: "Word",
  xlsx: "Excel",
};

/** Human label for a list of formats, e.g. ["pdf","docx"] → "PDF and Word". */
export function formatList(formats: string[]): string {
  const names = formats.map((f) => FORMAT_LABEL[f] ?? f.toUpperCase());
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

/** Success message shown after a document is emailed. */
export function sentMessage(result: {
  sentTo: string[];
  formats: string[];
}): string {
  const who =
    result.sentTo.length > 0 ? result.sentTo.join(", ") : "the configured inbox";
  return `Sent ${formatList(result.formats)} to ${who}.`;
}

export type SubmitResult =
  | { ok: true; sentTo: string[]; filenames: string[]; formats: string[] }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function submitDocument(
  slug: string,
  data: Record<string, unknown>,
): Promise<SubmitResult> {
  let res: Response;
  try {
    res = await fetch(`/api/send/${slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch {
    return { ok: false, error: "Network error — please try again." };
  }

  const body = (await res.json().catch(() => ({}))) as {
    ok?: boolean;
    sentTo?: string[];
    filenames?: string[];
    formats?: string[];
    error?: string;
    issues?: { fieldErrors?: Record<string, string[]> };
  };

  if (!res.ok || !body.ok) {
    return {
      ok: false,
      error: body.error ?? "Failed to send the document.",
      fieldErrors: body.issues?.fieldErrors,
    };
  }

  return {
    ok: true,
    sentTo: body.sentTo ?? [],
    filenames: body.filenames ?? [],
    formats: body.formats ?? [],
  };
}
