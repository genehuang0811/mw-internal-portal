"use client";

import { useMemo, useState } from "react";
import { Badge, type BadgeTone } from "./badge";

export type Announcement = {
  category: string;
  tone: BadgeTone;
  title: string;
  body: string;
  date: string;
};

const FILTERS = [
  "All",
  "Pricing Updates",
  "Product Updates",
  "Changes",
  "Upcoming Events",
];

export function UpdatesFeed({
  announcements,
}: {
  announcements: Announcement[];
}) {
  const [active, setActive] = useState("All");

  const shown = useMemo(
    () =>
      active === "All"
        ? announcements
        : announcements.filter((a) => a.category === active),
    [announcements, active],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1.5">
        {FILTERS.map((f) => {
          const isActive = active === f;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setActive(f)}
              aria-pressed={isActive}
              className={
                isActive
                  ? "rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }
            >
              {f}
            </button>
          );
        })}
      </div>

      {shown.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-12 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
          No updates in this category yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {shown.map((a) => (
            <article
              key={a.title}
              className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-center justify-between gap-3">
                <Badge tone={a.tone}>{a.category}</Badge>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {a.date}
                </span>
              </div>
              <h2 className="mt-3 text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                {a.title}
              </h2>
              <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {a.body}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
