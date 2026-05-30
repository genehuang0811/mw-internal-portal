export type ModuleStatus = "active" | "demo" | "coming-soon";

export type ModuleCategory =
  | "Operations"
  | "HR & Staff"
  | "Knowledge Base"
  | "MW Updates"
  | "Templates & Documents"
  | "AI Assistant";

/** Display order for category groups on the dashboard. */
export const CATEGORY_ORDER: ModuleCategory[] = [
  "Operations",
  "HR & Staff",
  "Knowledge Base",
  "MW Updates",
  "Templates & Documents",
  "AI Assistant",
];

export type PortalModule = {
  id: string;
  title: string;
  description: string;
  href: string;
  status: ModuleStatus;
  category: ModuleCategory;
};

export const MODULES: PortalModule[] = [
  // ── Operations ──────────────────────────────────────────────────────────
  {
    id: "refund",
    title: "Refund Application",
    description:
      "Generate a completed refund Excel form from staff-supplied details.",
    href: "/forms/refund",
    status: "active",
    category: "Operations",
  },
  {
    id: "warranty",
    title: "Warranty Claim Submission",
    description: "Submit a warranty claim against a supplied product.",
    href: "/forms/warranty",
    status: "active",
    category: "Operations",
  },
  {
    id: "vehicle-inspection",
    title: "Vehicle Drop-Off Inspection",
    description: "Capture a detailed vehicle drop-off inspection record.",
    href: "/forms/vehicle-inspection",
    status: "active",
    category: "Operations",
  },
  {
    id: "job-card",
    title: "Job Card Generator",
    description: "Create a job card for the workshop.",
    href: "/forms/job-card",
    status: "demo",
    category: "Operations",
  },
  {
    id: "insurance",
    title: "Insurance Claim Submission",
    description: "File an insurance claim for damaged or lost goods.",
    href: "/forms/insurance",
    status: "demo",
    category: "Operations",
  },

  // ── HR & Staff ──────────────────────────────────────────────────────────
  {
    id: "annual-leave",
    title: "Annual Leave Request",
    description: "Request annual leave for manager and accounts approval.",
    href: "/forms/annual-leave",
    status: "active",
    category: "HR & Staff",
  },
  {
    id: "anonymous-feedback",
    title: "Anonymous Feedback",
    description:
      "Submit an anonymous complaint, suggestion, or piece of feedback.",
    href: "/forms/anonymous-feedback",
    status: "demo",
    category: "HR & Staff",
  },
  {
    id: "incident",
    title: "Incident Report",
    description: "Report a workplace incident, near-miss, or hazard.",
    href: "/forms/incident",
    status: "demo",
    category: "HR & Staff",
  },

  // ── Knowledge Base ──────────────────────────────────────────────────────
  {
    id: "vehicle-dimensions",
    title: "Vehicle Dimensions",
    description:
      "Searchable reference of vehicle dimensions and fitment notes.",
    href: "/knowledge/vehicle-dimensions",
    status: "demo",
    category: "Knowledge Base",
  },
  {
    id: "pricing-document",
    title: "Pricing Document",
    description: "View and download the latest MW pricing document.",
    href: "/knowledge/pricing-document",
    status: "demo",
    category: "Knowledge Base",
  },

  // ── MW Updates ──────────────────────────────────────────────────────────
  {
    id: "updates",
    title: "MW Updates",
    description: "Pricing, product, and operational updates for staff.",
    href: "/updates",
    status: "demo",
    category: "MW Updates",
  },
  {
    id: "calendar",
    title: "MW Calendar",
    description: "Company events, training days, and key dates.",
    href: "/calendar",
    status: "demo",
    category: "MW Updates",
  },

  // ── Templates & Documents ───────────────────────────────────────────────
  {
    id: "templates",
    title: "MW Templates",
    description:
      "Approved templates for records, rosters, orders, and procedures.",
    href: "/templates",
    status: "demo",
    category: "Templates & Documents",
  },

  // ── AI Assistant ────────────────────────────────────────────────────────
  {
    id: "ai-assistant",
    title: "MW AI Assistant",
    description: "Internal AI helper for MW staff — the brain of the portal.",
    href: "/ai-assistant",
    status: "demo",
    category: "AI Assistant",
  },
];

export function findModuleByHref(href: string): PortalModule | undefined {
  return MODULES.find((m) => m.href === href);
}

export function findModuleById(id: string): PortalModule | undefined {
  return MODULES.find((m) => m.id === id);
}

/**
 * Groups the given modules by category, returning groups in CATEGORY_ORDER.
 * Categories with no matching modules are omitted.
 */
export function groupByCategory(
  modules: PortalModule[] = MODULES,
): Array<{ category: ModuleCategory; modules: PortalModule[] }> {
  return CATEGORY_ORDER.map((category) => ({
    category,
    modules: modules.filter((m) => m.category === category),
  })).filter((group) => group.modules.length > 0);
}
