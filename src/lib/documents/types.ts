import type { ZodType } from "zod";

/** The bytes + metadata produced by generating a document. */
export type RenderResult = {
  buffer: Buffer;
  filename: string;
  contentType: string;
};

/**
 * A single document type the engine knows how to produce. The renderer is
 * encapsulated in `render` (e.g. react-pdf today; pdf-template or xlsx later),
 * so the engine and route never change when a new document is added.
 *
 * `TIn` is the raw form shape; `TOut` is the validated/transformed data the
 * template consumes.
 */
export type DocumentDefinition<TIn = unknown, TOut = TIn> = {
  slug: string;
  title: string;
  schema: ZodType<TOut, TIn>;
  contentType: string;
  render: (data: TOut) => Promise<Buffer>;
  buildFilename: (data: TOut) => string;
};
