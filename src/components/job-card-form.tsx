"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { SignaturePad } from "./capture/signature-pad";
import {
  Section,
  Field,
  Input,
  Textarea,
  Buttons,
  NoticeBanner,
  inputClass,
  type Notice,
} from "./capture/form-ui";
import { submitDocument, sentMessage } from "@/lib/submit-document";

const CHECKLIST_LABELS = [
  "Vehicle received & inspected",
  "Parts checked against order",
  "Fitment completed",
  "Electrical / sensors tested",
  "Cleaned & quality checked",
  "Customer walkthrough completed",
];

type PartRow = { description: string; qty: string; sku: string };

const EMPTY = {
  orderNumber: "",
  jobNumber: "",
  customer: "",
  vehicle: "",
  workRequired: "",
  installer: "",
  estimatedHours: "",
  startDate: "",
  completionDate: "",
  completionNotes: "",
};

const REQUIRED: [keyof typeof EMPTY, string][] = [
  ["orderNumber", "MW order number"],
  ["jobNumber", "Job number"],
  ["customer", "Customer"],
  ["vehicle", "Vehicle"],
  ["workRequired", "Work required"],
  ["installer", "Installer assigned"],
  ["startDate", "Start date"],
];

export function JobCardForm() {
  const [v, setV] = useState(EMPTY);
  const [parts, setParts] = useState<PartRow[]>([{ description: "", qty: "", sku: "" }]);
  const [checklist, setChecklist] = useState(
    CHECKLIST_LABELS.map((label) => ({ label, done: false })),
  );
  const [completed, setCompleted] = useState(false);
  const [installerSignature, setInstallerSignature] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  const set = (k: keyof typeof EMPTY) => (val: string) =>
    setV((s) => ({ ...s, [k]: val }));

  function updatePart(i: number, key: keyof PartRow, val: string) {
    setParts((rows) => rows.map((r, idx) => (idx === i ? { ...r, [key]: val } : r)));
  }
  function addPart() {
    setParts((rows) => [...rows, { description: "", qty: "", sku: "" }]);
  }
  function removePart(i: number) {
    setParts((rows) => (rows.length > 1 ? rows.filter((_, idx) => idx !== i) : rows));
  }
  function toggleCheck(i: number) {
    setChecklist((items) =>
      items.map((c, idx) => (idx === i ? { ...c, done: !c.done } : c)),
    );
  }

  function reset() {
    setV(EMPTY);
    setParts([{ description: "", qty: "", sku: "" }]);
    setChecklist(CHECKLIST_LABELS.map((label) => ({ label, done: false })));
    setCompleted(false);
    setInstallerSignature("");
    setNotice(null);
  }

  async function onGenerate() {
    setNotice(null);
    const missing = REQUIRED.filter(([k]) => !v[k]?.trim());
    if (missing.length > 0) {
      setNotice({
        kind: "error",
        message: `Please complete: ${missing.map(([, l]) => l).join(", ")}.`,
      });
      return;
    }
    setSubmitting(true);
    try {
      const result = await submitDocument("job-card", {
        ...v,
        parts: parts
          .filter((p) => p.description.trim())
          .map((p) => ({ description: p.description.trim(), qty: p.qty, sku: p.sku })),
        checklist,
        completed,
        installerSignature,
      });
      setNotice(
        result.ok
          ? { kind: "success", message: sentMessage(result) }
          : { kind: "error", message: result.error },
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form noValidate onSubmit={(e) => e.preventDefault()} className="space-y-6">
      <NoticeBanner notice={notice} />

      <Section number={1} title="Order & Customer">
        <Field label="MW order number" required>
          <Input value={v.orderNumber} onChange={set("orderNumber")} placeholder="e.g. MW-10482" />
        </Field>
        <Field label="Job number" required>
          <Input value={v.jobNumber} onChange={set("jobNumber")} />
        </Field>
        <Field label="Customer" required>
          <Input value={v.customer} onChange={set("customer")} />
        </Field>
        <Field label="Vehicle" required>
          <Input value={v.vehicle} onChange={set("vehicle")} placeholder="Year / Make / Model / Rego" />
        </Field>
        <Field label="Installer assigned" required>
          <Input value={v.installer} onChange={set("installer")} placeholder="e.g. Mike Brown" />
        </Field>
        <Field label="Estimated hours">
          <Input value={v.estimatedHours} onChange={set("estimatedHours")} type="number" />
        </Field>
        <Field label="Start date" required>
          <Input value={v.startDate} onChange={set("startDate")} type="date" />
        </Field>
      </Section>

      <Section number={2} title="Work Scope">
        <Field label="Work required" required full>
          <Textarea value={v.workRequired} onChange={set("workRequired")} />
        </Field>
      </Section>

      <Section number={3} title="Parts List">
        <div className="sm:col-span-2 space-y-2">
          <div className="hidden grid-cols-12 gap-2 px-1 text-xs font-medium uppercase tracking-wide text-zinc-500 sm:grid dark:text-zinc-400">
            <span className="col-span-7">Part / description</span>
            <span className="col-span-2">Qty</span>
            <span className="col-span-2">SKU</span>
            <span className="col-span-1" />
          </div>
          {parts.map((p, i) => (
            <div key={i} className="grid grid-cols-12 gap-2">
              <input
                value={p.description}
                onChange={(e) => updatePart(i, "description", e.target.value)}
                placeholder="Part / description"
                className={`col-span-12 sm:col-span-7 ${inputClass}`}
              />
              <input
                value={p.qty}
                onChange={(e) => updatePart(i, "qty", e.target.value)}
                placeholder="Qty"
                className={`col-span-5 sm:col-span-2 ${inputClass}`}
              />
              <input
                value={p.sku}
                onChange={(e) => updatePart(i, "sku", e.target.value)}
                placeholder="SKU"
                className={`col-span-5 sm:col-span-2 ${inputClass}`}
              />
              <button
                type="button"
                onClick={() => removePart(i)}
                aria-label="Remove part"
                className="col-span-2 inline-flex items-center justify-center rounded-md border border-zinc-300 text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 sm:col-span-1 dark:border-zinc-700 dark:hover:bg-zinc-800"
                disabled={parts.length === 1}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addPart}
            className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add part
          </button>
        </div>
      </Section>

      <Section number={4} title="Installer Checklist">
        <div className="sm:col-span-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {checklist.map((c, i) => (
            <label key={c.label} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={c.done}
                onChange={() => toggleCheck(i)}
                className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-950"
              />
              <span className="text-sm text-zinc-700 dark:text-zinc-300">{c.label}</span>
            </label>
          ))}
        </div>
      </Section>

      <Section number={5} title="Completion Sign-off">
        <div className="sm:col-span-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-950"
            />
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
              Job completed
            </span>
          </label>
        </div>
        <Field label="Completion date">
          <Input value={v.completionDate} onChange={set("completionDate")} type="date" />
        </Field>
        <Field label="Completion notes" full>
          <Textarea value={v.completionNotes} onChange={set("completionNotes")} />
        </Field>
        <div className="sm:col-span-2 sm:max-w-md">
          <SignaturePad label="Installer signature" onChange={setInstallerSignature} />
        </div>
      </Section>

      <Buttons submitting={submitting} onReset={reset} onGenerate={onGenerate} label="Generate job card" />
    </form>
  );
}
