import { MWSheet } from "../branding/xlsx-kit";
import type { WarrantyData } from "../schemas/warranty";

export async function warrantyXlsx(d: WarrantyData): Promise<Buffer> {
  const sheet = new MWSheet("Warranty Claim", "Warranty Claim", [
    `Invoice: ${d.invoiceNumber}`,
  ]);
  sheet
    .heading("Customer & Sale")
    .fields([
      ["Customer name", d.customerName],
      ["Invoice number", d.invoiceNumber],
      ["Purchase date", d.purchaseDate],
      ["Vehicle details", d.vehicleDetails],
    ])
    .heading("Claim Details")
    .fields([
      ["Product affected", d.productAffected],
      ["Issue description", d.issueDescription],
      ["Requested outcome", d.requestedOutcome],
    ])
    .heading("Staff & Review")
    .fields([
      ["Staff member", d.staffMember],
      ["Manager review", d.managerReview],
    ]);
  return sheet.toBuffer();
}
