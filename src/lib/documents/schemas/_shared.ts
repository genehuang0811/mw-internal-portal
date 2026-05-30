import { z } from "zod";

/** Required trimmed string. */
export const req = (label: string) =>
  z.string().trim().min(1, `${label} is required`);

/** Optional string, normalised to "". */
export const opt = z
  .string()
  .trim()
  .optional()
  .transform((v) => v ?? "");

/** Checkbox value ("yes"/"") → boolean. */
export const yesNo = z
  .string()
  .optional()
  .transform((v) => v === "yes");

/** Checklist value ("a,b,c") → string[]. */
export const csv = z
  .string()
  .optional()
  .transform((v) =>
    v && v.trim() ? v.split(",").map((s) => s.trim()).filter(Boolean) : [],
  );
