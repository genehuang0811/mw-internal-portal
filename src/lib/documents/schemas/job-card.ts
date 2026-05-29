import { z } from "zod";
import { req, opt } from "./_shared";

export const jobCardSchema = z.object({
  jobNumber: req("Job number"),
  customer: req("Customer"),
  vehicle: req("Vehicle"),
  workRequired: req("Work required"),
  partsRequired: opt,
  installer: req("Installer assigned"),
  estimatedHours: req("Estimated hours"),
  startDate: req("Start date"),
  completionNotes: opt,
});

export type JobCardData = z.infer<typeof jobCardSchema>;
