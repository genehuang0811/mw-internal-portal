import type { ReactNode } from "react";
import type { ZodType } from "zod";

/** Shared presentational form building blocks for the bespoke live forms. */

/**
 * Validate a raw string payload against a document schema and return either the
 * parsed data or a flat `{ field: message }` error map (first message per
 * field). Lets every live form validate with the exact schema the engine uses.
 */
export function validateForm<TOut>(
  schema: ZodType<TOut>,
  payload: unknown,
):
  | { ok: true; data: TOut }
  | { ok: false; errors: Record<string, string> } {
  const parsed = schema.safeParse(payload);
  if (parsed.success) return { ok: true, data: parsed.data };
  const flat = parsed.error.flatten();
  const fieldErrors = flat.fieldErrors as Record<string, string[] | undefined>;
  const errors: Record<string, string> = {};
  for (const [k, msgs] of Object.entries(fieldErrors)) {
    if (msgs && msgs.length > 0) errors[k] = msgs[0]!;
  }
  return { ok: false, errors };
}

/** Smooth-scroll to the first errored field (`field-{id}`). */
export function scrollToFirstError(errors: Record<string, string>): void {
  const first = Object.keys(errors)[0];
  if (first) {
    document
      .getElementById(`field-${first}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

export function Section({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-5 flex items-baseline gap-3">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
          {number}
        </span>
        <h2 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {title}
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export function Field({
  id,
  label,
  required,
  full,
  error,
  children,
}: {
  /** When set, wraps the field as `field-{id}` so errors can be scrolled to. */
  id?: string;
  label: string;
  required?: boolean;
  full?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      id={id ? `field-${id}` : undefined}
      className={full ? "sm:col-span-2" : undefined}
    >
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
        {label}
        {required && <span className="ml-0.5 text-red-600">*</span>}
      </label>
      <div className="mt-1">{children}</div>
      {error && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

export const inputClass =
  "block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition-colors focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-100 dark:focus:ring-zinc-100";

export function Input({
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={inputClass}
      {...(type === "number" ? { inputMode: "decimal" as const, min: "0" } : {})}
    />
  );
}

export function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      rows={rows}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={inputClass}
    />
  );
}

export function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>
      <option value="">Choose…</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

export type Notice =
  | { kind: "success"; message: string }
  | { kind: "error"; message: string }
  | null;

export function NoticeBanner({ notice }: { notice: Notice }) {
  if (!notice) return null;
  return (
    <div
      role="status"
      className={
        notice.kind === "success"
          ? "rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200"
          : "rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200"
      }
    >
      {notice.message}
    </div>
  );
}

export function Buttons({
  submitting,
  onReset,
  onGenerate,
  label,
}: {
  submitting: boolean;
  onReset: () => void;
  onGenerate: () => void;
  label: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
      <button
        type="button"
        onClick={onReset}
        disabled={submitting}
        className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 bg-white px-5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
      >
        Reset form
      </button>
      <button
        type="button"
        onClick={onGenerate}
        disabled={submitting}
        className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
      >
        {submitting ? "Generating…" : label}
      </button>
    </div>
  );
}
