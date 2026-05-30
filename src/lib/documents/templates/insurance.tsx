import {
  MWDocument,
  Section,
  FieldRow,
  Field,
} from "../branding/primitives";
import type { InsuranceData } from "../schemas/insurance";

function money(v: string): string {
  if (!v) return "";
  const n = Number(v);
  return Number.isNaN(n) ? v : `$${n.toLocaleString("en-AU")}`;
}

export function InsuranceTemplate({ data }: { data: InsuranceData }) {
  return (
    <MWDocument
      title="Insurance Claim"
      meta={[`Claim: ${data.claimNumber}`, `Insurer: ${data.insurer}`]}
    >
      <Section title="Claim & Insurer">
        <FieldRow>
          <Field label="Claim number" value={data.claimNumber} />
          <Field label="Insurer" value={data.insurer} />
        </FieldRow>
      </Section>

      <Section title="Customer & Vehicle">
        <FieldRow>
          <Field label="Customer name" value={data.customerName} width="100%" />
          <Field label="Vehicle details" value={data.vehicleDetails} width="100%" />
        </FieldRow>
      </Section>

      <Section title="Damage & Assessment">
        <FieldRow>
          <Field label="Damage description" value={data.damageDescription} width="100%" />
          <Field label="Assessor name" value={data.assessorName} />
          <Field label="Assessor contact" value={data.assessorContact} />
        </FieldRow>
      </Section>

      <Section title="Financials">
        <FieldRow>
          <Field label="Excess amount" value={money(data.excessAmount)} />
          <Field label="Approved repair amount" value={money(data.approvedRepairAmount)} />
          {data.notes ? (
            <Field label="Notes" value={data.notes} width="100%" />
          ) : null}
        </FieldRow>
      </Section>
    </MWDocument>
  );
}
