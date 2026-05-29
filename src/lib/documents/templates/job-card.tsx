import { View } from "@react-pdf/renderer";
import {
  MWDocument,
  Section,
  FieldRow,
  Field,
  SignatureBlock,
} from "../branding/primitives";
import type { JobCardData } from "../schemas/job-card";

export function JobCardTemplate({ data }: { data: JobCardData }) {
  return (
    <MWDocument
      title="Workshop Job Card"
      meta={[`Job: ${data.jobNumber}`, `Start: ${data.startDate}`]}
    >
      <Section title="Job & Customer">
        <FieldRow>
          <Field label="Job number" value={data.jobNumber} />
          <Field label="Customer" value={data.customer} />
          <Field label="Vehicle" value={data.vehicle} width="100%" />
        </FieldRow>
      </Section>

      <Section title="Work Scope">
        <FieldRow>
          <Field label="Work required" value={data.workRequired} width="100%" />
          <Field label="Parts required" value={data.partsRequired} width="100%" />
        </FieldRow>
      </Section>

      <Section title="Scheduling">
        <FieldRow>
          <Field label="Installer assigned" value={data.installer} />
          <Field label="Estimated hours" value={data.estimatedHours} />
          <Field label="Start date" value={data.startDate} />
          <Field label="Completion notes" value={data.completionNotes} width="100%" />
        </FieldRow>
      </Section>

      <Section title="Sign-off">
        <View style={{ marginTop: 2 }}>
          <SignatureBlock labels={["Installer signature", "Workshop manager"]} />
        </View>
      </Section>
    </MWDocument>
  );
}
