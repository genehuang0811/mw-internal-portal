/**
 * Client helper: POST form data to the document engine and download the
 * resulting file. Shared by every live form so submit/download behaves
 * identically across the portal.
 */
export type DownloadResult =
  | { ok: true; filename: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function downloadDocument(
  slug: string,
  data: Record<string, unknown>,
): Promise<DownloadResult> {
  let res: Response;
  try {
    res = await fetch(`/api/generate/${slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch {
    return { ok: false, error: "Network error — please try again." };
  }

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as {
      error?: string;
      issues?: { fieldErrors?: Record<string, string[]> };
    };
    return {
      ok: false,
      error: body.error ?? "Failed to generate the document.",
      fieldErrors: body.issues?.fieldErrors,
    };
  }

  const blob = await res.blob();
  const disposition = res.headers.get("Content-Disposition") ?? "";
  const match = /filename="?([^"]+)"?/.exec(disposition);
  const filename = match?.[1] ?? `${slug}.pdf`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  return { ok: true, filename };
}
