import { z } from "zod";
import { req, opt } from "./_shared";

export const warrantySchema = z.object({
  customerName: req("Customer name"),
  invoiceNumber: req("Invoice number"),
  purchaseDate: opt,
  vehicleDetails: opt,
  productAffected: req("Product affected"),
  issueDescription: req("Issue description"),
  requestedOutcome: req("Requested outcome"),
  staffMember: req("Staff member"),
  managerReview: opt,
});

export type WarrantyData = z.infer<typeof warrantySchema>;
