import ExcelJS from "exceljs";

const out = process.argv[2];
const wb = new ExcelJS.Workbook();
await wb.xlsx.readFile(out);
const ws = wb.getWorksheet("Refund Form");

const checks = [
  ["B5", "Store"],
  ["F5", "Date of Sale"],
  ["B6", "Transaction No."],
  ["E6", "Invoice No."],
  ["B7", "Total Sales Amount"],
  ["D7", "Amount Paid"],
  ["F7", "Payment Method"],
  ["B9", "Order Status"],
  ["B10", "Notes"],
  ["B12", "Reason"],
  ["B13", "Explanation"],
  ["B15", "Customer"],
  ["B16", "Phone"],
  ["E16", "Email"],
  ["B17", "Address"],
  ["B19", "Refund Method"],
  ["E19", "Refund Amount"],
  ["B22", "BSB"],
  ["D22", "Account Number"],
  ["B23", "Account Name"],
  ["B26", "Sales Staff"],
  ["B27", "Manager Approval"],
  ["E27", "Approval Date"],
  ["B28", "Approval Status"],
];

for (const [addr, label] of checks) {
  const cell = ws.getCell(addr);
  const v = cell.value;
  const display =
    v instanceof Date
      ? v.toISOString().slice(0, 10)
      : typeof v === "object" && v !== null
        ? JSON.stringify(v)
        : String(v);
  console.log(`${addr} (${label}): ${display}`);
}

console.log("\n-- Formula cells should still be formulas --");
for (const addr of ["D5", "E3", "B20", "B24"]) {
  const cell = ws.getCell(addr);
  const v = cell.value;
  console.log(
    `${addr}: ${typeof v === "object" && v !== null && "formula" in v ? "FORMULA " + v.formula : JSON.stringify(v)}`,
  );
}

console.log("\n-- Data validations still present --");
const dvs = ws.dataValidations?.model || {};
console.log("Validation ranges:", Object.keys(dvs).join(", "));

console.log("\n-- Merged cells preserved --");
console.log("Merges count:", (ws.model?.merges || []).length);
