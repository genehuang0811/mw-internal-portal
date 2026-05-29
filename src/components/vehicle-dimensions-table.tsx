"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

export type VehicleDimension = {
  make: string;
  vehicle: string;
  chassisNotes: string;
  trayLength: string;
  canopyNotes: string;
  fitmentComments: string;
};

export function VehicleDimensionsTable({
  rows,
}: {
  rows: VehicleDimension[];
}) {
  const [query, setQuery] = useState("");
  const [make, setMake] = useState("All");

  const makes = useMemo(() => {
    const unique = Array.from(new Set(rows.map((r) => r.make)));
    return ["All", ...unique];
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (make !== "All" && r.make !== make) return false;
      if (!q) return true;
      return [
        r.vehicle,
        r.chassisNotes,
        r.trayLength,
        r.canopyNotes,
        r.fitmentComments,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [rows, query, make]);

  return (
    <div className="space-y-4">
      <div className="relative max-w-md">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search vehicles, tray length, canopy notes…"
          aria-label="Search vehicle dimensions"
          className="block w-full rounded-md border border-zinc-300 bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 shadow-sm outline-none transition-colors focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
        />
      </div>

      {/* Make filter */}
      <div className="flex flex-wrap gap-1.5">
        {makes.map((m) => {
          const active = make === m;
          return (
            <button
              key={m}
              type="button"
              onClick={() => setMake(m)}
              aria-pressed={active}
              className={
                active
                  ? "rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }
            >
              {m}
            </button>
          );
        })}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              <th className="px-4 py-3 font-medium">Vehicle</th>
              <th className="px-4 py-3 font-medium">Tub / chassis notes</th>
              <th className="px-4 py-3 font-medium">Tray length</th>
              <th className="px-4 py-3 font-medium">Canopy notes</th>
              <th className="px-4 py-3 font-medium">Common fitment comments</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400"
                >
                  No vehicles match your search.
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr
                  key={r.vehicle}
                  className="align-top text-zinc-700 dark:text-zinc-300"
                >
                  <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                    {r.vehicle}
                  </td>
                  <td className="px-4 py-3">{r.chassisNotes}</td>
                  <td className="px-4 py-3">{r.trayLength}</td>
                  <td className="px-4 py-3">{r.canopyNotes}</td>
                  <td className="px-4 py-3">{r.fitmentComments}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
