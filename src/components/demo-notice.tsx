import type { ReactNode } from "react";

/**
 * Amber banner used to mark demo/prototype-only behavior across the portal.
 */
export function DemoNotice({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="note"
      className={`rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200 ${className}`}
    >
      {children}
    </div>
  );
}
