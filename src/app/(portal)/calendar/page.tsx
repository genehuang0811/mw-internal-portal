import { PageHeader } from "@/components/page-header";
import { DemoNotice } from "@/components/demo-notice";
import { Badge, type BadgeTone } from "@/components/badge";
import { findModuleById } from "@/lib/modules";

const MODULE = findModuleById("calendar")!;

export const metadata = {
  title: `${MODULE.title} · MW Staff Hub`,
};

type CalendarEvent = {
  date: string;
  day: string;
  title: string;
  location: string;
  type: string;
  tone: BadgeTone;
};

const EVENTS: CalendarEvent[] = [
  {
    date: "6–8 Jun",
    day: "Fri–Sun",
    title: "FarmFest 2025",
    location: "Toowoomba Showgrounds",
    type: "Event",
    tone: "emerald",
  },
  {
    date: "14 Jun",
    day: "Sat",
    title: "Staff training day — fitment & disclaimers",
    location: "Brisbane workshop",
    type: "Training",
    tone: "blue",
  },
  {
    date: "27 Jun",
    day: "Fri",
    title: "MW staff dinner",
    location: "Toowoomba (venue TBC)",
    type: "Social",
    tone: "amber",
  },
  {
    date: "30 Jun",
    day: "Mon",
    title: "End-of-financial-year stocktake",
    location: "All branches",
    type: "Operations",
    tone: "red",
  },
];

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="MW Updates · Demo"
        title={MODULE.title}
        description="Company events, training days, and key dates."
      />

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {EVENTS.map((e) => (
            <li key={e.title} className="flex items-center gap-4 px-5 py-4">
              <div className="w-16 shrink-0 text-center">
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  {e.date}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {e.day}
                </p>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {e.title}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {e.location}
                </p>
              </div>
              <Badge tone={e.tone}>{e.type}</Badge>
            </li>
          ))}
        </ul>
      </div>

      <DemoNotice>Demo only — calendar sync not connected yet.</DemoNotice>
    </div>
  );
}
