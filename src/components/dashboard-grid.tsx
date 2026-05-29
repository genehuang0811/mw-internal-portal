"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  groupByCategory,
  type ModuleStatus,
  type PortalModule,
} from "@/lib/modules";
import { StatusBadge } from "./badge";

type StatusFilter = "all" | ModuleStatus;

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "demo", label: "Demo" },
  { value: "coming-soon", label: "Coming Soon" },
];

export function DashboardGrid({ modules }: { modules: PortalModule[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = modules.filter((m) => {
      if (status !== "all" && m.status !== status) return false;
      if (!q) return true;
      return (
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q)
      );
    });
    return groupByCategory(filtered);
  }, [modules, query, status]);

  const total = groups.reduce((n, g) => n + g.modules.length, 0);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:max-w-xs sm:flex-1">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search forms and tools…"
            aria-label="Search modules"
            className="block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition-colors focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((f) => {
            const active = status === f.value;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => setStatus(f.value)}
                aria-pressed={active}
                className={
                  active
                    ? "rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
                    : "rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                }
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {total === 0 ? (
        <p className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-12 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
          No forms or tools match your search.
        </p>
      ) : (
        <div className="space-y-8">
          {groups.map((group) => (
            <section key={group.category}>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                {group.category}
              </h2>
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.modules.map((m) => (
                  <li key={m.id}>
                    {m.status === "coming-soon" ? (
                      <div
                        aria-disabled="true"
                        className="block h-full cursor-not-allowed rounded-2xl border border-zinc-200 bg-zinc-50 p-5 opacity-70 dark:border-zinc-800 dark:bg-zinc-900/40"
                      >
                        <ModuleCard module={m} />
                      </div>
                    ) : (
                      <Link
                        href={m.href}
                        className="group block h-full rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-zinc-900 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-100"
                      >
                        <ModuleCard module={m} />
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function ModuleCard({ module: m }: { module: PortalModule }) {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {m.title}
        </h3>
        <StatusBadge status={m.status} />
      </div>
      <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {m.description}
      </p>
    </>
  );
}
