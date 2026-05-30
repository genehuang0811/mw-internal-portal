import { renderToBuffer } from "@react-pdf/renderer";
import type { ReactElement } from "react";

/** Render a react-pdf document element to a PDF Buffer (server-side). */
export async function renderPdf(element: ReactElement): Promise<Buffer> {
  const out = await renderToBuffer(
    element as Parameters<typeof renderToBuffer>[0],
  );
  return Buffer.from(out);
}
