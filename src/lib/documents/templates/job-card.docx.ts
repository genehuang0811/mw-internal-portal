import {
  buildDocx,
  docHeading,
  docFields,
  docTable,
  docSignatures,
  docNote,
  docSpacer,
  type DocxBlock,
} from "../branding/docx-kit";
import type { JobCardData } from "../schemas/job-card";

export async function jobCardDocx(d: JobCardData): Promise<Buffer> {
  const parts = d.parts.filter((p) => p.description);

  const body: DocxBlock[] = [
    docHeading("Order & Customer"),
    docFields([
      ["MW order number", d.orderNumber],
      ["Job number", d.jobNumber],
      ["Customer", d.customer],
      ["Vehicle", d.vehicle],
      ["Installer assigned", d.installer],
      ["Estimated hours", d.estimatedHours],
      ["Start date", d.startDate],
    ]),
    docHeading("Work Scope"),
    docFields([["Work required", d.workRequired]]),
    docHeading("Parts List"),
    parts.length > 0
      ? docTable(
          ["Part / description", "Qty", "SKU"],
          parts.map((p) => [p.description, p.qty || "—", p.sku || "—"]),
        )
      : docNote("No parts listed."),
  ];

  if (d.checklist.length > 0) {
    body.push(docHeading("Installer Checklist"));
    body.push(
      docTable(
        ["Step", "Done"],
        d.checklist.map((c) => [c.label, c.done ? "Yes" : "No"]),
      ),
    );
  }

  body.push(docHeading("Completion Sign-off"));
  body.push(
    docFields([
      ["Job completed", d.completed ? "Yes" : "No"],
      ["Completion date", d.completionDate],
      ["Completion notes", d.completionNotes],
    ]),
  );
  body.push(docSpacer());
  body.push(docSignatures(["Installer signature"]));

  return buildDocx({
    title: "Workshop Job Card",
    meta: [`Order: ${d.orderNumber}`, `Job: ${d.jobNumber}`],
    body,
  });
}
