export type ModuleStatus = "active" | "coming-soon";

export type PortalModule = {
  id: string;
  title: string;
  description: string;
  href: string;
  status: ModuleStatus;
};

export const MODULES: PortalModule[] = [
  {
    id: "refund",
    title: "Refund Application",
    description:
      "Generate a completed refund Excel form from staff-supplied details.",
    href: "/forms/refund",
    status: "active",
  },
  {
    id: "warranty",
    title: "Warranty Claim",
    description: "Submit a warranty claim against a supplied product.",
    href: "/forms/warranty",
    status: "coming-soon",
  },
  {
    id: "insurance",
    title: "Insurance Claim",
    description: "File an insurance claim for damaged or lost goods.",
    href: "/forms/insurance",
    status: "coming-soon",
  },
  {
    id: "job-card",
    title: "Job Card Generator",
    description: "Create a job card for the workshop.",
    href: "/forms/job-card",
    status: "coming-soon",
  },
  {
    id: "vehicle-inspection",
    title: "Vehicle Drop-Off Inspection",
    description: "Capture a vehicle drop-off inspection record.",
    href: "/forms/vehicle-inspection",
    status: "coming-soon",
  },
  {
    id: "hr",
    title: "HR Forms",
    description: "Leave requests, onboarding, and other HR forms.",
    href: "/forms/hr",
    status: "coming-soon",
  },
  {
    id: "finance-approval",
    title: "Finance Approval Request",
    description:
      "Request finance approval for spend, purchases, or credits.",
    href: "/forms/finance-approval",
    status: "coming-soon",
  },
  {
    id: "stock-request",
    title: "Stock Request",
    description: "Request stock transfer or new stock orders.",
    href: "/forms/stock-request",
    status: "coming-soon",
  },
  {
    id: "supplier-claim",
    title: "Supplier Claim",
    description:
      "Raise a claim against a supplier for stock or invoice issues.",
    href: "/forms/supplier-claim",
    status: "coming-soon",
  },
  {
    id: "ai-assistant",
    title: "MW AI Assistant",
    description: "Internal AI helper for MW staff.",
    href: "/ai-assistant",
    status: "coming-soon",
  },
];

export function findModuleByHref(href: string): PortalModule | undefined {
  return MODULES.find((m) => m.href === href);
}

export function findModuleById(id: string): PortalModule | undefined {
  return MODULES.find((m) => m.id === id);
}
