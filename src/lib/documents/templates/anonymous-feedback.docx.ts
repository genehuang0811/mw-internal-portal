import {
  buildDocx,
  docHeading,
  docFields,
  docText,
  docDisclaimer,
  type DocxBlock,
} from "../branding/docx-kit";
import type { AnonymousFeedbackData } from "../schemas/anonymous-feedback";

export async function anonymousFeedbackDocx(
  d: AnonymousFeedbackData,
): Promise<Buffer> {
  const anonymous = !d.contactName;
  const body: DocxBlock[] = [
    docHeading("Submission"),
    docFields([
      ["Type", d.submissionType],
      ["Branch", d.branch],
      ["Urgency", d.urgency],
      ["From", anonymous ? "Anonymous" : d.contactName],
    ]),
    docHeading("Details"),
    docText(d.details),
  ];

  if (anonymous) {
    body.push(
      docDisclaimer(
        "Anonymous submission",
        "No contact name was provided. This submission was made anonymously through the MW Staff Hub.",
      ),
    );
  }

  return buildDocx({
    title: "Anonymous Complaint / Feedback",
    meta: [`${d.submissionType} · ${d.branch}`, `Urgency: ${d.urgency}`],
    body,
  });
}
