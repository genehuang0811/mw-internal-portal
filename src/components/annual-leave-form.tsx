"use client";

import { useMemo, useState, type ReactNode } from "react";
import { User, UserCheck, Calculator, ArrowRight, ArrowDown } from "lucide-react";
import { DemoNotice } from "./demo-notice";
import { downloadDocument } from "@/lib/download-document";

type Notice =
  | { kind: "success"; message: string }
  | { kind: "error"; message: string }
  | null;

const LEAVE_TYPES = [
  "Annual leave",
  "Personal / carer's leave",
  "Unpaid leave",
  "Long service leave",
];

type State = {
  employeeName: string;
  leaveType: string;
  manager: string;
  startDate: string;
  endDate: string;
  notes: string;
};

const EMPTY: State = {
  employeeName: "",
  leaveType: "",
  manager: "",
  startDate: "",
  endDate: "",
  notes: "",
};

/** Inclusive whole-day difference between two YYYY-MM-DD strings. */
function inclusiveDays(start: string, end: string): number | null {
  if (!start || !end) return null;
  const s = Date.parse(`${start}T00:00:00Z`);
  const e = Date.parse(`${end}T00:00:00Z`);
  if (Number.isNaN(s) || Number.isNaN(e)) return null;
  return Math.round((e - s) / 86_400_000) + 1;
}

export function AnnualLeaveForm() {
  const [values, setValues] = useState<State>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  const set =
    (name: keyof State) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setValues((s) => ({ ...s, [name]: e.target.value }));

  const days = useMemo(
    () => inclusiveDays(values.startDate, values.endDate),
    [values.startDate, values.endDate],
  );
  const invalidRange = days !== null && days < 1;

  async function onGenerate() {
    setNotice(null);
    const missing = (
      [
        ["employeeName", "Employee name"],
        ["leaveType", "Leave type"],
        ["manager", "Manager"],
        ["startDate", "Start date"],
        ["endDate", "End date"],
      ] as const
    ).filter(([k]) => !values[k]?.trim());
    if (missing.length > 0) {
      setNotice({
        kind: "error",
        message: `Please complete: ${missing.map(([, l]) => l).join(", ")}.`,
      });
      return;
    }
    if (invalidRange) {
      setNotice({
        kind: "error",
        message: "End date cannot be before the start date.",
      });
      return;
    }
    setSubmitting(true);
    try {
      const result = await downloadDocument("annual-leave", values);
      setNotice(
        result.ok
          ? { kind: "success", message: `Generated ${result.filename}. Download started.` }
          : { kind: "error", message: result.error },
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form noValidate onSubmit={(e) => e.preventDefault()} className="space-y-6">
      <DemoNotice>
        Generates a branded MW PDF you can download. Cloud upload &amp; email
        coming later.
      </DemoNotice>

      {notice && (
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
      )}

      <Section number={1} title="Employee">
        <Field id="employeeName" label="Employee name" required fullWidth>
          <input
            id="employeeName"
            value={values.employeeName}
            onChange={set("employeeName")}
            placeholder="e.g. Sarah Lee"
            className={inputClass}
          />
        </Field>
        <Field id="leaveType" label="Leave type" required>
          <select
            id="leaveType"
            value={values.leaveType}
            onChange={set("leaveType")}
            className={inputClass}
          >
            <option value="">Choose…</option>
            {LEAVE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
        <Field id="manager" label="Manager" required>
          <input
            id="manager"
            value={values.manager}
            onChange={set("manager")}
            placeholder="e.g. Tom Nguyen"
            className={inputClass}
          />
        </Field>
      </Section>

      <Section number={2} title="Dates">
        <Field id="startDate" label="Start date" required>
          <input
            id="startDate"
            type="date"
            value={values.startDate}
            onChange={set("startDate")}
            className={inputClass}
          />
        </Field>
        <Field id="endDate" label="End date" required>
          <input
            id="endDate"
            type="date"
            value={values.endDate}
            onChange={set("endDate")}
            min={values.startDate || undefined}
            className={inputClass}
          />
        </Field>
        <Field id="notes" label="Reason / notes" fullWidth>
          <textarea
            id="notes"
            rows={3}
            value={values.notes}
            onChange={set("notes")}
            placeholder="Optional — any details for your manager"
            className={inputClass}
          />
        </Field>

        {/* Live total / validation */}
        <div className="sm:col-span-2">
          {invalidRange ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
              End date can&apos;t be before the start date. Please pick an end
              date on or after {values.startDate}.
            </p>
          ) : days !== null ? (
            <div className="flex items-center justify-between rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-900/60 dark:bg-emerald-950/40">
              <span className="text-sm text-emerald-800 dark:text-emerald-200">
                Total days requested
              </span>
              <span className="text-base font-semibold text-emerald-900 dark:text-emerald-100">
                {days} {days === 1 ? "day" : "days"}
              </span>
            </div>
          ) : (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Select a start and end date to see the total days requested.
            </p>
          )}
        </div>
      </Section>

      {/* Approval flow (visual only) */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          Approval flow
        </h2>
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <FlowStep icon={<User className="h-4 w-4" />} label="Employee" sub="You submit" />
          <FlowArrow />
          <FlowStep
            icon={<UserCheck className="h-4 w-4" />}
            label="Manager approval"
            sub={values.manager || "Your manager"}
          />
          <FlowArrow />
          <FlowStep
            icon={<Calculator className="h-4 w-4" />}
            label="Accounts processing"
            sub="Recorded & filed"
          />
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => {
            setValues(EMPTY);
            setNotice(null);
          }}
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
          {submitting ? "Generating…" : "Submit leave request"}
        </button>
      </div>
    </form>
  );
}

function FlowStep({
  icon,
  label,
  sub,
}: {
  icon: ReactNode;
  label: string;
  sub: string;
}) {
  return (
    <div className="flex flex-1 items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950/50">
      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-zinc-700 shadow-sm dark:bg-zinc-800 dark:text-zinc-200">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {label}
        </p>
        <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{sub}</p>
      </div>
    </div>
  );
}

function FlowArrow() {
  return (
    <span className="flex items-center justify-center text-zinc-400 dark:text-zinc-500">
      <ArrowDown className="h-4 w-4 sm:hidden" aria-hidden="true" />
      <ArrowRight className="hidden h-4 w-4 sm:block" aria-hidden="true" />
    </span>
  );
}

function Section({
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

function Field({
  id,
  label,
  required,
  fullWidth,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={fullWidth ? "sm:col-span-2" : undefined}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-zinc-700 dark:text-zinc-200"
      >
        {label}
        {required && <span className="ml-0.5 text-red-600">*</span>}
      </label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

const inputClass =
  "block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition-colors focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-100 dark:focus:ring-zinc-100";
