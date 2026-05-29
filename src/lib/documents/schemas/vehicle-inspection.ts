import { z } from "zod";
import { req, opt, yesNo, csv } from "./_shared";

/** Optional base64 image (data URL) captured client-side. */
const imageOpt = z
  .string()
  .optional()
  .transform((v) => v ?? "");

export const vehicleInspectionSchema = z.object({
  customer: req("Customer name"),
  rego: req("Vehicle rego"),
  makeModel: req("Vehicle make / model"),
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
  photoLeft: imageOpt,
  photoRight: imageOpt,
  photoDash: imageOpt,
  photoOther: imageOpt,
  damageDiagram: imageOpt,
  customerSignature: imageOpt,
  staffSignature: imageOpt,
});

export type VehicleInspectionData = z.infer<typeof vehicleInspectionSchema>;
