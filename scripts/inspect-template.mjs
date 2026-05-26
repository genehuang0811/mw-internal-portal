import ExcelJS from "exceljs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatePath = path.join(
  __dirname,
  "..",
  "public",
  "templates",
  "refund-application-template.xlsx",
);

const wb = new ExcelJS.Workbook();
await wb.xlsx.readFile(templatePath);

for (const ws of wb.worksheets) {
  console.log(`\n===== Sheet: ${ws.name} =====`);
  console.log(`Dimensions: ${ws.rowCount} rows x ${ws.columnCount} cols`);
  console.log(`Actual range: ${ws.dimensions ? JSON.stringify(ws.dimensions) : "n/a"}`);

  // Cell contents
  console.log("\n--- Non-empty cells ---");
  ws.eachRow({ includeEmpty: false }, (row) => {
    row.eachCell({ includeEmpty: false }, (cell) => {
      const val = cell.value;
      const display =
        typeof val === "object" && val !== null
          ? JSON.stringify(val)
          : String(val);
      console.log(`  ${cell.address}: ${display}`);
    });
  });

  // Merged cells
  console.log("\n--- Merged cell ranges ---");
  const merges = ws.model?.merges || [];
  for (const m of merges) console.log(`  ${m}`);

  // Data validations (dropdowns)
  console.log("\n--- Data validations ---");
  const dvs = ws.dataValidations?.model || {};
  for (const [range, dv] of Object.entries(dvs)) {
    console.log(`  ${range}: ${JSON.stringify(dv)}`);
  }
}
