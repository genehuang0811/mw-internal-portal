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
import {
  anonymousFeedbackSchema,
  SUBMISSION_TYPES,
  URGENCY_LEVELS,
  FEEDBACK_BRANCHES,
} from "@/lib/documents/schemas/anonymous-feedback";

const EMPTY = {
  submissionType: "",
  branch: "",
  urgency: "",
  contactName: "",
  details: "",
};

export function AnonymousFeedbackForm() {
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
    const result = validateForm(anonymousFeedbackSchema, v);
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
      const sent = await submitDocument("anonymous-feedback", v);
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

      <div className="rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400">
        Submissions are anonymous unless you add your name. Prefer to talk to
        someone? Email support@mwmanufacturing.com.au or speak to your manager.
      </div>

      <Section number={1} title="Submission">
        <Field id="submissionType" label="Submission type" required error={errors.submissionType}>
          <Select
            value={v.submissionType}
            onChange={set("submissionType")}
            options={[...SUBMISSION_TYPES]}
          />
        </Field>
        <Field id="branch" label="Branch" required error={errors.branch}>
          <Select value={v.branch} onChange={set("branch")} options={[...FEEDBACK_BRANCHES]} />
        </Field>
        <Field id="urgency" label="Urgency" required error={errors.urgency}>
          <Select value={v.urgency} onChange={set("urgency")} options={[...URGENCY_LEVELS]} />
        </Field>
        <Field id="contactName" label="Your name (optional)" error={errors.contactName}>
          <Input
            value={v.contactName}
            onChange={set("contactName")}
            placeholder="Leave blank to stay anonymous"
          />
        </Field>
      </Section>

      <Section number={2} title="Details">
        <Field id="details" label="Details" required full error={errors.details}>
          <Textarea
            value={v.details}
            onChange={set("details")}
            rows={5}
            placeholder="Tell us what's on your mind"
          />
        </Field>
      </Section>

      <Buttons submitting={submitting} onReset={reset} onGenerate={onGenerate} label="Submit anonymously" />
    </form>
  );
}
