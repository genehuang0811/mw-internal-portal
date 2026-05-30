"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import {
  groupByCategory,
  type ModuleStatus,
  type PortalModule,
} from "@/lib/modules";
import { CATEGORY_META, MODULE_ICONS } from "@/lib/icons";
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
        m.category.toLowerCase().includes(q) ||
        (m.keywords?.some((k) => k.toLowerCase().includes(q)) ?? false)
      );
    });
    return groupByCategory(filtered);
  }, [modules, query, status]);

  const total = groups.reduce((n, g) => n + g.modules.length, 0);

  return (
    <div>
      {/* Prominent search */}
      <div className="relative mb-3">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search forms and tools — try “refund”, “leave”, “pricing”…"
          aria-label="Search forms and tools"
          className="block h-12 w-full rounded-xl border border-zinc-300 bg-white pl-11 pr-4 text-sm text-zinc-900 shadow-sm outline-none transition-colors focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
        />
      </div>

      <div className="mb-6 flex flex-wrap gap-1.5">
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

      {total === 0 ? (
        <p className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-12 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
          No forms or tools match your search.
        </p>
      ) : (
        <div className="space-y-8">
          {groups.map((group) => {
            const meta = CATEGORY_META[group.category];
            const CategoryIcon = meta.icon;
            return (
              <section key={group.category}>
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-md ${meta.accent}`}
                  >
                    <CategoryIcon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                    {group.category}
                  </h2>
                </div>
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
            );
          })}
        </div>
      )}
    </div>
  );
}

function ModuleCard({ module: m }: { module: PortalModule }) {
  const Icon = MODULE_ICONS[m.id] ?? CATEGORY_META[m.category].icon;
  const accent = CATEGORY_META[m.category].accent;
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${accent}`}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <h3 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {m.title}
          </h3>
        </div>
        <StatusBadge status={m.status} />
      </div>
      <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {m.description}
      </p>
    </>
  );
}
