import type { ReactNode } from "react";
import { Badge, type BadgeTone } from "./badge";

/**
 * A self-contained card for documents, templates, and resources. Renders a
 * title, optional file-type chip, description, status badge, a meta slot
 * (e.g. last updated / owner), and a footer slot (typically PlaceholderButtons).
 */
export function ResourceCard({
  title,
  description,
  fileType,
  status,
  statusTone = "amber",
  meta,
  children,
}: {
  title: string;
  description?: string;
  fileType?: string;
  status?: string;
  statusTone?: BadgeTone;
  meta?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {title}
          </h3>
          {fileType && (
            <span className="inline-flex shrink-0 items-center rounded border border-zinc-300 px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
              {fileType}
            </span>
          )}
        </div>
        {status && <Badge tone={statusTone}>{status}</Badge>}
      </div>
      {description && (
        <p className="mt-2 flex-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
      )}
      {meta && (
        <div className="mt-3 space-y-0.5 text-xs text-zinc-500 dark:text-zinc-400">
          {meta}
        </div>
      )}
      {children && <div className="mt-4 flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}
