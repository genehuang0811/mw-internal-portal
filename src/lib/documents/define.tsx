import type { ReactElement } from "react";
import type { ZodType } from "zod";
import { renderPdf } from "./renderers/react-pdf";
import { CONTENT_TYPE, EXT } from "./types";
import type { DocumentDefinition, FormatRenderer } from "./types";

/**
 * Factory for a multi-format DocumentDefinition. A new document = a schema, a
 * PDF template (always), optional Word/Excel renderers, email routing, and a
 * filename builder. The engine and the send route never change.
 *
 * `pdf` returns a react-pdf element; `docx`/`xlsx` return a Buffer directly
 * (built with the docx-kit / xlsx-kit helpers).
 */
export function defineDocument<TIn, TOut>(opts: {
  slug: string;
  title: string;
  schema: ZodType<TOut, TIn>;
  recipients: string[];
  buildBaseName: (data: TOut) => string;
  emailSubject: (data: TOut) => string;
  emailSummary?: (data: TOut) => string;
  pdf: (data: TOut) => ReactElement;
  docx?: (data: TOut) => Promise<Buffer>;
  xlsx?: (data: TOut) => Promise<Buffer>;
}): DocumentDefinition<TIn, TOut> {
  const formats: FormatRenderer<TOut>[] = [
    {
      format: "pdf",
      ext: EXT.pdf,
      contentType: CONTENT_TYPE.pdf,
      render: (d) => renderPdf(opts.pdf(d)),
    },
  ];
  if (opts.docx) {
    formats.push({ format: "docx", ext: EXT.docx, contentType: CONTENT_TYPE.docx, render: opts.docx });
  }
  if (opts.xlsx) {
    formats.push({ format: "xlsx", ext: EXT.xlsx, contentType: CONTENT_TYPE.xlsx, render: opts.xlsx });
  }

  return {
    slug: opts.slug,
    title: opts.title,
    schema: opts.schema,
    formats,
    buildBaseName: opts.buildBaseName,
    recipients: opts.recipients,
    emailSubject: opts.emailSubject,
    emailSummary: opts.emailSummary,
  };
}
