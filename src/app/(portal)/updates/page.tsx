import { PageHeader } from "@/components/page-header";
import { DemoNotice } from "@/components/demo-notice";
import { PlaceholderButton } from "@/components/placeholder-button";
import { Badge, type BadgeTone } from "@/components/badge";
import { findModuleById } from "@/lib/modules";

const MODULE = findModuleById("updates")!;

export const metadata = {
  title: `${MODULE.title} · MW Staff Hub`,
};

type Announcement = {
  category: string;
  tone: BadgeTone;
  title: string;
  body: string;
  date: string;
};

const ANNOUNCEMENTS: Announcement[] = [
  {
    category: "Pricing Updates",
    tone: "blue",
    title: "2025 pricing document released",
    body: "Updated canopy and tray pricing is now in effect. Please use the latest figures for all new quotes.",
    date: "Today",
  },
  {
    category: "Product Updates",
    tone: "emerald",
    title: "New premium canopy range available",
    body: "The premium dual-cab canopy is now available to order across all branches.",
    date: "2 days ago",
  },
  {
    category: "Changes",
    tone: "amber",
    title: "Refund approval threshold updated",
    body: "Refunds over $2,000 now require manager sign-off before processing.",
    date: "4 days ago",
  },
  {
    category: "Upcoming Events",
    tone: "zinc",
    title: "FarmFest 2025 — staff roster going out soon",
    body: "Expressions of interest for the FarmFest stand are open. Speak to your branch manager.",
    date: "1 week ago",
  },
];

const CATEGORIES = [
  "Pricing Updates",
  "Product Updates",
  "Changes",
  "Upcoming Events",
];

export default function UpdatesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="MW Updates · Demo"
        title={MODULE.title}
        description="Company news, pricing changes, and upcoming events for MW staff."
        actions={
          <PlaceholderButton title="Admin posting not connected yet.">
            Post update
          </PlaceholderButton>
        }
      />

      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map((c) => (
          <span
            key={c}
            className="rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
          >
            {c}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {ANNOUNCEMENTS.map((a) => (
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

      <DemoNotice>Demo only — admin posting not connected yet.</DemoNotice>
    </div>
  );
}
