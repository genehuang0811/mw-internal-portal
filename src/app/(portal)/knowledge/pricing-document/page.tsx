import { PageHeader } from "@/components/page-header";
import { DemoNotice } from "@/components/demo-notice";
import { PlaceholderButton } from "@/components/placeholder-button";
import { findModuleById } from "@/lib/modules";

const MODULE = findModuleById("pricing-document")!;

export const metadata = {
  title: `${MODULE.title} · MW Staff Hub`,
};

const SECTIONS = [
  {
    title: "Canopies",
    rows: [
      ["Standard canopy — single cab", "From $3,150"],
      ["Standard canopy — dual cab", "From $3,450"],
      ["Premium canopy — dual cab", "From $4,290"],
    ],
  },
  {
    title: "Trays",
    rows: [
      ["Alloy tray — single cab", "From $2,480"],
      ["Alloy tray — dual cab", "From $2,690"],
      ["Heavy-duty steel tray", "From $3,120"],
    ],
  },
  {
    title: "Accessories",
    rows: [
      ["Roof rack set", "From $640"],
      ["Drawer system", "From $1,180"],
      ["Ladder rack", "From $390"],
    ],
  },
];

export default function PricingDocumentPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Knowledge Base · Demo"
        title={MODULE.title}
        description="The current MW pricing document. View placeholder content below."
        actions={
          <>
            <PlaceholderButton
              variant="secondary"
              title="Demo only — document viewer not connected yet."
            >
              View document
            </PlaceholderButton>
            <PlaceholderButton title="Demo only — download not connected yet.">
              Download latest
            </PlaceholderButton>
          </>
        }
      />

      <div className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div>
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
            MW Pricing Document — 2025 Edition
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Placeholder preview · last updated (demo) today
          </p>
        </div>
        <PlaceholderButton
          variant="secondary"
          title="Future version will connect pricing questions to MW AI Assistant."
        >
          Ask AI about pricing
        </PlaceholderButton>
      </div>

      <div className="space-y-4">
        {SECTIONS.map((section) => (
          <div
            key={section.title}
            className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="border-b border-zinc-200 px-5 py-3 dark:border-zinc-800">
              <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                {section.title}
              </h2>
            </div>
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {section.rows.map(([item, price]) => (
                  <tr key={item}>
                    <td className="px-5 py-3 text-zinc-700 dark:text-zinc-300">
                      {item}
                    </td>
                    <td className="px-5 py-3 text-right font-medium text-zinc-900 dark:text-zinc-100">
                      {price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <DemoNotice>
        Demo only — pricing figures are example content. Viewing, downloading,
        and AI pricing queries are not connected yet.
      </DemoNotice>
    </div>
  );
}
