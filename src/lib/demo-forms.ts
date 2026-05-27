export type DemoFieldType =
  | "text"
  | "email"
  | "tel"
  | "textarea"
  | "date"
  | "datetime-local"
  | "number"
  | "select"
  | "note";

export type DemoField = {
  id: string;
  label: string;
  type: DemoFieldType;
  required?: boolean;
  fullWidth?: boolean;
  placeholder?: string;
  options?: readonly string[];
  /** For type="note": the body text shown in place of an input. */
  body?: string;
};

export type DemoSection = {
  title: string;
  hint?: string;
  fields: DemoField[];
};

export type DemoFormConfig = {
  submitLabel: string;
  sections: DemoSection[];
};

const STAFF_PLACEHOLDER = "e.g. Sarah Lee";
const MANAGER_PLACEHOLDER = "e.g. Tom Nguyen";

export const DEMO_FORMS: Record<string, DemoFormConfig> = {
  warranty: {
    submitLabel: "Generate warranty claim",
    sections: [
      {
        title: "Customer & Sale",
        fields: [
          {
            id: "customerName",
            label: "Customer name",
            type: "text",
            required: true,
            fullWidth: true,
          },
          {
            id: "invoiceNumber",
            label: "Invoice number",
            type: "text",
            required: true,
          },
          {
            id: "purchaseDate",
            label: "Purchase date",
            type: "date",
            required: true,
          },
          {
            id: "vehicleDetails",
            label: "Vehicle details",
            type: "text",
            required: true,
            fullWidth: true,
            placeholder: "Year / Make / Model / Rego",
          },
        ],
      },
      {
        title: "Claim Details",
        fields: [
          {
            id: "productAffected",
            label: "Product affected",
            type: "text",
            required: true,
            fullWidth: true,
          },
          {
            id: "issueDescription",
            label: "Issue description",
            type: "textarea",
            required: true,
            fullWidth: true,
            placeholder: "Describe the fault or issue",
          },
          {
            id: "requestedResolution",
            label: "Requested resolution",
            type: "select",
            required: true,
            options: ["Repair", "Replacement", "Refund", "Credit note"],
          },
          {
            id: "photosNote",
            label: "Photos",
            type: "note",
            fullWidth: true,
            body: "Attach product photos and invoice copies in the shared drive after submission.",
          },
        ],
      },
      {
        title: "Staff & Approval",
        fields: [
          {
            id: "staffMember",
            label: "Staff member",
            type: "text",
            required: true,
            placeholder: STAFF_PLACEHOLDER,
          },
          {
            id: "managerReview",
            label: "Manager review",
            type: "text",
            placeholder: MANAGER_PLACEHOLDER,
          },
        ],
      },
    ],
  },

  insurance: {
    submitLabel: "Generate insurance claim",
    sections: [
      {
        title: "Claim & Insurer",
        fields: [
          {
            id: "claimNumber",
            label: "Claim number",
            type: "text",
            required: true,
          },
          {
            id: "insurer",
            label: "Insurer",
            type: "text",
            required: true,
            placeholder: "e.g. NRMA, AAMI, Allianz",
          },
        ],
      },
      {
        title: "Customer & Vehicle",
        fields: [
          {
            id: "customerName",
            label: "Customer name",
            type: "text",
            required: true,
            fullWidth: true,
          },
          {
            id: "vehicleDetails",
            label: "Vehicle details",
            type: "text",
            required: true,
            fullWidth: true,
            placeholder: "Year / Make / Model / Rego",
          },
        ],
      },
      {
        title: "Damage & Assessment",
        fields: [
          {
            id: "damageDescription",
            label: "Damage description",
            type: "textarea",
            required: true,
            fullWidth: true,
          },
          {
            id: "assessorName",
            label: "Assessor name",
            type: "text",
          },
          {
            id: "assessorContact",
            label: "Assessor contact",
            type: "text",
            placeholder: "Phone or email",
          },
        ],
      },
      {
        title: "Financials",
        fields: [
          {
            id: "excessAmount",
            label: "Excess amount (AUD)",
            type: "number",
            required: true,
          },
          {
            id: "approvedRepairAmount",
            label: "Approved repair amount (AUD)",
            type: "number",
          },
          {
            id: "notes",
            label: "Notes",
            type: "textarea",
            fullWidth: true,
          },
        ],
      },
    ],
  },

  "job-card": {
    submitLabel: "Generate job card",
    sections: [
      {
        title: "Job & Customer",
        fields: [
          {
            id: "jobNumber",
            label: "Job number",
            type: "text",
            required: true,
          },
          {
            id: "customer",
            label: "Customer",
            type: "text",
            required: true,
          },
          {
            id: "vehicle",
            label: "Vehicle",
            type: "text",
            required: true,
            fullWidth: true,
            placeholder: "Year / Make / Model / Rego",
          },
        ],
      },
      {
        title: "Work Scope",
        fields: [
          {
            id: "workRequired",
            label: "Work required",
            type: "textarea",
            required: true,
            fullWidth: true,
          },
          {
            id: "partsRequired",
            label: "Parts required",
            type: "textarea",
            fullWidth: true,
            placeholder: "List parts and SKUs",
          },
        ],
      },
      {
        title: "Scheduling",
        fields: [
          {
            id: "installer",
            label: "Installer assigned",
            type: "text",
            required: true,
            placeholder: STAFF_PLACEHOLDER,
          },
          {
            id: "estimatedHours",
            label: "Estimated hours",
            type: "number",
            required: true,
          },
          {
            id: "startDate",
            label: "Start date",
            type: "date",
            required: true,
          },
          {
            id: "completionNotes",
            label: "Completion notes",
            type: "textarea",
            fullWidth: true,
          },
        ],
      },
    ],
  },

  "vehicle-inspection": {
    submitLabel: "Generate drop-off record",
    sections: [
      {
        title: "Customer & Vehicle",
        fields: [
          {
            id: "customer",
            label: "Customer",
            type: "text",
            required: true,
            fullWidth: true,
          },
          {
            id: "rego",
            label: "Vehicle rego",
            type: "text",
            required: true,
          },
          {
            id: "odometer",
            label: "Odometer (km)",
            type: "number",
            required: true,
          },
          {
            id: "dropOffAt",
            label: "Drop-off date / time",
            type: "datetime-local",
            required: true,
          },
        ],
      },
      {
        title: "Condition",
        fields: [
          {
            id: "existingDamage",
            label: "Existing damage notes",
            type: "textarea",
            required: true,
            fullWidth: true,
            placeholder: "Describe scratches, dents, or other damage",
          },
          {
            id: "fuelLevel",
            label: "Fuel level",
            type: "select",
            required: true,
            options: ["Empty", "1/4", "1/2", "3/4", "Full"],
          },
          {
            id: "photosChecklist",
            label: "Photos checklist",
            type: "note",
            fullWidth: true,
            body: "Take photos: front, rear, both sides, dashboard, odometer, any existing damage.",
          },
        ],
      },
      {
        title: "Belongings & Staff",
        fields: [
          {
            id: "customerBelongings",
            label: "Customer belongings left in vehicle",
            type: "textarea",
            fullWidth: true,
          },
          {
            id: "staffMember",
            label: "Staff member",
            type: "text",
            required: true,
            placeholder: STAFF_PLACEHOLDER,
          },
        ],
      },
    ],
  },

  hr: {
    submitLabel: "Submit HR form",
    sections: [
      {
        title: "Submitter",
        fields: [
          {
            id: "staffMember",
            label: "Staff member",
            type: "text",
            required: true,
            placeholder: STAFF_PLACEHOLDER,
          },
          {
            id: "formType",
            label: "Form type",
            type: "select",
            required: true,
            options: [
              "Leave request",
              "Incident report",
              "Uniform request",
              "Timesheet issue",
            ],
          },
          {
            id: "date",
            label: "Date",
            type: "date",
            required: true,
          },
          {
            id: "priority",
            label: "Priority",
            type: "select",
            required: true,
            options: ["Low", "Medium", "High", "Urgent"],
          },
        ],
      },
      {
        title: "Details",
        fields: [
          {
            id: "details",
            label: "Details",
            type: "textarea",
            required: true,
            fullWidth: true,
            placeholder: "Describe the request or issue",
          },
          {
            id: "manager",
            label: "Manager",
            type: "text",
            required: true,
            placeholder: MANAGER_PLACEHOLDER,
          },
        ],
      },
    ],
  },

  "finance-approval": {
    submitLabel: "Submit approval request",
    sections: [
      {
        title: "Request",
        fields: [
          {
            id: "requestType",
            label: "Request type",
            type: "select",
            required: true,
            options: [
              "Supplier payment",
              "Customer credit",
              "Capital purchase",
              "Other expense",
            ],
          },
          {
            id: "supplier",
            label: "Supplier",
            type: "text",
            required: true,
          },
          {
            id: "amount",
            label: "Amount (AUD)",
            type: "number",
            required: true,
          },
          {
            id: "dueDate",
            label: "Due date",
            type: "date",
            required: true,
          },
        ],
      },
      {
        title: "Justification",
        fields: [
          {
            id: "reason",
            label: "Reason",
            type: "textarea",
            required: true,
            fullWidth: true,
          },
          {
            id: "approvedBy",
            label: "Approved by",
            type: "text",
            placeholder: MANAGER_PLACEHOLDER,
          },
          {
            id: "notes",
            label: "Notes",
            type: "textarea",
            fullWidth: true,
          },
        ],
      },
    ],
  },

  "stock-request": {
    submitLabel: "Submit stock request",
    sections: [
      {
        title: "Requester",
        fields: [
          {
            id: "branch",
            label: "Branch",
            type: "select",
            required: true,
            options: [
              "Sydney",
              "Melbourne",
              "Brisbane",
              "Perth",
              "Adelaide",
            ],
          },
          {
            id: "requestedBy",
            label: "Requested by",
            type: "text",
            required: true,
            placeholder: STAFF_PLACEHOLDER,
          },
        ],
      },
      {
        title: "Product",
        fields: [
          {
            id: "product",
            label: "Product / SKU",
            type: "text",
            required: true,
            fullWidth: true,
          },
          {
            id: "quantity",
            label: "Quantity",
            type: "number",
            required: true,
          },
          {
            id: "urgency",
            label: "Urgency",
            type: "select",
            required: true,
            options: ["Low", "Standard", "High", "Urgent"],
          },
          {
            id: "supplier",
            label: "Supplier",
            type: "text",
          },
          {
            id: "requiredDate",
            label: "Required date",
            type: "date",
            required: true,
          },
        ],
      },
      {
        title: "Notes",
        fields: [
          {
            id: "notes",
            label: "Notes",
            type: "textarea",
            fullWidth: true,
          },
        ],
      },
    ],
  },

  "supplier-claim": {
    submitLabel: "Generate supplier claim",
    sections: [
      {
        title: "Supplier & Invoice",
        fields: [
          {
            id: "supplier",
            label: "Supplier",
            type: "text",
            required: true,
          },
          {
            id: "invoiceNumber",
            label: "Invoice number",
            type: "text",
            required: true,
          },
        ],
      },
      {
        title: "Issue",
        fields: [
          {
            id: "productIssue",
            label: "Product issue",
            type: "textarea",
            required: true,
            fullWidth: true,
          },
          {
            id: "quantityAffected",
            label: "Quantity affected",
            type: "number",
            required: true,
          },
          {
            id: "evidenceNote",
            label: "Photos / evidence",
            type: "note",
            fullWidth: true,
            body: "Attach photos and supporting documents in the shared drive after submission.",
          },
        ],
      },
      {
        title: "Outcome",
        fields: [
          {
            id: "claimAmount",
            label: "Claim amount (AUD)",
            type: "number",
            required: true,
          },
          {
            id: "requestedOutcome",
            label: "Requested outcome",
            type: "select",
            required: true,
            options: ["Credit note", "Replacement", "Refund", "Repair"],
          },
          {
            id: "staffMember",
            label: "Staff member",
            type: "text",
            required: true,
            placeholder: STAFF_PLACEHOLDER,
          },
        ],
      },
    ],
  },
};

export function getDemoForm(moduleId: string): DemoFormConfig | undefined {
  return DEMO_FORMS[moduleId];
}
