import ExcelJS from "exceljs";
import { BRAND } from "./theme";

/** MW brand colors as ARGB (exceljs wants the leading alpha byte). */
const C = {
  ink: "FF0F172A",
  body: "FF334155",
  muted: "FF64748B",
  accent: "FF1D4ED8",
  line: "FFE2E8F0",
  subtle: "FFF1F5F9",
  white: "FFFFFFFF",
};

const FONT = "Arial";

const thin = { style: "thin" as const, color: { argb: C.line } };
const allThin = { top: thin, left: thin, bottom: thin, right: thin };

/**
 * A branded MW worksheet builder. Lays out a title block, then sections of
 * label/value rows and/or tables, on a single styled sheet. Returns an .xlsx
 * Buffer. Keep per-document code small by composing these helpers.
 */
export class MWSheet {
  private wb = new ExcelJS.Workbook();
  private ws: ExcelJS.Worksheet;
  private row = 1;

  constructor(sheetName: string, title: string, meta: string[] = []) {
    this.wb.creator = BRAND.company;
    this.ws = this.wb.addWorksheet(sheetName, {
      properties: { defaultRowHeight: 16 },
      pageSetup: { margins: { left: 0.5, right: 0.5, top: 0.6, bottom: 0.6, header: 0.3, footer: 0.3 } },
    });
    this.ws.columns = [
      { width: 28 },
      { width: 52 },
      { width: 18 },
      { width: 18 },
    ];

    // Brand line
    const brand = this.ws.getCell(`A${this.row}`);
    brand.value = `${BRAND.wordmark}  ·  ${BRAND.company} — Internal Document`;
    brand.font = { name: FONT, bold: true, size: 9, color: { argb: C.muted } };
    this.row += 1;

    // Title
    const t = this.ws.getCell(`A${this.row}`);
    t.value = title;
    t.font = { name: FONT, bold: true, size: 18, color: { argb: C.ink } };
    this.ws.getRow(this.row).height = 26;
    this.row += 1;

    for (const m of meta) {
      const c = this.ws.getCell(`A${this.row}`);
      c.value = m;
      c.font = { name: FONT, size: 9, color: { argb: C.muted } };
      this.row += 1;
    }
    this.row += 1;
  }

  /** Section heading bar spanning all columns. */
  heading(title: string): this {
    this.ws.mergeCells(`A${this.row}:D${this.row}`);
    const cell = this.ws.getCell(`A${this.row}`);
    cell.value = title.toUpperCase();
    cell.font = { name: FONT, bold: true, size: 10, color: { argb: C.ink } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.subtle } };
    cell.alignment = { vertical: "middle", indent: 1 };
    cell.border = { left: { style: "medium", color: { argb: C.accent } } };
    this.ws.getRow(this.row).height = 20;
    this.row += 1;
    return this;
  }

  /** Label/value rows (label in A, value spanning B:D). */
  fields(pairs: Array<[string, string | undefined]>): this {
    for (const [label, value] of pairs) {
      const l = this.ws.getCell(`A${this.row}`);
      l.value = label;
      l.font = { name: FONT, bold: true, size: 9, color: { argb: C.muted } };
      l.alignment = { vertical: "top" };
      l.border = { bottom: thin };

      this.ws.mergeCells(`B${this.row}:D${this.row}`);
      const v = this.ws.getCell(`B${this.row}`);
      v.value = value && value.trim() !== "" ? value : "—";
      v.font = { name: FONT, size: 10, color: { argb: C.ink } };
      v.alignment = { vertical: "top", wrapText: true };
      v.border = { bottom: thin };
      this.row += 1;
    }
    this.row += 1;
    return this;
  }

  /** A bordered data table with a shaded header row. */
  table(columns: string[], rows: string[][]): this {
    const startCol = 1;
    const header = this.ws.getRow(this.row);
    columns.forEach((c, i) => {
      const cell = header.getCell(startCol + i);
      cell.value = c.toUpperCase();
      cell.font = { name: FONT, bold: true, size: 9, color: { argb: C.muted } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.subtle } };
      cell.border = allThin;
      cell.alignment = { vertical: "middle" };
    });
    this.row += 1;

    for (const r of rows) {
      const rr = this.ws.getRow(this.row);
      r.forEach((val, i) => {
        const cell = rr.getCell(startCol + i);
        cell.value = val;
        cell.font = { name: FONT, size: 10, color: { argb: C.ink } };
        cell.border = allThin;
        cell.alignment = { vertical: "top", wrapText: true };
      });
      this.row += 1;
    }
    this.row += 1;
    return this;
  }

  /** A free-text note row. */
  note(value: string): this {
    this.ws.mergeCells(`A${this.row}:D${this.row}`);
    const cell = this.ws.getCell(`A${this.row}`);
    cell.value = value;
    cell.font = { name: FONT, italic: true, size: 9, color: { argb: C.muted } };
    cell.alignment = { wrapText: true };
    this.row += 1;
    this.row += 1;
    return this;
  }

  async toBuffer(): Promise<Buffer> {
    const out = await this.wb.xlsx.writeBuffer();
    return Buffer.from(out);
  }
}
