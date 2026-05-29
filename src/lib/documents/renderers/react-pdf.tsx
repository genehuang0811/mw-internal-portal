import { renderToBuffer } from "@react-pdf/renderer";
import type { ReactElement } from "react";
import type { ZodType } from "zod";
import type { DocumentDefinition } from "../types";

/** Render a react-pdf document element to a PDF Buffer (server-side). */
export async function renderPdf(element: ReactElement): Promise<Buffer> {
  const out = await renderToBuffer(
    element as Parameters<typeof renderToBuffer>[0],
  );
  return Buffer.from(out);
}

/**
 * Factory for a PDF-backed DocumentDefinition. A new PDF document = a schema,
 * a Template component, and a filename builder. Nothing else changes.
 */
export function pdfDocument<TIn, TOut>(opts: {
  slug: string;
  title: string;
  schema: ZodType<TOut, TIn>;
  Template: (props: { data: TOut }) => ReactElement;
  buildFilename: (data: TOut) => string;
}): DocumentDefinition<TIn, TOut> {
  const { slug, title, schema, Template, buildFilename } = opts;
  return {
    slug,
    title,
    schema,
    contentType: "application/pdf",
    buildFilename,
    render: (data: TOut) => renderPdf(<Template data={data} />),
  };
}
