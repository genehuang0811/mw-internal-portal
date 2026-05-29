import { PageHeader } from "@/components/page-header";
import { DemoNotice } from "@/components/demo-notice";
import { ResourceCard } from "@/components/resource-card";
import { PlaceholderButton } from "@/components/placeholder-button";
import { findModuleById } from "@/lib/modules";

const MODULE = findModuleById("templates")!;

export const metadata = {
  title: `${MODULE.title} · MW Staff Hub`,
};

type Template = { title: string; description: string };

const TEMPLATE_GROUPS: { category: string; templates: Template[] }[] = [
  {
    category: "Transaction Records / Cash Records",
    templates: [
      {
        title: "Daily cash record",
        description:
          "Approved layout for recording daily cash takings and reconciliation.",
      },
      {
        title: "Transaction record sheet",
        description:
          "Standard transaction log for end-of-day reporting.",
      },
    ],
  },
  {
    category: "Rosters",
    templates: [
      {
        title: "Weekly roster template (v3)",
        description: "Current approved weekly roster format for all branches.",
      },
    ],
  },
  {
    category: "Trello",
    templates: [
      {
        title: "Proper way to create a Trello card",
        description:
          "Naming conventions, checklists, and labels for workshop job cards.",
      },
    ],
  },
  {
    category: "Order Forms",
    templates: [
      {
        title: "Custom order form example",
        description:
          "Worked example of a correctly completed custom order form.",
      },
      {
        title: "Invoice / order form example",
        description:
          "Reference for a properly formatted invoice and order form.",
      },
    ],
  },
  {
    category: "Procedures",
    templates: [
      {
        title: "Proper procedures handbook",
        description:
          "Step-by-step reference for common workshop and sales procedures.",
      },
    ],
  },
];

export default function TemplatesPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Templates & Documents · Demo"
        title={MODULE.title}
        description="Approved templates and reference examples for MW staff."
      />

      {TEMPLATE_GROUPS.map((group) => (
        <section key={group.category}>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            {group.category}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.templates.map((t) => (
              <ResourceCard
                key={t.title}
                title={t.title}
                description={t.description}
                status="Demo"
              >
                <PlaceholderButton
                  variant="secondary"
                  title="Demo only — viewer not connected yet."
                >
                  View
                </PlaceholderButton>
                <PlaceholderButton title="Demo only — download not connected yet.">
                  Download
                </PlaceholderButton>
              </ResourceCard>
            ))}
          </div>
        </section>
      ))}

      <DemoNotice>
        Demo only — templates are example entries. Viewing and downloading are
        not connected yet.
      </DemoNotice>
    </div>
  );
}
