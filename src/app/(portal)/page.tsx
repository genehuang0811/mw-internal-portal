import Link from "next/link";
import { MODULES, type PortalModule } from "@/lib/modules";

export const metadata = {
  title: "Dashboard · MW Internal Forms Portal",
};

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Choose an internal form or tool below.
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MODULES.map((m) => (
          <li key={m.id}>
            {m.status === "active" ? (
              <Link
                href={m.href}
                className="group block h-full rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-zinc-900 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-100"
              >
                <ModuleCard module={m} />
              </Link>
            ) : (
              <div
                aria-disabled="true"
                className="block h-full cursor-not-allowed rounded-2xl border border-zinc-200 bg-zinc-50 p-5 opacity-70 dark:border-zinc-800 dark:bg-zinc-900/40"
              >
                <ModuleCard module={m} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ModuleCard({ module: m }: { module: PortalModule }) {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {m.title}
        </h2>
        <StatusBadge status={m.status} />
      </div>
      <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {m.description}
      </p>
    </>
  );
}

function StatusBadge({ status }: { status: PortalModule["status"] }) {
  if (status === "active") {
    return (
      <span className="inline-flex shrink-0 items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200">
        Active
      </span>
    );
  }
  return (
    <span className="inline-flex shrink-0 items-center rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
      Coming Soon
    </span>
  );
}
