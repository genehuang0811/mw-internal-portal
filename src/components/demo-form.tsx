"use client";

import { useState, type ReactNode } from "react";
import type { DemoField, DemoFormConfig } from "@/lib/demo-forms";
import { DemoNotice } from "./demo-notice";

type FormState = Record<string, string>;

const DISPLAY_ONLY: ReadonlyArray<DemoField["type"]> = [
  "note",
  "file",
  "signature",
];

function emptyState(config: DemoFormConfig): FormState {
  const out: FormState = {};
  for (const section of config.sections) {
    for (const field of section.fields) {
      if (DISPLAY_ONLY.includes(field.type)) continue;
      out[field.id] = "";
    }
  }
  return out;
}

export function DemoForm({ config }: { config: DemoFormConfig }) {
  const [values, setValues] = useState<FormState>(() => emptyState(config));

  function set(name: string, v: string) {
    setValues((s) => ({ ...s, [name]: v }));
  }

  function reset() {
    setValues(emptyState(config));
  }

  const notice = config.demoNotice ?? "Demo only — not connected yet.";

  return (
    <form noValidate onSubmit={(e) => e.preventDefault()} className="space-y-6">
      <DemoNotice>{notice}</DemoNotice>

      {config.sections.map((section, idx) => (
        <Section
          key={section.title}
          number={idx + 1}
          title={section.title}
          hint={section.hint}
        >
          {section.fields.map((field) => (
            <Field key={field.id} field={field}>
              <FieldControl
                field={field}
                value={values[field.id] ?? ""}
                onChange={(v) => set(field.id, v)}
              />
            </Field>
          ))}
        </Section>
      ))}

      <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 bg-white px-5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Reset form
        </button>
        <button
          type="button"
          disabled
          aria-disabled="true"
          title={notice}
          className="inline-flex h-10 cursor-not-allowed items-center justify-center rounded-md bg-zinc-900 px-5 text-sm font-medium text-white opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
        >
          {config.submitLabel}
        </button>
      </div>
    </form>
  );
}

function FieldControl({
  field,
  value,
  onChange,
}: {
  field: DemoField;
  value: string;
  onChange: (v: string) => void;
}) {
  if (field.type === "note") {
    return (
      <p className="rounded-md border border-dashed border-zinc-300 bg-zinc-50 px-3 py-2 text-xs leading-5 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-400">
        {field.body}
      </p>
    );
  }

  if (field.type === "file") {
    return (
      <div className="flex flex-col items-center justify-center gap-1 rounded-md border border-dashed border-zinc-300 bg-zinc-50 px-3 py-5 text-center dark:border-zinc-700 dark:bg-zinc-900/60">
        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
          Upload placeholder
        </span>
        {field.body && (
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {field.body}
          </span>
        )}
        <span className="mt-1 inline-flex cursor-not-allowed items-center rounded border border-zinc-300 bg-white px-2.5 py-1 text-xs text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-500">
          Choose file (disabled)
        </span>
      </div>
    );
  }

  if (field.type === "signature") {
    return (
      <div className="flex h-24 items-center justify-center rounded-md border border-dashed border-zinc-300 bg-zinc-50 text-xs text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-400">
        {field.body ?? "Signature placeholder"}
      </div>
    );
  }

  if (field.type === "checkbox") {
    const checked = value === "yes";
    return (
      <label className="flex items-start gap-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked ? "yes" : "")}
          className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-950"
        />
        <span className="text-sm text-zinc-700 dark:text-zinc-300">
          {field.body ?? field.label}
        </span>
      </label>
    );
  }

  if (field.type === "checklist") {
    const selected = value ? value.split(",") : [];
    const toggle = (opt: string) => {
      const next = selected.includes(opt)
        ? selected.filter((s) => s !== opt)
        : [...selected, opt];
      onChange(next.join(","));
    };
    return (
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {(field.options ?? []).map((opt) => (
          <label key={opt} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => toggle(opt)}
              className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-950"
            />
            <span className="text-sm text-zinc-700 dark:text-zinc-300">
              {opt}
            </span>
          </label>
        ))}
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <textarea
        id={field.id}
        name={field.id}
        rows={3}
        value={value}
        placeholder={field.placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={baseInputClass}
      />
    );
  }

  if (field.type === "select") {
    return (
      <select
        id={field.id}
        name={field.id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={baseInputClass}
      >
        <option value="">Choose…</option>
        {(field.options ?? []).map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  }

  const inputType =
    field.type === "number"
      ? "number"
      : field.type === "date"
        ? "date"
        : field.type === "datetime-local"
          ? "datetime-local"
          : field.type === "email"
            ? "email"
            : field.type === "tel"
              ? "tel"
              : "text";
  return (
    <input
      id={field.id}
      name={field.id}
      type={inputType}
      value={value}
      placeholder={field.placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={baseInputClass}
      {...(field.type === "number"
        ? { inputMode: "decimal" as const, step: "0.01", min: "0" }
        : {})}
    />
  );
}

function Section({
  number,
  title,
  hint,
  children,
}: {
  number: number;
  title: string;
  hint?: string;
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
        {hint && (
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {hint}
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({
  field,
  children,
}: {
  field: DemoField;
  children: ReactNode;
}) {
  // Checkboxes render their own inline label.
  const showLabel = field.type !== "checkbox";
  return (
    <div className={field.fullWidth ? "sm:col-span-2" : undefined}>
      {showLabel && (
        <label
          htmlFor={field.id}
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-200"
        >
          {field.label}
          {field.required && <span className="ml-0.5 text-red-600">*</span>}
        </label>
      )}
      <div className={showLabel ? "mt-1" : undefined}>{children}</div>
    </div>
  );
}

const baseInputClass =
  "block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition-colors focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 disabled:bg-zinc-50 disabled:text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-100 dark:focus:ring-zinc-100 dark:disabled:bg-zinc-900";
