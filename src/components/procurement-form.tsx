"use client";

import { useEffect, useState } from "react";
import {
  Section,
  Field,
  Input,
  Textarea,
  Select,
  Buttons,
  NoticeBanner,
  validateForm,
  scrollToFirstError,
  type Notice,
} from "./capture/form-ui";
import { submitDocument, sentMessage } from "@/lib/submit-document";
import {
  procurementSchema,
  generateRequestNumber,
  REQUEST_TYPES,
  REIMBURSEMENT,
  PROC_BRANCHES,
  DEPARTMENTS,
  CATEGORIES,
  PRIORITIES,
} from "@/lib/documents/schemas/procurement";

const REQUEST_TYPE_DESCRIPTIONS: Record<string, string> = {
  "Procurement Purchase":
    "MW procurement purchases the item on behalf of the staff member.",
  "Staff Purchase & Reimbursement":
    "Staff member requests approval to purchase personally or claims reimbursement for an approved work-related expense.",
};

const EMPTY = {
  requestType: "",
  staffName: "",
  branch: "",
  department: "",
  dateRequested: "",
  requestTitle: "",
  itemDescription: "",
  businessJustification: "",
  requiredByDate: "",
  estimatedCost: "",
  supplierName: "",
  supplierLink: "",
  additionalNotes: "",
  category: "",
  priority: "",
  // 6A — Procurement Purchase
  preferredSupplier: "",
  quoteRef: "",
  supportingDocsRef: "",
  procurementNotes: "",
  // 6B — Staff Purchase & Reimbursement
  reasonSelfPurchase: "",
  purchaseDate: "",
  amountPaid: "",
  receiptRef: "",
  taxInvoiceRef: "",
  proofOfPaymentRef: "",
  managerNotes: "",
};

