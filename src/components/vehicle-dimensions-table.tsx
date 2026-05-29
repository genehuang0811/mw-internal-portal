"use client";

import { useMemo, useState } from "react";

export type VehicleDimension = {
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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.vehicle, r.chassisNotes, r.trayLength, r.canopyNotes, r.fitmentComments]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [rows, query]);

  return (
    <div className="space-y-4">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search vehicles, tray length, canopy notes…"
        aria-label="Search vehicle dimensions"
        className="block w-full max-w-md rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition-colors focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
      />

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
