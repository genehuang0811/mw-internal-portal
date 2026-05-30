import { MWSheet } from "../branding/xlsx-kit";
import type { JobCardData } from "../schemas/job-card";

export async function jobCardXlsx(d: JobCardData): Promise<Buffer> {
  const parts = d.parts.filter((p) => p.description);
  const sheet = new MWSheet("Job Card", "Workshop Job Card", [
    `Order: ${d.orderNumber}`,
    `Job: ${d.jobNumber}`,
  ]);

  sheet
    .heading("Order & Customer")
    .fields([
      ["MW order number", d.orderNumber],
      ["Job number", d.jobNumber],
      ["Customer", d.customer],
      ["Vehicle", d.vehicle],
      ["Installer assigned", d.installer],
      ["Estimated hours", d.estimatedHours],
      ["Start date", d.startDate],
    ])
    .heading("Work Scope")
    .fields([["Work required", d.workRequired]])
    .heading("Parts List");

  if (parts.length > 0) {
    sheet.table(
      ["Part / description", "Qty", "SKU"],
      parts.map((p) => [p.description, p.qty || "—", p.sku || "—"]),
    );
  } else {
    sheet.note("No parts listed.");
  }

  if (d.checklist.length > 0) {
    sheet
      .heading("Installer Checklist")
      .table(
        ["Step", "Done"],
        d.checklist.map((c) => [c.label, c.done ? "Yes" : "No"]),
      );
  }

  sheet
    .heading("Completion Sign-off")
    .fields([
      ["Job completed", d.completed ? "Yes" : "No"],
      ["Completion date", d.completionDate],
      ["Completion notes", d.completionNotes],
    ]);

  return sheet.toBuffer();
}
