import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  Header,
  Footer,
  BorderStyle,
  WidthType,
  VerticalAlign,
  PageNumber,
  TabStopType,
} from "docx";
import { BRAND } from "./theme";

/** A top-level Word block. */
export type DocxBlock = Paragraph | Table;

/** MW brand colors as Word hex (no leading #), aligned with the PDF theme. */
const C = {
  ink: "0F172A",
  body: "334155",
  muted: "64748B",
  faint: "94A3B8",
  accent: "1D4ED8",
  line: "E2E8F0",
  subtle: "F1F5F9",
  white: "FFFFFF",
  warnBg: "FFFBEB",
  warnLine: "FCD34D",
  warnInk: "92400E",
} as const;

const FONT = "Arial";

// Word font sizes are in half-points.
const SZ = {
  title: 32,
  heading: 20,
  label: 16,
  value: 20,
  small: 15,
  brand: 18,
};

const NO_BORDER = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" } as const;
const NO_BORDERS = {
  top: NO_BORDER,
  bottom: NO_BORDER,
  left: NO_BORDER,
  right: NO_BORDER,
  insideHorizontal: NO_BORDER,
  insideVertical: NO_BORDER,
};
const cellLine = { style: BorderStyle.SINGLE, size: 4, color: C.line } as const;

const EM_DASH = "—";

function text(value: string | undefined): string {
  const v = (value ?? "").toString().trim();
  return v === "" ? EM_DASH : v;
}

/** Section heading: a shaded bar with bold uppercase title. */
export function docHeading(title: string): Paragraph {
  return new Paragraph({
    spacing: { before: 220, after: 100 },
    shading: { fill: C.subtle },
    border: { left: { style: BorderStyle.SINGLE, size: 18, color: C.accent } },
    children: [
      new TextRun({
        text: title.toUpperCase(),
        bold: true,
        color: C.ink,
        size: SZ.heading,
        font: FONT,
        characterSpacing: 8,
      }),
    ],
  });
}

/** A plain body paragraph. */
export function docText(value: string, opts?: { muted?: boolean }): Paragraph {
  return new Paragraph({
    spacing: { after: 60 },
    children: [
      new TextRun({
        text: value,
        size: SZ.value,
        font: FONT,
        color: opts?.muted ? C.muted : C.body,
      }),
    ],
  });
}

export function docNote(value: string): Paragraph {
  return new Paragraph({
    spacing: { after: 60 },
    children: [
      new TextRun({ text: value, size: SZ.small, font: FONT, color: C.muted, italics: true }),
    ],
  });
}

function labelValueRow(label: string, value: string): TableRow {
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 32, type: WidthType.PERCENTAGE },
        borders: { ...NO_BORDERS, bottom: cellLine },
        margins: { top: 60, bottom: 60, left: 0, right: 120 },
        verticalAlign: VerticalAlign.TOP,
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: label.toUpperCase(),
                bold: true,
                color: C.muted,
                size: SZ.label,
                font: FONT,
                characterSpacing: 6,
              }),
            ],
          }),
        ],
      }),
      new TableCell({
        width: { size: 68, type: WidthType.PERCENTAGE },
        borders: { ...NO_BORDERS, bottom: cellLine },
        margins: { top: 60, bottom: 60, left: 0, right: 0 },
        verticalAlign: VerticalAlign.TOP,
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: value, color: C.ink, size: SZ.value, font: FONT }),
            ],
          }),
        ],
      }),
    ],
  });
}

/** A two-column label/value grid. Pass [label, value] pairs. */
export function docFields(pairs: Array<[string, string | undefined]>): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: NO_BORDERS,
    rows: pairs.map(([l, v]) => labelValueRow(l, text(v))),
  });
}

/** A bordered data table with a shaded header row. */
export function docTable(columns: string[], rows: string[][]): Table {
  const headerCells = columns.map(
    (c) =>
      new TableCell({
        shading: { fill: C.subtle },
        margins: { top: 80, bottom: 80, left: 100, right: 100 },
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: c.toUpperCase(),
                bold: true,
                color: C.muted,
                size: SZ.label,
                font: FONT,
                characterSpacing: 4,
              }),
            ],
          }),
        ],
      }),
  );

  const bodyRows = rows.map(
    (r) =>
      new TableRow({
        children: r.map(
          (cell) =>
            new TableCell({
              margins: { top: 70, bottom: 70, left: 100, right: 100 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: cell, color: C.ink, size: SZ.value, font: FONT }),
                  ],
                }),
              ],
            }),
        ),
      }),
  );

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: cellLine,
      bottom: cellLine,
      left: cellLine,
      right: cellLine,
      insideHorizontal: cellLine,
      insideVertical: cellLine,
    },
    rows: [new TableRow({ tableHeader: true, children: headerCells }), ...bodyRows],
  });
}

