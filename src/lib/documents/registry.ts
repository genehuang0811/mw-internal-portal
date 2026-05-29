import { pdfDocument } from "./renderers/react-pdf";
import { buildFilename } from "./filenames";
import type { DocumentDefinition } from "./types";

import { vehicleInspectionSchema } from "./schemas/vehicle-inspection";
import { warrantySchema } from "./schemas/warranty";
import { annualLeaveSchema } from "./schemas/annual-leave";
import { insuranceSchema } from "./schemas/insurance";
import { jobCardSchema } from "./schemas/job-card";

import { VehicleInspectionTemplate } from "./templates/vehicle-inspection";
import { WarrantyTemplate } from "./templates/warranty";
import { AnnualLeaveTemplate } from "./templates/annual-leave";
import { InsuranceTemplate } from "./templates/insurance";
import { JobCardTemplate } from "./templates/job-card";

/**
 * The single source of truth for document types. To add a document: create a
 * schema + template, then register it here. The engine and route never change.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DOCUMENTS: Record<string, DocumentDefinition<any, any>> = {
  "vehicle-inspection": pdfDocument({
    slug: "vehicle-inspection",
    title: "Vehicle Drop-Off Inspection",
    schema: vehicleInspectionSchema,
    Template: VehicleInspectionTemplate,
    buildFilename: (d) =>
      buildFilename("Vehicle-Inspection", [d.rego, d.customer]),
  }),

  warranty: pdfDocument({
    slug: "warranty",
    title: "Warranty Claim",
    schema: warrantySchema,
    Template: WarrantyTemplate,
    buildFilename: (d) =>
      buildFilename("Warranty", [d.invoiceNumber, d.customerName]),
  }),

  "annual-leave": pdfDocument({
    slug: "annual-leave",
    title: "Annual Leave Request",
    schema: annualLeaveSchema,
    Template: AnnualLeaveTemplate,
    buildFilename: (d) => buildFilename("Annual-Leave", [d.employeeName]),
  }),

  insurance: pdfDocument({
    slug: "insurance",
    title: "Insurance Claim",
    schema: insuranceSchema,
    Template: InsuranceTemplate,
    buildFilename: (d) =>
      buildFilename("Insurance", [d.claimNumber, d.customerName]),
  }),

  "job-card": pdfDocument({
    slug: "job-card",
    title: "Workshop Job Card",
    schema: jobCardSchema,
    Template: JobCardTemplate,
    buildFilename: (d) => buildFilename("Job-Card", [d.jobNumber, d.customer]),
  }),
};
