import { z } from "zod";

export const STORE_OPTIONS = [
  "Toowoomba",
  "Brisbane",
  "Sunshine Coast",
  "Gold Coast",
] as const;

export const PAYMENT_METHOD_OPTIONS = [
  "Cash",
  "EFTPOS",
  "Credit Card",
  "Direct Deposit",
  "Cheque",
  "Other",
] as const;

export const ORDER_STATUS_OPTIONS = [
  "Stock returned",
  "Order not made yet",
  "Order already in production",
  "Order completed",
  "Special order item",
  "Other",
] as const;

export const REASON_OPTIONS = [
  "Customer cancellation",
  "Incorrect product ordered",
  "Product issue",
  "Duplicate payment",
  "Overpayment",
  "Warranty / goodwill",
  "Management approved exception",
  "Other",
] as const;

export const APPROVAL_STATUS_OPTIONS = [
  "Draft",
  "Pending Approval",
  "Approved",
  "Rejected",
  "Paid",
] as const;

export const YES_NO_OPTIONS = ["Yes", "No"] as const;

export const REFUND_METHOD = "Internet Bank Transfer Refund (IBT)" as const;

const nonEmpty = (label: string) => z.string().trim().min(1, `${label} is required`);
const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((v) => v ?? "");
const optionalDate = z
  .string()
  .optional()
  .transform((v) => (v && v.length > 0 ? v : ""));
const amount = (label: string) =>
  z.coerce
    .number({ message: `${label} must be a number` })
    .min(0, `${label} must be zero or greater`);

export const refundSchema = z
  .object({
    // 1. Store & Sales Details
    store: z.enum(STORE_OPTIONS, { message: "Store is required" }),
    dateOfSale: nonEmpty("Date of Sale"),
    transactionNo: nonEmpty("Transaction No."),
    invoiceNo: nonEmpty("Invoice No."),
    totalSalesAmount: amount("Total Sales Amount"),
    amountPaid: amount("Amount Paid"),
    paymentMethod: z.enum(PAYMENT_METHOD_OPTIONS, {
      message: "Payment Method is required",
    }),

    // 2. Product / Order Status
    orderStatus: z.enum(ORDER_STATUS_OPTIONS, {
      message: "Order Status is required",
    }),
    orderNotes: optionalText,

    // 3. Refund Reason
    reason: z.enum(REASON_OPTIONS, { message: "Refund Reason is required" }),
    explanation: nonEmpty("Explanation"),

    // 4. Customer Details
    customer: nonEmpty("Customer / Company"),
    phone: nonEmpty("Phone"),
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Enter a valid email address"),
    address: nonEmpty("Address"),

    // 5. Refund Details (refund method fixed: IBT only)
    refundAmount: amount("Refund Amount"),

    // 6. Bank Details
    bsb: z
      .string()
      .trim()
      .min(1, "BSB is required")
      .refine((v) => /^\d{6}$/.test(v.replace(/[\s-]/g, "")), {
        message: "BSB must be 6 digits (dashes or spaces are OK, e.g. 064-000)",
      }),
    accountNumber: nonEmpty("Account Number"),
    accountName: nonEmpty("Account Name"),

    // 7. Authorisation
    salesStaff: nonEmpty("Sales Staff"),
    managerApproval: optionalText,
    approvalDate: optionalDate,
    approvalStatus: z.enum(APPROVAL_STATUS_OPTIONS).default("Draft"),

    // 8. Accounting Department Use Only — all optional
    processedBy: optionalText,
    dateProcessed: optionalDate,
    xeroReference: optionalText,
    paymentDate: optionalDate,
    trUpdated: z.enum(YES_NO_OPTIONS).optional(),
    shopInformed: z.enum(YES_NO_OPTIONS).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.refundAmount > data.amountPaid) {
      ctx.addIssue({
        code: "custom",
        message: "Refund amount cannot exceed amount paid",
        path: ["refundAmount"],
      });
    }
  });

export type RefundInput = z.infer<typeof refundSchema>;

export type CellType = "text" | "number" | "date";

export const CELL_MAP: Record<
  Exclude<keyof RefundInput, never>,
  { cell: string; type: CellType }
> = {
  store: { cell: "B5", type: "text" },
  dateOfSale: { cell: "F5", type: "date" },
  transactionNo: { cell: "B6", type: "text" },
  invoiceNo: { cell: "E6", type: "text" },
  totalSalesAmount: { cell: "B7", type: "number" },
  amountPaid: { cell: "D7", type: "number" },
  paymentMethod: { cell: "F7", type: "text" },
  orderStatus: { cell: "B9", type: "text" },
  orderNotes: { cell: "B10", type: "text" },
  reason: { cell: "B12", type: "text" },
  explanation: { cell: "B13", type: "text" },
  customer: { cell: "B15", type: "text" },
  phone: { cell: "B16", type: "text" },
  email: { cell: "E16", type: "text" },
  address: { cell: "B17", type: "text" },
  refundAmount: { cell: "E19", type: "number" },
  bsb: { cell: "B22", type: "text" },
  accountNumber: { cell: "D22", type: "text" },
  accountName: { cell: "B23", type: "text" },
  salesStaff: { cell: "B26", type: "text" },
  managerApproval: { cell: "B27", type: "text" },
  approvalDate: { cell: "E27", type: "date" },
  approvalStatus: { cell: "B28", type: "text" },
  processedBy: { cell: "B30", type: "text" },
  dateProcessed: { cell: "E30", type: "date" },
  xeroReference: { cell: "B31", type: "text" },
  paymentDate: { cell: "E31", type: "date" },
  trUpdated: { cell: "B32", type: "text" },
  shopInformed: { cell: "E32", type: "text" },
};