/** An amber disclaimer/callout box. */
export function docDisclaimer(title: string, body: string): Table {
  const warn = { style: BorderStyle.SINGLE, size: 6, color: C.warnLine } as const;
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: { top: warn, bottom: warn, left: warn, right: warn, insideHorizontal: warn, insideVertical: warn },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { fill: C.warnBg },
            margins: { top: 120, bottom: 120, left: 140, right: 140 },
            children: [
              new Paragraph({
                spacing: { after: 40 },
                children: [
                  new TextRun({ text: title, bold: true, color: C.warnInk, size: SZ.value, font: FONT }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: body, color: C.warnInk, size: SZ.small, font: FONT }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

/** A row of signature lines, one per label. */
export function docSignatures(labels: string[]): Table {
  const blankLine = { style: BorderStyle.SINGLE, size: 6, color: C.ink } as const;
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: NO_BORDERS,
    rows: [
      new TableRow({
        children: labels.map(
          (label) =>
            new TableCell({
              width: { size: Math.floor(100 / labels.length), type: WidthType.PERCENTAGE },
              borders: { ...NO_BORDERS },
              margins: { top: 80, bottom: 0, left: 0, right: 200 },
              children: [
                // Blank signing space with an underline.
                new Paragraph({
                  spacing: { before: 360 },
                  border: { bottom: blankLine },
                  children: [new TextRun({ text: "", font: FONT })],
                }),
                new Paragraph({
                  spacing: { before: 40 },
                  children: [
                    new TextRun({
                      text: label.toUpperCase(),
                      color: C.muted,
                      size: SZ.label,
                      font: FONT,
                      characterSpacing: 6,
                    }),
                  ],
                }),
              ],
            }),
        ),
      }),
    ],
  });
}

/** Vertical spacing between blocks. */
export function docSpacer(): Paragraph {
  return new Paragraph({ spacing: { after: 80 }, children: [] });
}

function brandHeader(): Header {
  return new Header({
    children: [
      new Paragraph({
        border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: C.ink } },
        spacing: { after: 80 },
        children: [
          new TextRun({ text: `${BRAND.wordmark} `, bold: true, color: C.ink, size: SZ.brand, font: FONT }),
          new TextRun({ text: ` ${BRAND.company}`, bold: true, color: C.ink, size: SZ.value, font: FONT }),
          new TextRun({ text: "    ·    INTERNAL DOCUMENT", color: C.muted, size: SZ.label, font: FONT, characterSpacing: 6 }),
        ],
      }),
    ],
  });
}

function brandFooter(): Footer {
  return new Footer({
    children: [
      new Paragraph({
        border: { top: { style: BorderStyle.SINGLE, size: 6, color: C.line } },
        spacing: { before: 60 },
        tabStops: [{ type: TabStopType.RIGHT, position: 10100 }],
        children: [
          new TextRun({ text: `${BRAND.company} — Confidential`, color: C.faint, size: SZ.small, font: FONT }),
          new TextRun({ text: "\t", font: FONT }),
          new TextRun({ text: "Page ", color: C.faint, size: SZ.small, font: FONT }),
          new TextRun({ children: [PageNumber.CURRENT], color: C.faint, size: SZ.small, font: FONT }),
          new TextRun({ text: " of ", color: C.faint, size: SZ.small, font: FONT }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], color: C.faint, size: SZ.small, font: FONT }),
        ],
      }),
    ],
  });
}

/** Build a branded MW Word document from a title, meta lines, and body blocks. */
export async function buildDocx(opts: {
  title: string;
  meta?: string[];
  body: DocxBlock[];
}): Promise<Buffer> {
  const titleBlock: Paragraph[] = [
    new Paragraph({
      spacing: { after: opts.meta && opts.meta.length ? 40 : 160 },
      children: [
        new TextRun({ text: opts.title, bold: true, color: C.ink, size: SZ.title, font: FONT }),
      ],
    }),
    ...(opts.meta ?? []).map(
      (m, i) =>
        new Paragraph({
          spacing: { after: i === (opts.meta!.length - 1) ? 160 : 20 },
          children: [new TextRun({ text: m, color: C.muted, size: SZ.small, font: FONT })],
        }),
    ),
  ];

  const doc = new Document({
    creator: BRAND.company,
    title: opts.title,
    styles: { default: { document: { run: { font: FONT, color: C.body } } } },
    sections: [
      {
        properties: { page: { margin: { top: 720, bottom: 720, left: 900, right: 900 } } },
        headers: { default: brandHeader() },
        footers: { default: brandFooter() },
        children: [...titleBlock, ...opts.body],
      },
    ],
  });

  const out = await Packer.toBuffer(doc);
  return Buffer.from(out);
}
