import { z } from "zod";
import { req, opt } from "./_shared";

export const insuranceSchema = z.object({
  claimNumber: req("Claim number"),
  insurer: req("Insurer"),
  customerName: req("Customer name"),
  vehicleDetails: req("Vehicle details"),
  damageDescription: req("Damage description"),
  assessorName: opt,
  assessorContact: opt,
  excessAmount: req("Excess amount"),
  approvedRepairAmount: opt,
  notes: opt,
});

export type InsuranceData = z.infer<typeof insuranceSchema>;
