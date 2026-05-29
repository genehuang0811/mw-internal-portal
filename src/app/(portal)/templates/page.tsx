import { PageHeader } from "@/components/page-header";
import { DemoNotice } from "@/components/demo-notice";
import { ResourceCard } from "@/components/resource-card";
import { PlaceholderButton } from "@/components/placeholder-button";
import { findModuleById } from "@/lib/modules";
import { moduleIcon, CATEGORY_META } from "@/lib/icons";

const MODULE = findModuleById("templates")!;

export const metadata = {
  title: `${MODULE.title} · MW Staff Hub`,
};

type Template = {
  title: string;
  description: string;
  fileType: string;
  updated: string;
  owner: string;
};

const TEMPLATE_GROUPS: { category: string; templates: Template[] }[] = [
  {
    category: "Transaction Records / Cash Records",
    templates: [
      {
        title: "Daily cash record",
        description:
          "Approved layout for recording daily cash takings and reconciliation.",
        fileType: "XLSX",
        updated: "15 May 2026",
        owner: "Accounts Team",
      },
      {
        title: "Transaction record sheet",
        description: "Standard transaction log for end-of-day reporting.",
        fileType: "XLSX",
        updated: "2 May 2026",
        owner: "Accounts Team",
      },
    ],
  },
  {
    category: "Rosters",
    templates: [
      {
        title: "Weekly roster template (v3)",
        description: "Current approved weekly roster format for all branches.",
        fileType: "XLSX",
        updated: "10 May 2026",
        owner: "Operations",
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
        fileType: "Guide",
        updated: "28 Apr 2026",
        owner: "Workshop Lead",
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
        fileType: "PDF",
        updated: "6 May 2026",
        owner: "Sales Team",
      },
      {
        title: "Invoice / order form example",
        description:
          "Reference for a properly formatted invoice and order form.",
        fileType: "PDF",
        updated: "6 May 2026",
        owner: "Sales Team",
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
        fileType: "DOCX",
        updated: "20 Apr 2026",
        owner: "Management",
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
        icon={moduleIcon("templates")}
        iconAccent={CATEGORY_META["Templates & Documents"].accent}
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
                fileType={t.fileType}
                status="Demo"
                meta={
                  <>
                    <p>Last updated: {t.updated}</p>
                    <p>Owner: {t.owner}</p>
                  </>
                }
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
