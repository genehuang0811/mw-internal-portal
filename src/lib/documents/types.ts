import type { ZodType } from "zod";

/** Output formats the engine can produce for a document. */
export type Format = "pdf" | "docx" | "xlsx";

/** Office Open XML / PDF content types, keyed by format. */
export const CONTENT_TYPE: Record<Format, string> = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

export const EXT: Record<Format, string> = {
  pdf: "pdf",
  docx: "docx",
  xlsx: "xlsx",
};

/** A single rendered file (bytes + metadata) for one format. */
export type RenderedFile = {
  format: Format;
  buffer: Buffer;
  filename: string;
  contentType: string;
};

/** Renders one format of a document from validated data. */
export type FormatRenderer<TOut> = {
  format: Format;
  ext: string;
  contentType: string;
  render: (data: TOut) => Promise<Buffer>;
};

/**
 * A document type the engine knows how to produce. Each definition carries one
 * renderer per supported format (PDF/Word/Excel) plus its email routing, so the
 * engine and the send route never change when a new document is added.
 *
 * `TIn` is the raw form shape; `TOut` is the validated/transformed data.
 */
export type DocumentDefinition<TIn = unknown, TOut = TIn> = {
  slug: string;
  title: string;
  schema: ZodType<TOut, TIn>;
  /** One renderer per supported format; the first entry is the primary one. */
  formats: FormatRenderer<TOut>[];
  /** Base filename without extension, e.g. "MW-Warranty-INV200-2026-05-30". */
  buildBaseName: (data: TOut) => string;
  /** Where this document is emailed. */
  recipients: string[];
  /** Email subject line for this document. */
  emailSubject: (data: TOut) => string;
  /** Optional one-line plain-text summary shown in the email body. */
  emailSummary?: (data: TOut) => string;
};
