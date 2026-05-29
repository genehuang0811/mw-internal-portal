import type { PanelItem } from "@/components/info-panel";
import {
  ReceiptText,
  ClipboardCheck,
  Plane,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

/**
 * Demo content for the dashboard homepage. All data here is placeholder content
 * for Draft 1 — there is no database yet.
 */

export type QuickAction = {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  accent: string;
  /** Marks the one genuinely working action. */
  active?: boolean;
};

export const QUICK_ACTIONS: QuickAction[] = [
  {
    label: "New Refund",
    description: "Generate a refund Excel form",
    href: "/forms/refund",
    icon: ReceiptText,
    accent: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300",
    active: true,
  },
  {
    label: "Drop-Off Inspection",
    description: "Record a vehicle drop-off",
    href: "/forms/vehicle-inspection",
    icon: ClipboardCheck,
    accent: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300",
  },
  {
    label: "Annual Leave",
    description: "Submit a leave request",
    href: "/forms/annual-leave",
    icon: Plane,
    accent:
      "bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-300",
  },
  {
    label: "Ask MW AI",
    description: "Preview the staff assistant",
    href: "/ai-assistant",
    icon: Sparkles,
    accent:
      "bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-950/50 dark:text-fuchsia-300",
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
