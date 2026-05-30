"use client";

import { useState } from "react";
import {
  Section,
  Field,
  Input,
  Textarea,
  Select,
  Buttons,
  NoticeBanner,
  validateForm,
  scrollToFirstError,
  type Notice,
} from "./capture/form-ui";
import { submitDocument, sentMessage } from "@/lib/submit-document";
import { warrantySchema } from "@/lib/documents/schemas/warranty";

const OUTCOMES = ["Repair", "Replacement", "Refund", "Credit note"];

const EMPTY = {
  customerName: "",
  invoiceNumber: "",
  purchaseDate: "",
  vehicleDetails: "",
  productAffected: "",
  issueDescription: "",
  requestedOutcome: "",
  staffMember: "",
  managerReview: "",
};

export function WarrantyForm() {
  const [v, setV] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: keyof typeof EMPTY) => (val: string) => {
    setV((s) => ({ ...s, [k]: val }));
    if (errors[k]) {
      setErrors((e) => {
        const rest = { ...e };
        delete rest[k];
        return rest;
      });
    }
  };

  function reset() {
    setV(EMPTY);
    setNotice(null);
    setErrors({});
  }

  async function onGenerate() {
    setNotice(null);
    const result = validateForm(warrantySchema, v);
    if (!result.ok) {
      setErrors(result.errors);
      setNotice({
        kind: "error",
        message: "Please fix the highlighted fields and try again.",
      });
      scrollToFirstError(result.errors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const sent = await submitDocument("warranty", v);
      setNotice(
        sent.ok
          ? { kind: "success", message: sentMessage(sent) }
          : { kind: "error", message: sent.error },
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form noValidate onSubmit={(e) => e.preventDefault()} className="space-y-6">
      <NoticeBanner notice={notice} />

      <Section number={1} title="Customer & Sale">
        <Field id="customerName" label="Customer name" required full error={errors.customerName}>
          <Input value={v.customerName} onChange={set("customerName")} />
        </Field>
        <Field id="invoiceNumber" label="Invoice number" required error={errors.invoiceNumber}>
          <Input value={v.invoiceNumber} onChange={set("invoiceNumber")} placeholder="e.g. INV-2048" />
        </Field>
        <Field id="purchaseDate" label="Purchase date" error={errors.purchaseDate}>
          <Input value={v.purchaseDate} onChange={set("purchaseDate")} type="date" />
        </Field>
        <Field id="vehicleDetails" label="Vehicle details" full error={errors.vehicleDetails}>
          <Input
            value={v.vehicleDetails}
            onChange={set("vehicleDetails")}
            placeholder="Year / Make / Model / Rego"
          />
        </Field>
      </Section>

      <Section number={2} title="Claim Details">
        <Field id="productAffected" label="Product affected" required full error={errors.productAffected}>
          <Input value={v.productAffected} onChange={set("productAffected")} placeholder="e.g. Tow bar assembly" />
        </Field>
        <Field id="issueDescription" label="Issue description" required full error={errors.issueDescription}>
          <Textarea
            value={v.issueDescription}
            onChange={set("issueDescription")}
            placeholder="Describe the fault or issue"
          />
        </Field>
        <Field id="requestedOutcome" label="Requested outcome" required error={errors.requestedOutcome}>
          <Select value={v.requestedOutcome} onChange={set("requestedOutcome")} options={OUTCOMES} />
        </Field>
      </Section>

      <Section number={3} title="Staff & Review">
        <Field id="staffMember" label="Staff member" required error={errors.staffMember}>
          <Input value={v.staffMember} onChange={set("staffMember")} placeholder="e.g. Sarah Lee" />
        </Field>
        <Field id="managerReview" label="Manager review" error={errors.managerReview}>
          <Input value={v.managerReview} onChange={set("managerReview")} placeholder="e.g. Tom Nguyen" />
        </Field>
      </Section>

      <Buttons submitting={submitting} onReset={reset} onGenerate={onGenerate} label="Send warranty claim" />
    </form>
  );
}
