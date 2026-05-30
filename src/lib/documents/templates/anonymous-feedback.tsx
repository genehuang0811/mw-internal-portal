import { Text } from "@react-pdf/renderer";
import {
  MWDocument,
  Section,
  FieldRow,
  Field,
  Disclaimer,
} from "../branding/primitives";
import type { AnonymousFeedbackData } from "../schemas/anonymous-feedback";

export function AnonymousFeedbackTemplate({
  data,
}: {
  data: AnonymousFeedbackData;
}) {
  const anonymous = !data.contactName;
  return (
    <MWDocument
      title="Anonymous Complaint / Feedback"
      meta={[`${data.submissionType} · ${data.branch}`, `Urgency: ${data.urgency}`]}
    >
      <Section title="Submission">
        <FieldRow>
          <Field label="Type" value={data.submissionType} />
          <Field label="Branch" value={data.branch} />
          <Field label="Urgency" value={data.urgency} />
          <Field label="From" value={anonymous ? "Anonymous" : data.contactName} />
        </FieldRow>
      </Section>

      <Section title="Details">
        <Text>{data.details}</Text>
      </Section>

      {anonymous ? (
        <Disclaimer title="Anonymous submission">
          No contact name was provided. This submission was made anonymously
          through the MW Staff Hub.
        </Disclaimer>
      ) : null}
    </MWDocument>
  );
}
