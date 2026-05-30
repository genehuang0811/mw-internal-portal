import {
  Wrench,
  Users,
  BookOpen,
  Megaphone,
  Files,
  Sparkles,
  ReceiptText,
  ShieldCheck,
  ClipboardCheck,
  ClipboardList,
  Umbrella,
  Plane,
  MessageSquare,
  TriangleAlert,
  Ruler,
  Tag,
  Calendar,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react";
import type { ModuleCategory } from "./modules";

/** Tinted icon-chip classes per category — subtle, professional accents. */
type CategoryMeta = { icon: LucideIcon; accent: string };

export const CATEGORY_META: Record<ModuleCategory, CategoryMeta> = {
  Operations: {
    icon: Wrench,
    accent: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300",
  },
  "HR & Staff": {
    icon: Users,
    accent:
      "bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-300",
  },
  "Knowledge Base": {
    icon: BookOpen,
    accent:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300",
  },
  "MW Updates": {
    icon: Megaphone,
    accent:
      "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-300",
  },
  "Templates & Documents": {
    icon: Files,
    accent:
      "bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300",
  },
  "AI Assistant": {
    icon: Sparkles,
    accent:
      "bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-950/50 dark:text-fuchsia-300",
  },
};

/** Per-module icon, keyed by module id. */
export const MODULE_ICONS: Record<string, LucideIcon> = {
  refund: ReceiptText,
  warranty: ShieldCheck,
  "vehicle-inspection": ClipboardCheck,
  "job-card": ClipboardList,
  procurement: ShoppingCart,
  insurance: Umbrella,
  "annual-leave": Plane,
  "anonymous-feedback": MessageSquare,
  incident: TriangleAlert,
  "vehicle-dimensions": Ruler,
  "pricing-document": Tag,
  updates: Megaphone,
  calendar: Calendar,
  templates: Files,
  "ai-assistant": Sparkles,
};

export function moduleIcon(id: string): LucideIcon {
  return MODULE_ICONS[id] ?? Files;
}
