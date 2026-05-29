import { Badge, type BadgeTone } from "./badge";

export type PanelItem = {
  title: string;
  meta?: string;
  tag?: string;
  tagTone?: BadgeTone;
};

/**
 * A titled panel listing short items — used for "Important notices" and
 * "Recently updated" on the dashboard.
 */
export function InfoPanel({
  title,
  items,
  emptyText = "Nothing to show.",
}: {
  title: string;
  items: PanelItem[];
  emptyText?: string;
}) {
  return (
    <section className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="border-b border-zinc-200 px-5 py-3 dark:border-zinc-800">
        <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {title}
        </h2>
      </div>
      {items.length === 0 ? (
        <p className="px-5 py-6 text-sm text-zinc-500 dark:text-zinc-400">
          {emptyText}
        </p>
      ) : (
        <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 px-5 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {item.title}
                </p>
                {item.meta && (
                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                    {item.meta}
                  </p>
                )}
              </div>
              {item.tag && (
                <Badge tone={item.tagTone ?? "zinc"}>{item.tag}</Badge>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
