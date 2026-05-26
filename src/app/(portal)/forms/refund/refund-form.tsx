"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  APPROVAL_STATUS_OPTIONS,
  ORDER_STATUS_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  REASON_OPTIONS,
  REFUND_METHOD,
  STORE_OPTIONS,
  YES_NO_OPTIONS,
  refundSchema,
} from "@/lib/schema";

type FormState = Record<string, string>;

type Notice =
  | { kind: "success"; message: string }
  | { kind: "error"; message: string }
  | null;

const EMPTY: FormState = {
  store: "",
  dateOfSale: "",
  transactionNo: "",
  invoiceNo: "",
  totalSalesAmount: "",
  amountPaid: "",
  paymentMethod: "",
  orderStatus: "",
  orderNotes: "",
  reason: "",
  explanation: "",
  customer: "",
  phone: "",
  email: "",
  address: "",
  refundAmount: "",
  bsb: "",
  accountNumber: "",
  accountName: "",
  salesStaff: "",
  managerApproval: "",
  approvalDate: "",
  approvalStatus: "Draft",
  processedBy: "",
  dateProcessed: "",
  xeroReference: "",
  paymentDate: "",
  trUpdated: "",
  shopInformed: "",
};

export function RefundForm() {
  const [values, setValues] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<Notice>(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (name: string) => (v: string) => {
    setValues((s) => ({ ...s, [name]: v }));
    if (errors[name]) {
      setErrors((e) => {
        const rest = { ...e };
        delete rest[name];
        return rest;
      });
    }
  };

  function reset() {
    setValues(EMPTY);
    setErrors({});
    setNotice(null);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setNotice(null);

    const candidate: Record<string, unknown> = { ...values };
    for (const k of ["totalSalesAmount", "amountPaid", "refundAmount"]) {
      const v = candidate[k];
      candidate[k] = v === "" || v == null ? undefined : Number(v);
    }
    for (const k of ["trUpdated", "shopInformed"]) {
      if (candidate[k] === "") candidate[k] = undefined;
    }

    const parsed = refundSchema.safeParse(candidate);
    if (!parsed.success) {
      const flat = parsed.error.flatten();
      const fieldErrs: Record<string, string> = {};
      for (const [k, msgs] of Object.entries(flat.fieldErrors)) {
        if (msgs && msgs.length > 0) fieldErrs[k] = msgs[0]!;
      }
      setErrors(fieldErrs);
      setNotice({
        kind: "error",
        message: "Please fix the highlighted fields and try again.",
      });
      const firstKey = Object.keys(fieldErrs)[0];
      if (firstKey) {
        const el = document.getElementById(`field-${firstKey}`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        (el as HTMLInputElement | null)?.focus?.();
      }
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/generate-refund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setNotice({
          kind: "error",
          message: body.error ?? "Failed to generate the refund file.",
        });
        return;
      }
      const blob = await res.blob();
      const disposition = res.headers.get("Content-Disposition") ?? "";
      const match = /filename="?([^"]+)"?/.exec(disposition);
      const filename = match?.[1] ?? "MW-Refund.xlsx";
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setNotice({
        kind: "success",
        message: `Generated ${filename}. Download started.`,
      });
    } catch {
      setNotice({ kind: "error", message: "Network error — please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  const refundOverPaid = useMemo(() => {
    const paid = Number(values.amountPaid);
    const refund = Number(values.refundAmount);
    if (!values.amountPaid || !values.refundAmount) return false;
    if (Number.isNaN(paid) || Number.isNaN(refund)) return false;
    return refund > paid;
  }, [values.amountPaid, values.refundAmount]);

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
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

      <Section number={1} title="Store & Sales Details">
        <Field id="store" label="Store" error={errors.store} required>
          <Select
            id="store"
            value={values.store}
            onChange={set("store")}
            options={STORE_OPTIONS}
            placeholder="Choose store"
          />
        </Field>
        <Field
          id="dateOfSale"
          label="Date of Sale"
          error={errors.dateOfSale}
          required
        >
          <Input
            id="dateOfSale"
            type="date"
            value={values.dateOfSale}
            onChange={set("dateOfSale")}
          />
        </Field>
        <Field
          id="transactionNo"
          label="Transaction No."
          error={errors.transactionNo}
          required
        >
          <Input
            id="transactionNo"
            value={values.transactionNo}
            onChange={set("transactionNo")}
          />
        </Field>
        <Field
          id="invoiceNo"
          label="Invoice No."
          error={errors.invoiceNo}
          required
        >
          <Input
            id="invoiceNo"
            value={values.invoiceNo}
            onChange={set("invoiceNo")}
          />
        </Field>
        <Field
          id="totalSalesAmount"
          label="Total Sales Amount (AUD)"
          error={errors.totalSalesAmount}
          required
        >
          <Input
            id="totalSalesAmount"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            value={values.totalSalesAmount}
            onChange={set("totalSalesAmount")}
          />
        </Field>
        <Field
          id="amountPaid"
          label="Amount Paid (AUD)"
          error={errors.amountPaid}
          required
        >
          <Input
            id="amountPaid"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            value={values.amountPaid}
            onChange={set("amountPaid")}
          />
        </Field>
        <Field
          id="paymentMethod"
          label="Payment Method"
          error={errors.paymentMethod}
          required
        >
          <Select
            id="paymentMethod"
            value={values.paymentMethod}
            onChange={set("paymentMethod")}
            options={PAYMENT_METHOD_OPTIONS}
            placeholder="Choose payment method"
          />
        </Field>
      </Section>

      <Section number={2} title="Product / Order Status">
        <Field
          id="orderStatus"
          label="Order Status"
          error={errors.orderStatus}
          required
        >
          <Select
            id="orderStatus"
            value={values.orderStatus}
            onChange={set("orderStatus")}
            options={ORDER_STATUS_OPTIONS}
            placeholder="Choose order status"
          />
        </Field>
        <Field
          id="orderNotes"
          label="Notes"
          error={errors.orderNotes}
          fullWidth
        >
          <Textarea
            id="orderNotes"
            rows={2}
            value={values.orderNotes}
            onChange={set("orderNotes")}
            placeholder="Optional notes about the order"
          />
        </Field>
      </Section>

      <Section number={3} title="Refund Reason">
        <Field id="reason" label="Reason" error={errors.reason} required>
          <Select
            id="reason"
            value={values.reason}
            onChange={set("reason")}
            options={REASON_OPTIONS}
            placeholder="Choose reason"
          />
        </Field>
        <Field
          id="explanation"
          label="Explanation"
          error={errors.explanation}
          required
          fullWidth
        >
          <Textarea
            id="explanation"
            rows={3}
            value={values.explanation}
            onChange={set("explanation")}
            placeholder="Brief explanation of the refund"
          />
        </Field>
      </Section>

      <Section number={4} title="Customer Details">
        <Field
          id="customer"
          label="Customer / Company"
          error={errors.customer}
          required
          fullWidth
        >
          <Input
            id="customer"
            value={values.customer}
            onChange={set("customer")}
          />
        </Field>
        <Field id="phone" label="Phone" error={errors.phone} required>
          <Input id="phone" value={values.phone} onChange={set("phone")} />
        </Field>
        <Field id="email" label="Email" error={errors.email} required>
          <Input
            id="email"
            type="email"
            value={values.email}
            onChange={set("email")}
          />
        </Field>
        <Field
          id="address"
          label="Address"
          error={errors.address}
          required
          fullWidth
        >
          <Input
            id="address"
            value={values.address}
            onChange={set("address")}
          />
        </Field>
      </Section>

      <Section number={5} title="Refund Details">
        <Field id="refundMethod" label="Refund Method">
          <Input id="refundMethod" value={REFUND_METHOD} disabled readOnly />
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Refunds are issued by Internet Bank Transfer only.
          </p>
        </Field>
        <Field
          id="refundAmount"
          label="Total Refund Amount (AUD)"
          error={errors.refundAmount}
          required
        >
          <Input
            id="refundAmount"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            value={values.refundAmount}
            onChange={set("refundAmount")}
          />
          {refundOverPaid && !errors.refundAmount && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              Refund amount exceeds amount paid.
            </p>
          )}
        </Field>
      </Section>

      <Section number={6} title="Bank Details (IBT)">
        <Field id="bsb" label="BSB" error={errors.bsb} required>
          <Input
            id="bsb"
            value={values.bsb}
            onChange={set("bsb")}
            placeholder="e.g. 064-000"
          />
        </Field>
        <Field
          id="accountNumber"
          label="Account Number"
          error={errors.accountNumber}
          required
        >
          <Input
            id="accountNumber"
            value={values.accountNumber}
            onChange={set("accountNumber")}
          />
        </Field>
        <Field
          id="accountName"
          label="Account Name"
          error={errors.accountName}
          required
          fullWidth
        >
          <Input
            id="accountName"
            value={values.accountName}
            onChange={set("accountName")}
          />
        </Field>
      </Section>

      <Section number={7} title="Authorisation">
        <Field
          id="salesStaff"
          label="Sales Staff"
          error={errors.salesStaff}
          required
          fullWidth
        >
          <Input
            id="salesStaff"
            value={values.salesStaff}
            onChange={set("salesStaff")}
          />
        </Field>
        <Field
          id="managerApproval"
          label="Manager Approval"
          error={errors.managerApproval}
        >
          <Input
            id="managerApproval"
            value={values.managerApproval}
            onChange={set("managerApproval")}
          />
        </Field>
        <Field
          id="approvalDate"
          label="Approval Date"
          error={errors.approvalDate}
        >
          <Input
            id="approvalDate"
            type="date"
            value={values.approvalDate}
            onChange={set("approvalDate")}
          />
        </Field>
        <Field
          id="approvalStatus"
          label="Approval Status"
          error={errors.approvalStatus}
        >
          <Select
            id="approvalStatus"
            value={values.approvalStatus}
            onChange={set("approvalStatus")}
            options={APPROVAL_STATUS_OPTIONS}
          />
        </Field>
      </Section>

      <Section
        number={8}
        title="Accounting Department Use Only"
        hint="Leave blank if not yet processed."
      >
        <Field
          id="processedBy"
          label="Processed By"
          error={errors.processedBy}
        >
          <Input
            id="processedBy"
            value={values.processedBy}
            onChange={set("processedBy")}
          />
        </Field>
        <Field
          id="dateProcessed"
          label="Date Processed"
          error={errors.dateProcessed}
        >
          <Input
            id="dateProcessed"
            type="date"
            value={values.dateProcessed}
            onChange={set("dateProcessed")}
          />
        </Field>
        <Field
          id="xeroReference"
          label="Xero Reference"
          error={errors.xeroReference}
        >
          <Input
            id="xeroReference"
            value={values.xeroReference}
            onChange={set("xeroReference")}
          />
        </Field>
        <Field
          id="paymentDate"
          label="Payment Date"
          error={errors.paymentDate}
        >
          <Input
            id="paymentDate"
            type="date"
            value={values.paymentDate}
            onChange={set("paymentDate")}
          />
        </Field>
        <Field
          id="trUpdated"
          label="T/R Updated"
          error={errors.trUpdated}
        >
          <Select
            id="trUpdated"
            value={values.trUpdated}
            onChange={set("trUpdated")}
            options={YES_NO_OPTIONS}
            placeholder="—"
          />
        </Field>
        <Field
          id="shopInformed"
          label="Shop Informed"
          error={errors.shopInformed}
        >
          <Select
            id="shopInformed"
            value={values.shopInformed}
            onChange={set("shopInformed")}
            options={YES_NO_OPTIONS}
            placeholder="—"
          />
        </Field>
      </Section>

      <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={reset}
          disabled={submitting}
          className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 bg-white px-5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Reset form
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          {submitting ? "Generating…" : "Generate refund file"}
        </button>
      </div>
    </form>
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
          <span className="text-xs text-zinc-500 dark:text-zinc-400">{hint}</span>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({
  id,
  label,
  error,
  children,
  required,
  fullWidth,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
  required?: boolean;
  fullWidth?: boolean;
}) {
  return (
    <div
      id={`field-${id}`}
      className={fullWidth ? "sm:col-span-2" : undefined}
    >
      <label
        htmlFor={id}
        className="block text-sm font-medium text-zinc-700 dark:text-zinc-200"
      >
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

const baseInputClass =
  "block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition-colors focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 disabled:bg-zinc-50 disabled:text-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-100 dark:focus:ring-zinc-100 dark:disabled:bg-zinc-900";

function Input({
  id,
  value,
  onChange,
  type = "text",
  ...rest
}: {
  id: string;
  value: string;
  onChange?: (v: string) => void;
  type?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return (
    <input
      id={id}
      name={id}
      type={type}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className={baseInputClass}
      {...rest}
    />
  );
}

function Textarea({
  id,
  value,
  onChange,
  ...rest
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
} & Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "value" | "onChange"
>) {
  return (
    <textarea
      id={id}
      name={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={baseInputClass}
      {...rest}
    />
  );
}

function Select({
  id,
  value,
  onChange,
  options,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  placeholder?: string;
}) {
  return (
    <select
      id={id}
      name={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={baseInputClass}
    >
      {placeholder !== undefined && (
        <option value="" disabled={false}>
          {placeholder}
        </option>
      )}
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}
