import { defineDocument } from "./define";
import { buildBaseName } from "./filenames";
import { recipientsFor } from "./recipients";
import type { DocumentDefinition } from "./types";

import { vehicleInspectionSchema } from "./schemas/vehicle-inspection";
import { warrantySchema } from "./schemas/warranty";
import { annualLeaveSchema } from "./schemas/annual-leave";
import { insuranceSchema } from "./schemas/insurance";
import { jobCardSchema } from "./schemas/job-card";
import { anonymousFeedbackSchema } from "./schemas/anonymous-feedback";
import {
  procurementSchema,
  isReimbursement,
  money,
  currentStatuses,
} from "./schemas/procurement";

import { VehicleInspectionTemplate } from "./templates/vehicle-inspection";
import { WarrantyTemplate } from "./templates/warranty";
import { AnnualLeaveTemplate } from "./templates/annual-leave";
import { InsuranceTemplate } from "./templates/insurance";
import { JobCardTemplate } from "./templates/job-card";
import { AnonymousFeedbackTemplate } from "./templates/anonymous-feedback";

import { warrantyDocx } from "./templates/warranty.docx";
import { warrantyXlsx } from "./templates/warranty.xlsx";
import { annualLeaveDocx } from "./templates/annual-leave.docx";
import { jobCardDocx } from "./templates/job-card.docx";
import { jobCardXlsx } from "./templates/job-card.xlsx";
import { anonymousFeedbackDocx } from "./templates/anonymous-feedback.docx";
import { ProcurementTemplate } from "./templates/procurement";
import { procurementDocx } from "./templates/procurement.docx";
import { procurementXlsx } from "./templates/procurement.xlsx";

import { leaveDays } from "./schemas/annual-leave";

