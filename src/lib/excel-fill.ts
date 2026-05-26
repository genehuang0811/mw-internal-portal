import ExcelJS from "exceljs";
import path from "node:path";
import { CELL_MAP, type RefundInput } from "./schema";

const TEMPLATE_PATH = path.join(
  process.cwd(),
  "public",
  "templates",
  "refund-application-template.xlsx",
);

const SHEET_NAME = "Refund Form";

function parseDate(value: string): Date | null {
  if (!value) return null;
  // Use UTC midnight so the calendar day is preserved regardless of viewer timezone.
  const d = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function generateRefundWorkbook(
  data: RefundInput,
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(TEMPLATE_PATH);

  const ws = workbook.getWorksheet(SHEET_NAME);
  if (!ws) {
    throw new Error(`Template is missing the "${SHEET_NAME}" worksheet`);
  }

  for (const [field, spec] of Object.entries(CELL_MAP) as Array<
    [keyof RefundInput, (typeof CELL_MAP)[keyof RefundInput]]
  >) {
    const raw = data[field];
    if (raw === undefined || raw === null || raw === "") continue;

    const cell = ws.getCell(spec.cell);

    if (spec.type === "date") {
      const d = typeof raw === "string" ? parseDate(raw) : null;
      if (d) cell.value = d;
    } else if (spec.type === "number") {
      const n = typeof raw === "number" ? raw : Number(raw);
      if (!Number.isNaN(n)) cell.value = n;
    } else {
      cell.value = String(raw);
    }
  }

  const out = await workbook.xlsx.writeBuffer();
  return Buffer.from(out);
}

export function buildFilename(data: RefundInput): string {
  const datestr = new Date().toISOString().slice(0, 10);
  const safeCustomer =
    data.customer.replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 40) || "Customer";
  const safeInvoice =
    data.invoiceNo.replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 30) || "Form";
  return `MW-Refund-${safeInvoice}-${safeCustomer}-${datestr}.xlsx`;
}
