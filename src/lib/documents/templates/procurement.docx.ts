import {
  buildDocx,
  docHeading,
  docFields,
  docNote,
  type DocxBlock,
} from "../branding/docx-kit";
import {
  currentStatuses,
  isReimbursement,
  money,
  PROCUREMENT_STATUSES,
  type ProcurementData,
} from "../schemas/procurement";

export async function procurementDocx(d: ProcurementData): Promise<Buffer> {
  const reimbursement = isReimbursement(d.requestType);
  const statuses = currentStatuses(d.requestType);

  const body: DocxBlock[] = [
    docHeading("Request"),
    docFields([
      ["Request type", d.requestType],
      ["Request number", d.requestNumber],
      ["Request title", d.requestTitle],
      ["Category", d.category],
      ["Priority", d.priority],
      ["Date requested", d.dateRequested],
      ["Required by", d.requiredByDate],
      ["Estimated cost", money(d.estimatedCost)],
    ]),
    docHeading("Requester"),
    docFields([
      ["Staff name", d.staffName],
      ["Branch", d.branch],
      ["Department", d.department],
    ]),
    docHeading("Details"),
    docFields([
      ["Item description", d.itemDescription],
      ["Business justification", d.businessJustification],
    ]),
    docHeading("Supplier"),
    docFields([
      ["Supplier name", d.supplierName],
      ["Supplier website / link", d.supplierLink],
    ]),
  ];

  if (reimbursement) {
    body.push(docHeading("Staff Purchase & Reimbursement Details"));
    body.push(
      docFields([
        ["Reason self-purchase is required", d.reasonSelfPurchase],
        ["Purchase date", d.purchaseDate],
        ["Amount paid", money(d.amountPaid)],
        ["Receipt filename / reference", d.receiptRef],
        ["Tax invoice filename / reference", d.taxInvoiceRef],
        ["Proof of payment filename / reference", d.proofOfPaymentRef],
        ["Manager notes", d.managerNotes],
      ]),
    );
  } else {
    body.push(docHeading("Procurement Purchase Details"));
    body.push(
      docFields([
        ["Preferred supplier", d.preferredSupplier],
        ["Quote filename / reference", d.quoteRef],
        ["Supporting documents reference", d.supportingDocsRef],
        ["Procurement notes", d.procurementNotes],
      ]),
    );
    body.push(
      docNote(
        "File uploads are not attached in this version — references above are recorded for follow-up.",
      ),
    );
  }

  body.push(docHeading("Approval Status"));
  body.push(docFields([["Current status", statuses.join("  ·  ")]]));
  body.push(docNote(`Workflow: ${PROCUREMENT_STATUSES.join(" → ")}.`));

  if (d.additionalNotes) {
    body.push(docHeading("Notes"));
    body.push(docFields([["Additional notes", d.additionalNotes]]));
  }

  return buildDocx({
    title: "Procurement & Reimbursement Request",
    meta: [`Ref: ${d.requestNumber}`, d.requestType],
    body,
  });
}
