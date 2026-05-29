import type { PanelItem } from "@/components/info-panel";

/**
 * Demo content for the dashboard homepage. All data here is placeholder content
 * for Draft 1 — there is no database yet.
 */

export type QuickAction = {
  label: string;
  description: string;
  href: string;
  /** Marks the one genuinely working action. */
  active?: boolean;
};

export const QUICK_ACTIONS: QuickAction[] = [
  {
    label: "New Refund",
    description: "Generate a refund Excel form",
    href: "/forms/refund",
    active: true,
  },
  {
    label: "Drop-Off Inspection",
    description: "Record a vehicle drop-off",
    href: "/forms/vehicle-inspection",
  },
  {
    label: "Annual Leave",
    description: "Submit a leave request",
    href: "/forms/annual-leave",
  },
  {
    label: "Ask MW AI",
    description: "Preview the staff assistant",
    href: "/ai-assistant",
  },
];

export const IMPORTANT_NOTICES: PanelItem[] = [
  {
    title: "BLIS / sensor relocation disclaimer is now mandatory",
    meta: "Compliance · pinned",
    tag: "Action",
    tagTone: "red",
  },
  {
    title: "Stocktake scheduled for 30 June — rosters affected",
    meta: "Operations · 2 days ago",
    tag: "Notice",
    tagTone: "amber",
  },
  {
    title: "Refund approvals over $2,000 now require manager sign-off",
    meta: "Finance · 4 days ago",
    tag: "Policy",
    tagTone: "blue",
  },
];

export const RECENT_UPDATES: PanelItem[] = [
  {
    title: "2025 pricing document updated",
    meta: "Pricing · today",
    tag: "Pricing",
    tagTone: "blue",
  },
  {
    title: "New canopy fitment notes added for Ranger / Hilux",
    meta: "Knowledge Base · yesterday",
    tag: "Knowledge",
    tagTone: "emerald",
  },
  {
    title: "Roster template v3 published",
    meta: "Templates · 3 days ago",
    tag: "Template",
    tagTone: "zinc",
  },
];
