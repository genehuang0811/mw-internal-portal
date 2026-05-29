/** Today's date as YYYY-MM-DD (UTC) for filenames. */
export function dateStamp(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Make an arbitrary string safe for use in a filename. */
export function safe(value: string, max = 40): string {
  return (value ?? "").replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, max);
}

/**
 * Build a consistent MW document filename:
 *   MW-<Doc>-<part1>-<part2>-YYYY-MM-DD.pdf
 */
export function buildFilename(
  doc: string,
  parts: Array<string | undefined>,
  ext = "pdf",
): string {
  const cleaned = parts
    .map((p) => (p ? safe(p, 30) : ""))
    .filter(Boolean);
  return ["MW", safe(doc, 30), ...cleaned, dateStamp()].join("-") + "." + ext;
}
