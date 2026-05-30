import {
  buildDocx,
  docHeading,
  docFields,
  docSignatures,
  docSpacer,
} from "../branding/docx-kit";
import type { WarrantyData } from "../schemas/warranty";

export async function warrantyDocx(d: WarrantyData): Promise<Buffer> {
  return buildDocx({
    title: "Warranty Claim",
    meta: [`Invoice: ${d.invoiceNumber}`],
    body: [
      docHeading("Customer & Sale"),
      docFields([
        ["Customer name", d.customerName],
        ["Invoice number", d.invoiceNumber],
        ["Purchase date", d.purchaseDate],
        ["Vehicle details", d.vehicleDetails],
      ]),
      docHeading("Claim Details"),
      docFields([
        ["Product affected", d.productAffected],
        ["Issue description", d.issueDescription],
        ["Requested outcome", d.requestedOutcome],
      ]),
      docHeading("Staff & Review"),
      docFields([
        ["Staff member", d.staffMember],
        ["Manager review", d.managerReview],
      ]),
      docSpacer(),
      docSignatures(["Staff signature", "Manager signature"]),
    ],
  });
}
