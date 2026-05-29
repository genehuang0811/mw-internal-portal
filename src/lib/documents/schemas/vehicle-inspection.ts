import { z } from "zod";
import { req, opt, yesNo, csv } from "./_shared";

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
});

export type VehicleInspectionData = z.infer<typeof vehicleInspectionSchema>;
