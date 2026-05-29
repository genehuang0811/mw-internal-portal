import Link from "next/link";
import { DashboardGrid } from "@/components/dashboard-grid";
import { InfoPanel } from "@/components/info-panel";
import { Badge } from "@/components/badge";
import { MODULES } from "@/lib/modules";
import {
  IMPORTANT_NOTICES,
  QUICK_ACTIONS,
  RECENT_UPDATES,
} from "@/lib/portal-content";

export const metadata = {
  title: "Dashboard · MW Staff Hub",
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          MW Manufacturing
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Staff Hub
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Your central place for forms, knowledge, updates, and tools.
        </p>
      </div>

      {/* Quick actions */}
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          Quick actions
        </h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group flex flex-col justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-zinc-900 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-100"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                  {action.label}
                </span>
                {action.active && <Badge tone="emerald">Active</Badge>}
              </div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {action.description}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Notices + recent updates */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <InfoPanel title="Important notices" items={IMPORTANT_NOTICES} />
        <InfoPanel title="Recently updated" items={RECENT_UPDATES} />
      </div>

      {/* All modules, grouped + searchable */}
      <section>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          All forms &amp; tools
        </h2>
        <DashboardGrid modules={MODULES} />
      </section>
    </div>
  );
}
