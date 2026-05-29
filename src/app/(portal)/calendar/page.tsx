import { CalendarPlus, CalendarDays, GraduationCap, PartyPopper, Wrench } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { DemoNotice } from "@/components/demo-notice";
import { Badge, type BadgeTone } from "@/components/badge";
import { findModuleById } from "@/lib/modules";
import { moduleIcon, CATEGORY_META } from "@/lib/icons";

const MODULE = findModuleById("calendar")!;

export const metadata = {
  title: `${MODULE.title} · MW Staff Hub`,
};

type EventType = "Event" | "Training" | "Social" | "Operations";

type CalendarEvent = {
  month: string;
  date: string;
  day: string;
  title: string;
  location: string;
  type: EventType;
  tone: BadgeTone;
};

const EVENTS: CalendarEvent[] = [
  {
    month: "June 2026",
    date: "6–8 Jun",
    day: "Fri–Sun",
    title: "FarmFest 2026",
    location: "Toowoomba Showgrounds",
    type: "Event",
    tone: "emerald",
  },
  {
    month: "June 2026",
    date: "27 Jun",
    day: "Sat",
    title: "MW staff dinner",
    location: "Toowoomba (venue TBC)",
    type: "Social",
    tone: "amber",
  },
  {
    month: "June 2026",
    date: "30 Jun",
    day: "Tue",
    title: "End-of-financial-year stocktake",
    location: "All branches",
    type: "Operations",
    tone: "red",
  },
  {
    month: "July 2026",
    date: "12 Jul",
    day: "Sun",
    title: "Staff training day — fitment & disclaimers",
    location: "Brisbane workshop",
    type: "Training",
    tone: "blue",
  },
];

function groupByMonth(events: CalendarEvent[]) {
  const order: string[] = [];
  const map = new Map<string, CalendarEvent[]>();
  for (const e of events) {
    if (!map.has(e.month)) {
      map.set(e.month, []);
      order.push(e.month);
    }
    map.get(e.month)!.push(e);
  }
  return order.map((month) => ({ month, events: map.get(month)! }));
}

export default function CalendarPage() {
  const months = groupByMonth(EVENTS);
  const summary = {
    total: EVENTS.length,
    training: EVENTS.filter((e) => e.type === "Training").length,
    social: EVENTS.filter((e) => e.type === "Social").length,
    operational: EVENTS.filter((e) => e.type === "Operations").length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="MW Updates · Demo"
        title={MODULE.title}
        description="Company events, training days, and key dates."
        icon={moduleIcon("calendar")}
        iconAccent={CATEGORY_META["MW Updates"].accent}
      />

      {/* Upcoming this quarter summary */}
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          Upcoming this quarter
        </h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <SummaryStat
            icon={<CalendarDays className="h-5 w-5" />}
            value={summary.total}
            label="Total events"
            accent="bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
          />
          <SummaryStat
            icon={<GraduationCap className="h-5 w-5" />}
            value={summary.training}
            label="Training days"
            accent="bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300"
          />
          <SummaryStat
            icon={<PartyPopper className="h-5 w-5" />}
            value={summary.social}
            label="Social events"
            accent="bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-300"
          />
          <SummaryStat
            icon={<Wrench className="h-5 w-5" />}
            value={summary.operational}
            label="Operational events"
            accent="bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-300"
          />
        </div>
      </section>

      {/* Events grouped by month */}
      {months.map((group) => (
        <section key={group.month}>
          <h2 className="mb-3 text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {group.month}
          </h2>
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {group.events.map((e) => (
                <li
                  key={e.title}
                  className="flex flex-wrap items-center gap-4 px-5 py-4"
                >
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
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    title="Demo only — calendar export not connected yet."
                    className="inline-flex h-8 cursor-not-allowed items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-3 text-xs font-medium text-zinc-500 opacity-70 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-500"
                  >
                    <CalendarPlus className="h-3.5 w-3.5" aria-hidden="true" />
                    Add to Calendar (.ics)
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}

      <DemoNotice>Demo only — calendar sync not connected yet.</DemoNotice>
    </div>
  );
}

function SummaryStat({
  icon,
  value,
  label,
  accent,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  accent: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <span
        className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${accent}`}
      >
        {icon}
      </span>
      <div>
        <p className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {value}
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
      </div>
    </div>
  );
}