/**
 * The single source of truth for document types. To add a document: create a
 * schema + templates, then register it here. The engine and routes never change.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DOCUMENTS: Record<string, DocumentDefinition<any, any>> = {
  "vehicle-inspection": defineDocument({
    slug: "vehicle-inspection",
    title: "Vehicle Drop-Off Inspection",
    schema: vehicleInspectionSchema,
    recipients: recipientsFor("vehicle-inspection"),
    buildBaseName: (d) => buildBaseName("Vehicle-Inspection", [d.rego, d.customer]),
    emailSubject: (d) =>
      `Vehicle Drop-Off Inspection — ${d.rego} (${d.customer})`,
    emailSummary: (d) =>
      `Customer: ${d.customer}\nVehicle: ${d.rego} — ${d.make} ${d.model}\nOdometer: ${d.odometer} km\nDrop-off: ${d.dropOffAt.replace("T", " ")}\nStaff: ${d.staffMember}`,
    pdf: (d) => <VehicleInspectionTemplate data={d} />,
  }),

  warranty: defineDocument({
    slug: "warranty",
    title: "Warranty Claim",
    schema: warrantySchema,
    recipients: recipientsFor("warranty"),
    buildBaseName: (d) => buildBaseName("Warranty", [d.invoiceNumber, d.customerName]),
    emailSubject: (d) => `Warranty Claim — ${d.invoiceNumber} (${d.customerName})`,
    emailSummary: (d) =>
      `Customer: ${d.customerName}\nInvoice: ${d.invoiceNumber}\nProduct: ${d.productAffected}\nRequested outcome: ${d.requestedOutcome}\nLogged by: ${d.staffMember}`,
    pdf: (d) => <WarrantyTemplate data={d} />,
    docx: warrantyDocx,
    xlsx: warrantyXlsx,
  }),

  "annual-leave": defineDocument({
    slug: "annual-leave",
    title: "Annual Leave Request",
    schema: annualLeaveSchema,
    recipients: recipientsFor("annual-leave"),
    buildBaseName: (d) => buildBaseName("Annual-Leave", [d.employeeName]),
    emailSubject: (d) => `Annual Leave Request — ${d.employeeName}`,
    emailSummary: (d) => {
      const days = leaveDays(d.startDate, d.endDate);
      return `Employee: ${d.employeeName}\nLeave type: ${d.leaveType}\nDates: ${d.startDate} → ${d.endDate}${days !== null ? ` (${days} ${days === 1 ? "day" : "days"})` : ""}\nManager: ${d.manager}`;
    },
    pdf: (d) => <AnnualLeaveTemplate data={d} />,
    docx: annualLeaveDocx,
  }),

  "job-card": defineDocument({
    slug: "job-card",
    title: "Workshop Job Card",
    schema: jobCardSchema,
    recipients: recipientsFor("job-card"),
    buildBaseName: (d) => buildBaseName("Job-Card", [d.jobNumber, d.customer]),
    emailSubject: (d) => `Workshop Job Card — ${d.jobNumber} (${d.customer})`,
    emailSummary: (d) =>
      `Order: ${d.orderNumber}   Job: ${d.jobNumber}\nCustomer: ${d.customer}\nVehicle: ${d.vehicle}\nInstaller: ${d.installer}\nStart: ${d.startDate}${d.completed ? "   ·   Completed" : ""}`,
    pdf: (d) => <JobCardTemplate data={d} />,
    docx: jobCardDocx,
    xlsx: jobCardXlsx,
  }),

  "anonymous-feedback": defineDocument({
    slug: "anonymous-feedback",
    title: "Anonymous Complaint / Feedback",
    schema: anonymousFeedbackSchema,
    recipients: recipientsFor("anonymous-feedback"),
    buildBaseName: (d) => buildBaseName("Feedback", [d.submissionType, d.branch]),
    emailSubject: (d) =>
      `Anonymous ${d.submissionType} — ${d.branch} (${d.urgency} urgency)`,
    emailSummary: (d) =>
      `Type: ${d.submissionType}\nBranch: ${d.branch}\nUrgency: ${d.urgency}\nFrom: ${d.contactName ? d.contactName : "Anonymous"}`,
    pdf: (d) => <AnonymousFeedbackTemplate data={d} />,
    docx: anonymousFeedbackDocx,
  }),

  procurement: defineDocument({
    slug: "procurement",
    title: "Procurement & Reimbursement Request",
    schema: procurementSchema,
    recipients: recipientsFor("procurement"),
    buildBaseName: (d) =>
      buildBaseName("Procurement", [
        d.requestNumber.replace(/^MW-/, ""),
        d.staffName,
      ]),
    emailSubject: (d) =>
      isReimbursement(d.requestType)
        ? `Reimbursement Request — ${d.staffName} — ${money(d.amountPaid)}`
        : `Procurement Request — ${d.requestTitle} — ${d.branch}`,
    emailSummary: (d) => {
      const costLine = isReimbursement(d.requestType)
        ? `Amount paid: ${money(d.amountPaid)}`
        : `Estimated cost: ${money(d.estimatedCost)}`;
      return [
        `Request: ${d.requestNumber}`,
        `Type: ${d.requestType}`,
        `Requester: ${d.staffName} — ${d.branch} / ${d.department}`,
        `Category: ${d.category}   Priority: ${d.priority}`,
        costLine,
        `Required by: ${d.requiredByDate}`,
        `Approval status: ${currentStatuses(d.requestType).join(" · ")}`,
      ].join("\n");
    },
    pdf: (d) => <ProcurementTemplate data={d} />,
    docx: procurementDocx,
    xlsx: procurementXlsx,
  }),

  // Insurance stays a demo download (PDF only) via the legacy generate route.
  insurance: defineDocument({
    slug: "insurance",
    title: "Insurance Claim",
    schema: insuranceSchema,
    recipients: recipientsFor("insurance"),
    buildBaseName: (d) => buildBaseName("Insurance", [d.claimNumber, d.customerName]),
    emailSubject: (d) => `Insurance Claim — ${d.claimNumber} (${d.customerName})`,
    pdf: (d) => <InsuranceTemplate data={d} />,
  }),
};
