import { MWSheet } from "../branding/xlsx-kit";
import {
  currentStatuses,
  money,
  type ProcurementData,
} from "../schemas/procurement";

const COLUMNS = [
  "Request Number",
  "Date Requested",
  "Staff Name",
  "Branch",
  "Department",
  "Request Type",
  "Category",
  "Priority",
  "Request Title",
  "Estimated Cost",
  "Required By Date",
  "Status",
];

const WIDTHS = [20, 16, 18, 14, 14, 24, 20, 10, 28, 16, 16, 26];

export async function procurementXlsx(d: ProcurementData): Promise<Buffer> {
  const sheet = new MWSheet(
    "Procurement Summary",
    "Procurement & Reimbursement",
    [`Ref: ${d.requestNumber}`, d.requestType],
    WIDTHS,
  );

  sheet.table(COLUMNS, [
    [
      d.requestNumber,
      d.dateRequested,
      d.staffName,
      d.branch,
      d.department,
      d.requestType,
      d.category,
      d.priority,
      d.requestTitle,
      money(d.estimatedCost),
      d.requiredByDate,
      currentStatuses(d.requestType).join(" / "),
    ],
  ]);

  return sheet.toBuffer();
}
