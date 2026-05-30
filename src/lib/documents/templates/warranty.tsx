import { View } from "@react-pdf/renderer";
import {
  MWDocument,
  Section,
  FieldRow,
  Field,
  SignatureBlock,
} from "../branding/primitives";
import type { WarrantyData } from "../schemas/warranty";

export function WarrantyTemplate({ data }: { data: WarrantyData }) {
  return (
    <MWDocument
      title="Warranty Claim"
      meta={[`Invoice: ${data.invoiceNumber}`]}
    >
      <Section title="Customer & Sale">
        <FieldRow>
          <Field label="Customer name" value={data.customerName} width="100%" />
          <Field label="Invoice number" value={data.invoiceNumber} />
          <Field label="Purchase date" value={data.purchaseDate} />
          <Field label="Vehicle details" value={data.vehicleDetails} width="100%" />
        </FieldRow>
      </Section>

      <Section title="Claim Details">
        <FieldRow>
          <Field label="Product affected" value={data.productAffected} width="100%" />
          <Field label="Issue description" value={data.issueDescription} width="100%" />
          <Field label="Requested outcome" value={data.requestedOutcome} />
        </FieldRow>
      </Section>

      <Section title="Staff & Review">
        <FieldRow>
          <Field label="Staff member" value={data.staffMember} />
          <Field label="Manager review" value={data.managerReview} />
        </FieldRow>
        <View style={{ marginTop: 6 }}>
          <SignatureBlock labels={["Staff signature", "Manager signature"]} />
        </View>
      </Section>
    </MWDocument>
  );
}
