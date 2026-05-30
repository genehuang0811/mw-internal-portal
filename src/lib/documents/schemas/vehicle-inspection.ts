import { z } from "zod";
import { req, opt, yesNo, csv } from "./_shared";

/** Optional base64 image (data URL) captured client-side. */
const imageOpt = z
  .string()
  .optional()
  .transform((v) => v ?? "");

export const vehicleInspectionSchema = z.object({
  customer: req("Customer name"),
  rego: req("Vehicle registration"),
  make: req("Vehicle make"),
  model: req("Vehicle model"),
  odometer: req("Odometer"),
  fuelLevel: req("Fuel level"),
  dropOffAt: req("Drop-off date / time"),
  existingDamage: req("Existing damage notes"),
  blisDisclaimer: yesNo,
  belongings: csv,
  staffMember: req("Staff member"),
  notes: opt,

  // Captured media (data URLs) — embedded into the PDF, no external storage.
  photoFront: imageOpt,
  photoRear: imageOpt,
  photoDriver: imageOpt,
  photoPassenger: imageOpt,
  photoRoof: imageOpt,
  photoTray: imageOpt,
  photoCanopy: imageOpt,
  photoInterior: imageOpt,
  damageDiagram: imageOpt,
  customerSignature: imageOpt,
  staffSignature: imageOpt,
});

export type VehicleInspectionData = z.infer<typeof vehicleInspectionSchema>;
