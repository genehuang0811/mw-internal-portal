import { PageHeader } from "@/components/page-header";
import { DemoNotice } from "@/components/demo-notice";
import { PlaceholderButton } from "@/components/placeholder-button";
import { UpdatesFeed, type Announcement } from "@/components/updates-feed";
import { findModuleById } from "@/lib/modules";
import { moduleIcon, CATEGORY_META } from "@/lib/icons";

const MODULE = findModuleById("updates")!;

export const metadata = {
  title: `${MODULE.title} · MW Staff Hub`,
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
  {
    category: "Product Updates",
    tone: "emerald",
    title: "Updated roof rack load ratings published",
    body: "Revised load ratings for the alloy roof rack range are now in the Knowledge Base.",
    date: "1 week ago",
  },
];

export default function UpdatesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="MW Updates · Demo"
        title={MODULE.title}
        description="Company news, pricing changes, and upcoming events for MW staff."
        icon={moduleIcon("updates")}
        iconAccent={CATEGORY_META["MW Updates"].accent}
        actions={
          <PlaceholderButton title="Admin posting not connected yet.">
            Post update
          </PlaceholderButton>
        }
      />

      <UpdatesFeed announcements={ANNOUNCEMENTS} />

      <DemoNotice>Demo only — admin posting not connected yet.</DemoNotice>
    </div>
  );
}
