import type { ReactNode } from "react";
import type { ModuleStatus } from "@/lib/modules";

export type BadgeTone = "zinc" | "amber" | "emerald" | "blue" | "red";

const TONES: Record<BadgeTone, string> = {
  zinc: "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  amber:
    "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-200",
  emerald:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200",
  blue: "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-200",
  red: "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-200",
};

export function Badge({
  children,
  tone = "zinc",
}: {
  children: ReactNode;
  tone?: BadgeTone;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}

const STATUS_TONE: Record<ModuleStatus, BadgeTone> = {
  active: "emerald",
  demo: "amber",
  "coming-soon": "zinc",
};

const STATUS_LABEL: Record<ModuleStatus, string> = {
  active: "Active",
  demo: "Demo",
  "coming-soon": "Coming Soon",
};

export function StatusBadge({ status }: { status: ModuleStatus }) {
  return <Badge tone={STATUS_TONE[status]}>{STATUS_LABEL[status]}</Badge>;
}
