import { z } from "zod";
import { req, opt } from "./_shared";

export const REQUEST_TYPES = [
  "Procurement Purchase",
  "Staff Purchase & Reimbursement",
] as const;

/** The reimbursement request type — used to gate Section 6B requirements. */
export const REIMBURSEMENT = "Staff Purchase & Reimbursement";

export const PROC_BRANCHES = [
  "Brisbane",
  "Toowoomba",
  "Sunshine Coast",
  "Gold Coast",
] as const;

export const DEPARTMENTS = [
  "Sales",
  "Installation",
  "Workshop",
  "Accounts",
  "Management",
  "Marketing",
  "Warehouse",
] as const;

export const CATEGORIES = [
  "Tools & Equipment",
  "Workshop Consumables",
  "PPE",
  "Vehicle Parts",
  "Office Supplies",
  "Marketing",
  "IT & Technology",
  "Software",
  "Training",
  "Travel",
  "Other",
] as const;

export const PRIORITIES = ["Low", "Normal", "High", "Urgent"] as const;

/** Approval workflow statuses (data structure only — no workflow built yet). */
export const PROCUREMENT_STATUSES = [
  "Submitted",
  "Pending Manager Approval",
  "Approved",
  "Rejected",
  "Processed",
  "Completed",
] as const;

export const procurementSchema = z
  .object({
    requestNumber: req("Request number"),
    requestType: req("Request type"),

    // Section 2 — Requester
    staffName: req("Staff name"),
    branch: req("Branch"),
    department: req("Department"),
    dateRequested: req("Date requested"),

    // Section 3 — Request details
    requestTitle: req("Request title"),
    itemDescription: req("Item description"),
    businessJustification: req("Business justification"),
    requiredByDate: req("Required-by date"),
    estimatedCost: req("Estimated cost"),
    supplierName: opt,
    supplierLink: opt,
    additionalNotes: opt,

    // Sections 4 & 5
    category: req("Category"),
    priority: req("Priority"),

    // Section 6A — Procurement Purchase (all optional)
    preferredSupplier: opt,
    quoteRef: opt,
    supportingDocsRef: opt,
    procurementNotes: opt,

    // Section 6B — Staff Purchase & Reimbursement (required when reimbursement)
    reasonSelfPurchase: opt,
    purchaseDate: opt,
    amountPaid: opt,
    receiptRef: opt,
    taxInvoiceRef: opt,
    proofOfPaymentRef: opt,
    managerNotes: opt,
  })
  .superRefine((d, ctx) => {
    if (d.requestType !== REIMBURSEMENT) return;
    const required: Array<[string, string]> = [
      ["reasonSelfPurchase", "Reason self-purchase is required"],
      ["purchaseDate", "Purchase date is required"],
      ["amountPaid", "Amount paid is required"],
      ["receiptRef", "Receipt filename / reference is required"],
      ["taxInvoiceRef", "Tax invoice filename / reference is required"],
      ["proofOfPaymentRef", "Proof of payment filename / reference is required"],
    ];
    const data = d as Record<string, string>;
    for (const [key, message] of required) {
      if (!String(data[key] ?? "").trim()) {
        ctx.addIssue({ code: "custom", message, path: [key] });
      }
    }
  });

export type ProcurementData = z.infer<typeof procurementSchema>;

export function isReimbursement(requestType: string): boolean {
  return requestType === REIMBURSEMENT;
}

/** Statuses shown for a new submission (data structure only). */
export function currentStatuses(requestType: string): string[] {
  return isReimbursement(requestType)
    ? ["Submitted", "Pending Manager Approval"]
    : ["Submitted"];
}

/** A readable request reference, e.g. MW-PR-20260530-1842 (local time). */
export function generateRequestNumber(date: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const ymd = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
  const hhmm = `${pad(date.getHours())}${pad(date.getMinutes())}`;
  return `MW-PR-${ymd}-${hhmm}`;
}

/** Format a numeric string as AUD currency; passes through non-numbers. */
export function money(v: string): string {
  if (!v) return "";
  const n = Number(String(v).replace(/[^0-9.\-]/g, ""));
  return Number.isNaN(n)
    ? v
    : `$${n.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
