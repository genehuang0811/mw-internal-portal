import { z } from "zod";
import { req, opt } from "./_shared";

const part = z.object({
  description: z.string().trim().min(1),
  qty: opt,
  sku: opt,
});

const checklistItem = z.object({
  label: z.string(),
  done: z.boolean(),
});

const imageOpt = z
  .string()
  .optional()
  .transform((v) => v ?? "");

export const jobCardSchema = z.object({
  orderNumber: req("MW order number"),
  jobNumber: req("Job number"),
  customer: req("Customer"),
  vehicle: req("Vehicle"),
  workRequired: req("Work required"),
  installer: req("Installer assigned"),
  estimatedHours: opt,
  startDate: req("Start date"),

  parts: z.array(part).optional().default([]),
  checklist: z.array(checklistItem).optional().default([]),

  completed: z.boolean().optional().default(false),
  completionDate: opt,
  completionNotes: opt,
  installerSignature: imageOpt,
});

export type JobCardData = z.infer<typeof jobCardSchema>;
