export type DemoFieldType =
  | "text"
  | "email"
  | "tel"
  | "textarea"
  | "date"
  | "datetime-local"
  | "number"
  | "select"
  | "checkbox"
  | "checklist"
  | "file"
  | "signature"
  | "note";

export type DemoField = {
  id: string;
  label: string;
  type: DemoFieldType;
  required?: boolean;
  fullWidth?: boolean;
  placeholder?: string;
  options?: readonly string[];
  /** For note/file/signature/checkbox: supporting body text. */
  body?: string;
};

export type DemoSection = {
  title: string;
  hint?: string;
  fields: DemoField[];
};

export type DemoFormConfig = {
  submitLabel: string;
  /** Overrides the default amber demo banner text. */
  demoNotice?: string;
  sections: DemoSection[];
};

const STAFF_PLACEHOLDER = "e.g. Sarah Lee";
const MANAGER_PLACEHOLDER = "e.g. Tom Nguyen";

const BRANCHES = [
  "Toowoomba",
  "Brisbane",
  "Sunshine Coast",
  "Gold Coast",
] as const;

export const DEMO_FORMS: Record<string, DemoFormConfig> = {
  warranty: {
    submitLabel: "Generate warranty claim",
    demoNotice:
      "Demo only — future version will generate a Word/PDF claim and email management.",
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
            id: "requestedOutcome",
            label: "Requested outcome",
            type: "select",
            required: true,
            options: ["Repair", "Replacement", "Refund", "Credit note"],
          },
          {
            id: "evidence",
            label: "Photos / evidence",
            type: "file",
            fullWidth: true,
            body: "Attach product photos and invoice copies.",
          },
        ],
      },
      {
        title: "Staff & Review",
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
          { id: "assessorName", label: "Assessor name", type: "text" },
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
          { id: "notes", label: "Notes", type: "textarea", fullWidth: true },
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
          { id: "jobNumber", label: "Job number", type: "text", required: true },
          { id: "customer", label: "Customer", type: "text", required: true },
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
          { id: "startDate", label: "Start date", type: "date", required: true },
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
    demoNotice: "Demo only — Google Drive upload not connected yet.",
    sections: [
      {
        title: "Customer & Vehicle",
        fields: [
          {
            id: "customer",
            label: "Customer name",
            type: "text",
            required: true,
            fullWidth: true,
          },
          { id: "rego", label: "Vehicle rego", type: "text", required: true },
          {
            id: "makeModel",
            label: "Vehicle make / model",
            type: "text",
            required: true,
            placeholder: "e.g. Ford Ranger XLT",
          },
          {
            id: "odometer",
            label: "Odometer (km)",
            type: "number",
            required: true,
          },
          {
            id: "fuelLevel",
            label: "Fuel level",
            type: "select",
            required: true,
            options: ["Empty", "1/4", "1/2", "3/4", "Full"],
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
        title: "Photos (all angles)",
        hint: "Upload placeholders — not connected yet.",
        fields: [
          { id: "photoFront", label: "Front", type: "file" },
          { id: "photoRear", label: "Rear", type: "file" },
          { id: "photoLeft", label: "Left side", type: "file" },
          { id: "photoRight", label: "Right side", type: "file" },
          { id: "photoDash", label: "Dashboard / odometer", type: "file" },
          { id: "photoDamage", label: "Existing damage", type: "file" },
        ],
      },
      {
        title: "Condition & Disclaimers",
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
            id: "blisDisclaimer",
            label: "BLIS / sensor disclaimer",
            type: "checkbox",
            fullWidth: true,
            body: "Customer acknowledges that fitment may require relocation of sensors / BLIS components and accepts the associated disclaimer.",
          },
        ],
      },
      {
        title: "Belongings & Sign-off",
        fields: [
          {
            id: "belongings",
            label: "Customer belongings left in vehicle",
            type: "checklist",
            fullWidth: true,
            options: [
              "Wallet",
              "Phone",
              "Keys",
              "Sunglasses",
              "Documents",
              "Charging cable",
              "Toll tag",
              "Other",
            ],
          },
          {
            id: "staffMember",
            label: "Staff member",
            type: "text",
            required: true,
            placeholder: STAFF_PLACEHOLDER,
          },
          {
            id: "signature",
            label: "Customer signature",
            type: "signature",
            fullWidth: true,
            body: "Signature capture placeholder — not connected yet.",
          },
        ],
      },
    ],
  },

  "annual-leave": {
    submitLabel: "Submit leave request",
    demoNotice:
      "Demo only — future version will export Word/PDF and email Accounts / Management.",
    sections: [
      {
        title: "Employee",
        fields: [
          {
            id: "employeeName",
            label: "Employee name",
            type: "text",
            required: true,
            fullWidth: true,
            placeholder: STAFF_PLACEHOLDER,
          },
          {
            id: "leaveType",
            label: "Leave type",
            type: "select",
            required: true,
            options: [
              "Annual leave",
              "Personal / carer's leave",
              "Unpaid leave",
              "Long service leave",
            ],
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
      {
        title: "Dates",
        fields: [
          { id: "startDate", label: "Start date", type: "date", required: true },
          { id: "endDate", label: "End date", type: "date", required: true },
          {
            id: "notes",
            label: "Reason / notes",
            type: "textarea",
            fullWidth: true,
            placeholder: "Optional — any details for your manager",
          },
        ],
      },
    ],
  },

  "anonymous-feedback": {
    submitLabel: "Submit anonymously",
    demoNotice:
      "Demo only — future version will send directly to support / management. Submissions are anonymous unless you add your name.",
    sections: [
      {
        title: "Submission",
        fields: [
          {
            id: "submissionType",
            label: "Submission type",
            type: "select",
            required: true,
            options: ["Complaint", "Feedback", "Suggestion"],
          },
          {
            id: "branch",
            label: "Branch",
            type: "select",
            required: true,
            options: BRANCHES,
          },
          {
            id: "urgency",
            label: "Urgency",
            type: "select",
            required: true,
            options: ["Low", "Medium", "High"],
          },
          {
            id: "contactName",
            label: "Your name (optional)",
            type: "text",
            placeholder: "Leave blank to stay anonymous",
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
            placeholder: "Tell us what's on your mind",
          },
          {
            id: "supportNotice",
            label: "Prefer to talk to someone?",
            type: "note",
            fullWidth: true,
            body: "You can also email support@mwmanufacturing.com.au or speak to your manager directly.",
          },
        ],
      },
    ],
  },

  incident: {
    submitLabel: "Submit incident report",
    demoNotice:
      "Demo only — future version will notify management and log to the safety register.",
    sections: [
      {
        title: "Incident",
        fields: [
          {
            id: "incidentAt",
            label: "Date / time of incident",
            type: "datetime-local",
            required: true,
          },
          {
            id: "branch",
            label: "Branch / location",
            type: "select",
            required: true,
            options: BRANCHES,
          },
          {
            id: "incidentType",
            label: "Type",
            type: "select",
            required: true,
            options: ["Injury", "Near-miss", "Property damage", "Hazard", "Other"],
          },
          {
            id: "injuryOccurred",
            label: "Injury occurred",
            type: "checkbox",
            fullWidth: true,
            body: "Tick if any person was injured. First aid / medical details should be noted below.",
          },
        ],
      },
      {
        title: "Details",
        fields: [
          {
            id: "peopleInvolved",
            label: "People involved",
            type: "text",
            fullWidth: true,
            placeholder: "Names of those involved or witnesses",
          },
          {
            id: "description",
            label: "What happened",
            type: "textarea",
            required: true,
            fullWidth: true,
          },
          {
            id: "actionTaken",
            label: "Immediate action taken",
            type: "textarea",
            fullWidth: true,
          },
          {
            id: "evidence",
            label: "Photos / evidence",
            type: "file",
            fullWidth: true,
          },
        ],
      },
      {
        title: "Reporter",
        fields: [
          {
            id: "reportedBy",
            label: "Reported by",
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
