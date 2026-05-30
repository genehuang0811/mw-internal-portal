import { Resend } from "resend";

export type EmailAttachment = {
  filename: string;
  content: Buffer;
};

export type SendEmailInput = {
  to: string[];
  subject: string;
  /** Plain-text body; an HTML version is derived from it. */
  text: string;
  attachments: EmailAttachment[];
};

export type SendEmailResult =
  | { ok: true; id: string | null }
  | { ok: false; error: string };

/**
 * From address. Set MAIL_FROM once a sender domain is verified in Resend
 * (e.g. "MW Staff Hub <forms@mwmanufacturing.com.au>"). Until then Resend's
 * onboarding sender is used, which only delivers to the account owner's address.
 */
function fromAddress(): string {
  return process.env.MAIL_FROM ?? "MW Staff Hub <onboarding@resend.dev>";
}

function htmlFromText(text: string): string {
  const body = text
    .split("\n")
    .map((line) => (line.trim() === "" ? "<br/>" : `<p style="margin:0 0 8px">${escapeHtml(line)}</p>`))
    .join("");
  return `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#334155">${body}</div>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Send an email with attachments via Resend. Returns a structured result rather
 * than throwing, so callers can surface a clean message. Requires RESEND_API_KEY.
 */
export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return {
      ok: false,
      error:
        "Email is not configured yet (RESEND_API_KEY is missing). Add it to the environment to enable sending.",
    };
  }
  if (input.to.length === 0) {
    return { ok: false, error: "No recipient configured for this document." };
  }

  const resend = new Resend(apiKey);
  try {
    const { data, error } = await resend.emails.send({
      from: fromAddress(),
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: htmlFromText(input.text),
      attachments: input.attachments.map((a) => ({
        filename: a.filename,
        content: a.content,
      })),
    });
    if (error) {
      return { ok: false, error: error.message ?? "Email provider rejected the message." };
    }
    return { ok: true, id: data?.id ?? null };
  } catch (e) {
    const error = e instanceof Error ? e.message : "Failed to send email.";
    return { ok: false, error };
  }
}
