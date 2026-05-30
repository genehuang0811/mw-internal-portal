/**
 * Email routing for generated documents. Each document type is sent to one or
 * more inboxes. Update these addresses as real MW inboxes are provided — some
 * modules can route to multiple recipients.
 *
 * Until real inboxes exist, everything goes to the default below.
 */
const DEFAULT = ["gene.huang0811@gmail.com"];

export const RECIPIENTS: Record<string, string[]> = {
  "vehicle-inspection": [...DEFAULT],
  warranty: [...DEFAULT],
  "annual-leave": [...DEFAULT],
  "job-card": [...DEFAULT],
  "anonymous-feedback": [...DEFAULT],
};

/** Recipients for a document slug, falling back to the default inbox. */
export function recipientsFor(slug: string): string[] {
  return RECIPIENTS[slug] ?? [...DEFAULT];
}
