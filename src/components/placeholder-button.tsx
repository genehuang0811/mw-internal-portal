import type { ReactNode } from "react";

/**
 * A disabled button used for not-yet-connected demo actions. Always disabled,
 * with a tooltip explaining why.
 */
export function PlaceholderButton({
  children,
  title = "Demo only — not connected yet.",
  variant = "primary",
  className = "",
}: {
  children: ReactNode;
  title?: string;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  const base =
    "inline-flex h-10 cursor-not-allowed items-center justify-center rounded-md px-5 text-sm font-medium opacity-60";
  const styles =
    variant === "primary"
      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
      : "border border-zinc-300 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200";
  return (
    <button
      type="button"
      disabled
      aria-disabled="true"
      title={title}
      className={`${base} ${styles} ${className}`}
    >
      {children}
    </button>
  );
}
