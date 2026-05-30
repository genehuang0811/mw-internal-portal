import {
  MWDocument,
  Section,
  FieldRow,
  Field,
  Note,
} from "../branding/primitives";
import {
  currentStatuses,
  isReimbursement,
  money,
  PROCUREMENT_STATUSES,
  type ProcurementData,
} from "../schemas/procurement";

export function ProcurementTemplate({ data }: { data: ProcurementData }) {
  const reimbursement = isReimbursement(data.requestType);
  const statuses = currentStatuses(data.requestType);

  return (
    <MWDocument
      title="Procurement & Reimbursement Request"
      meta={[`Ref: ${data.requestNumber}`, data.requestType]}
    >
      <Section title="Request">
        <FieldRow>
          <Field label="Request type" value={data.requestType} />
          <Field label="Request number" value={data.requestNumber} />
          <Field label="Request title" value={data.requestTitle} width="100%" />
          <Field label="Category" value={data.category} />
          <Field label="Priority" value={data.priority} />
          <Field label="Date requested" value={data.dateRequested} />
          <Field label="Required by" value={data.requiredByDate} />
          <Field label="Estimated cost" value={money(data.estimatedCost)} />
        </FieldRow>
      </Section>

      <Section title="Requester">
        <FieldRow>
          <Field label="Staff name" value={data.staffName} />
          <Field label="Branch" value={data.branch} />
          <Field label="Department" value={data.department} />
        </FieldRow>
      </Section>

      <Section title="Details">
        <FieldRow>
          <Field label="Item description" value={data.itemDescription} width="100%" />
          <Field
            label="Business justification"
            value={data.businessJustification}
            width="100%"
          />
        </FieldRow>
      </Section>

      <Section title="Supplier">
        <FieldRow>
          <Field label="Supplier name" value={data.supplierName} />
          <Field label="Supplier website / link" value={data.supplierLink} />
        </FieldRow>
      </Section>

      {reimbursement ? (
        <Section title="Staff Purchase & Reimbursement Details">
          <FieldRow>
            <Field
              label="Reason self-purchase is required"
              value={data.reasonSelfPurchase}
              width="100%"
            />
            <Field label="Purchase date" value={data.purchaseDate} />
            <Field label="Amount paid" value={money(data.amountPaid)} />
            <Field label="Receipt filename / reference" value={data.receiptRef} />
            <Field label="Tax invoice filename / reference" value={data.taxInvoiceRef} />
            <Field
              label="Proof of payment filename / reference"
              value={data.proofOfPaymentRef}
              width="100%"
            />
            {data.managerNotes ? (
              <Field label="Manager notes" value={data.managerNotes} width="100%" />
            ) : null}
          </FieldRow>
        </Section>
      ) : (
        <Section title="Procurement Purchase Details">
          <FieldRow>
            <Field label="Preferred supplier" value={data.preferredSupplier} />
            <Field label="Quote filename / reference" value={data.quoteRef} />
            <Field
              label="Supporting documents reference"
              value={data.supportingDocsRef}
              width="100%"
            />
            {data.procurementNotes ? (
              <Field label="Procurement notes" value={data.procurementNotes} width="100%" />
            ) : null}
          </FieldRow>
          <Note>
            File uploads are not attached in this version — references above are
            recorded for follow-up. A future version may attach the quote and
            supporting files to the email.
          </Note>
        </Section>
      )}

      <Section title="Approval Status">
        <FieldRow>
          <Field label="Current status" value={statuses.join("  ·  ")} width="100%" />
        </FieldRow>
        <Note>
          Workflow: {PROCUREMENT_STATUSES.join("  »  ")}.
        </Note>
      </Section>

      {data.additionalNotes ? (
        <Section title="Notes">
          <FieldRow>
            <Field label="Additional notes" value={data.additionalNotes} width="100%" />
          </FieldRow>
        </Section>
      ) : null}
    </MWDocument>
  );
}
