"use client";

import { useState, type ReactNode } from "react";
import type { DemoField, DemoFormConfig } from "@/lib/demo-forms";

type FormState = Record<string, string>;

function emptyState(config: DemoFormConfig): FormState {
  const out: FormState = {};
  for (const section of config.sections) {
    for (const field of section.fields) {
      if (field.type === "note") continue;
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

  return (
    <form
      noValidate
      onSubmit={(e) => e.preventDefault()}
      className="space-y-6"
    >
      <div
        role="note"
        className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200"
      >
        Demo only — output template not connected yet.
      </div>

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
          title="Demo only — output template not connected yet."
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
  return (
    <div className={field.fullWidth ? "sm:col-span-2" : undefined}>
      <label
        htmlFor={field.id}
        className="block text-sm font-medium text-zinc-700 dark:text-zinc-200"
      >
        {field.label}
        {field.required && <span className="ml-0.5 text-red-600">*</span>}
      </label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

const baseInputClass =
  "block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition-colors focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 disabled:bg-zinc-50 disabled:text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-100 dark:focus:ring-zinc-100 dark:disabled:bg-zinc-900";
