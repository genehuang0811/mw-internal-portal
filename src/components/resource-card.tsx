import type { ReactNode } from "react";
import { Badge, type BadgeTone } from "./badge";

/**
 * A self-contained card for documents, templates, and resources. Renders a
 * title, optional description, an optional status badge, and a footer slot
 * (typically PlaceholderButtons).
 */
export function ResourceCard({
  title,
  description,
  status,
  statusTone = "amber",
  children,
}: {
  title: string;
  description?: string;
  status?: string;
  statusTone?: BadgeTone;
  children?: ReactNode;
}) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {title}
        </h3>
        {status && <Badge tone={statusTone}>{status}</Badge>}
      </div>
      {description && (
        <p className="mt-2 flex-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
      )}
      {children && <div className="mt-4 flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}