function todayISO(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function ProcurementForm() {
  const [v, setV] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Default the request date to today. Done on mount (not in the initializer)
  // so server and first client render agree (avoids hydration mismatch).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setV((s) => (s.dateRequested ? s : { ...s, dateRequested: todayISO() }));
  }, []);

  const set = (k: keyof typeof EMPTY) => (val: string) => {
    setV((s) => ({ ...s, [k]: val }));
    if (errors[k]) {
      setErrors((e) => {
        const rest = { ...e };
        delete rest[k];
        return rest;
      });
    }
  };

  const reimbursement = v.requestType === REIMBURSEMENT;

  function reset() {
    setV({ ...EMPTY, dateRequested: todayISO() });
    setNotice(null);
    setErrors({});
  }

  async function onGenerate() {
    setNotice(null);
    const payload = { ...v, requestNumber: generateRequestNumber() };
    const result = validateForm(procurementSchema, payload);
    if (!result.ok) {
      setErrors(result.errors);
      setNotice({
        kind: "error",
        message: "Please fix the highlighted fields and try again.",
      });
      scrollToFirstError(result.errors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const sent = await submitDocument("procurement", payload);
      setNotice(
        sent.ok
          ? { kind: "success", message: sentMessage(sent) }
          : { kind: "error", message: sent.error },
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form noValidate onSubmit={(e) => e.preventDefault()} className="space-y-6">
      <NoticeBanner notice={notice} />

      <Section number={1} title="Request Type">
        <div id="field-requestType" className="sm:col-span-2">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {REQUEST_TYPES.map((rt) => {
              const selected = v.requestType === rt;
              return (
                <label
                  key={rt}
                  className={
                    "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors " +
                    (selected
                      ? "border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900 dark:border-zinc-100 dark:bg-zinc-800/60 dark:ring-zinc-100"
                      : "border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/50")
                  }
                >
                  <input
                    type="radio"
                    name="requestType"
                    checked={selected}
                    onChange={() => set("requestType")(rt)}
                    className="mt-0.5 h-4 w-4 border-zinc-300 text-zinc-900 focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-950"
                  />
                  <span>
                    <span className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {rt}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                      {REQUEST_TYPE_DESCRIPTIONS[rt]}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
          {errors.requestType && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {errors.requestType}
            </p>
          )}
        </div>
      </Section>

      <Section number={2} title="Requester Details">
        <Field id="staffName" label="Staff name" required full error={errors.staffName}>
          <Input value={v.staffName} onChange={set("staffName")} placeholder="e.g. Sarah Lee" />
        </Field>
        <Field id="branch" label="Branch" required error={errors.branch}>
          <Select value={v.branch} onChange={set("branch")} options={[...PROC_BRANCHES]} />
        </Field>
        <Field id="department" label="Department" required error={errors.department}>
          <Select value={v.department} onChange={set("department")} options={[...DEPARTMENTS]} />
        </Field>
        <Field id="dateRequested" label="Date requested" required error={errors.dateRequested}>
          <Input value={v.dateRequested} onChange={set("dateRequested")} type="date" />
        </Field>
      </Section>

      <Section number={3} title="Request Details">
        <Field id="requestTitle" label="Request title" required full error={errors.requestTitle}>
          <Input value={v.requestTitle} onChange={set("requestTitle")} placeholder="Short summary of the request" />
        </Field>
        <Field id="itemDescription" label="Item description" required full error={errors.itemDescription}>
          <Textarea
            value={v.itemDescription}
            onChange={set("itemDescription")}
            placeholder="What is being purchased? Include make/model, quantity, specs."
          />
        </Field>
        <Field
          id="businessJustification"
          label="Business justification"
          required
          full
          error={errors.businessJustification}
        >
          <Textarea
            value={v.businessJustification}
            onChange={set("businessJustification")}
            placeholder="Why is this needed for the business?"
          />
        </Field>
        <Field id="requiredByDate" label="Required by date" required error={errors.requiredByDate}>
          <Input value={v.requiredByDate} onChange={set("requiredByDate")} type="date" />
        </Field>
        <Field id="estimatedCost" label="Estimated cost (AUD)" required error={errors.estimatedCost}>
          <Input value={v.estimatedCost} onChange={set("estimatedCost")} type="number" />
        </Field>
        <Field id="supplierName" label="Supplier name" error={errors.supplierName}>
          <Input value={v.supplierName} onChange={set("supplierName")} />
        </Field>
        <Field id="supplierLink" label="Supplier website / link" error={errors.supplierLink}>
          <Input value={v.supplierLink} onChange={set("supplierLink")} placeholder="https://" />
        </Field>
        <Field id="additionalNotes" label="Additional notes" full error={errors.additionalNotes}>
          <Textarea value={v.additionalNotes} onChange={set("additionalNotes")} />
        </Field>
      </Section>

      <Section number={4} title="Category & Priority">
        <Field id="category" label="Category" required error={errors.category}>
          <Select value={v.category} onChange={set("category")} options={[...CATEGORIES]} />
        </Field>
        <Field id="priority" label="Priority" required error={errors.priority}>
          <Select value={v.priority} onChange={set("priority")} options={[...PRIORITIES]} />
        </Field>
      </Section>

      {v.requestType === "" ? (
        <p className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-6 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-400">
          Choose a request type above to see the remaining details.
        </p>
      ) : reimbursement ? (
        <Section number={5} title="Staff Purchase & Reimbursement Details">
          <Field
            id="reasonSelfPurchase"
            label="Reason self-purchase is required"
            required
            full
            error={errors.reasonSelfPurchase}
          >
            <Textarea
              value={v.reasonSelfPurchase}
              onChange={set("reasonSelfPurchase")}
              placeholder="Why was a personal purchase necessary?"
            />
          </Field>
          <Field id="purchaseDate" label="Purchase date" required error={errors.purchaseDate}>
            <Input value={v.purchaseDate} onChange={set("purchaseDate")} type="date" />
          </Field>
          <Field id="amountPaid" label="Amount paid (AUD)" required error={errors.amountPaid}>
            <Input value={v.amountPaid} onChange={set("amountPaid")} type="number" />
          </Field>
          <Field id="receiptRef" label="Receipt filename / reference" required error={errors.receiptRef}>
            <Input value={v.receiptRef} onChange={set("receiptRef")} placeholder="e.g. receipt-bunnings-0530.pdf" />
          </Field>
          <Field id="taxInvoiceRef" label="Tax invoice filename / reference" required error={errors.taxInvoiceRef}>
            <Input value={v.taxInvoiceRef} onChange={set("taxInvoiceRef")} placeholder="e.g. tax-invoice-1234.pdf" />
          </Field>
          <Field
            id="proofOfPaymentRef"
            label="Proof of payment filename / reference"
            required
            full
            error={errors.proofOfPaymentRef}
          >
            <Input
              value={v.proofOfPaymentRef}
              onChange={set("proofOfPaymentRef")}
              placeholder="e.g. bank-statement-0530.pdf"
            />
          </Field>
          <Field id="managerNotes" label="Manager notes" full error={errors.managerNotes}>
            <Textarea value={v.managerNotes} onChange={set("managerNotes")} />
          </Field>
          <p className="sm:col-span-2 text-xs text-zinc-500 dark:text-zinc-400">
            File uploads aren&apos;t attached yet — enter a filename or reference
            for each document so Accounts can match them. A future version may
            attach the files to the email.
          </p>
        </Section>
      ) : (
        <Section number={5} title="Procurement Purchase Details">
          <Field id="preferredSupplier" label="Preferred supplier" error={errors.preferredSupplier}>
            <Input value={v.preferredSupplier} onChange={set("preferredSupplier")} />
          </Field>
          <Field id="quoteRef" label="Quote filename / reference" error={errors.quoteRef}>
            <Input value={v.quoteRef} onChange={set("quoteRef")} placeholder="e.g. quote-supplier-0530.pdf" />
          </Field>
          <Field
            id="supportingDocsRef"
            label="Supporting documents reference"
            full
            error={errors.supportingDocsRef}
          >
            <Input value={v.supportingDocsRef} onChange={set("supportingDocsRef")} />
          </Field>
          <Field id="procurementNotes" label="Procurement notes" full error={errors.procurementNotes}>
            <Textarea value={v.procurementNotes} onChange={set("procurementNotes")} />
          </Field>
          <p className="sm:col-span-2 text-xs text-zinc-500 dark:text-zinc-400">
            File uploads aren&apos;t attached yet — enter a filename or reference
            for any quote or supporting documents. A future version may attach
            the files to the email.
          </p>
        </Section>
      )}

      <Buttons
        submitting={submitting}
        onReset={reset}
        onGenerate={onGenerate}
        label={reimbursement ? "Send reimbursement request" : "Send procurement request"}
      />
    </form>
  );
}
