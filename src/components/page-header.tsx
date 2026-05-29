import Link from "next/link";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export function PageHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
  iconAccent = "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
  backHref = "/dashboard",
  backLabel = "Back to dashboard",
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
  iconAccent?: string;
  /** Pass null to hide the back link. */
  backHref?: string | null;
  backLabel?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-3">
        {Icon && (
          <span
            className={`mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconAccent}`}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
        )}
        <div>
          {eyebrow && (
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              {eyebrow}
            </p>
          )}
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {title}
          </h1>
          {description && (
            <p className="mt-1 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
              {description}
            </p>
          )}
        </div>
      </div>
      {(actions || backHref) && (
        <div className="flex shrink-0 items-center gap-2">
          {actions}
          {backHref && (
            <Link
              href={backHref}
              className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              {backLabel}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
