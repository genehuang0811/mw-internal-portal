import {
  buildDocx,
  docHeading,
  docFields,
  docSignatures,
  docSpacer,
} from "../branding/docx-kit";
import { leaveDays, type AnnualLeaveData } from "../schemas/annual-leave";

export async function annualLeaveDocx(d: AnnualLeaveData): Promise<Buffer> {
  const days = leaveDays(d.startDate, d.endDate);
  return buildDocx({
    title: "Annual Leave Request",
    meta: [`Employee: ${d.employeeName}`],
    body: [
      docHeading("Employee"),
      docFields([
        ["Employee name", d.employeeName],
        ["Leave type", d.leaveType],
        ["Manager", d.manager],
      ]),
      docHeading("Dates"),
      docFields([
        ["Start date", d.startDate],
        ["End date", d.endDate],
        [
          "Total days requested",
          days !== null ? `${days} ${days === 1 ? "day" : "days"}` : undefined,
        ],
        ["Reason / notes", d.notes],
      ]),
      docHeading("Approval"),
      docSpacer(),
      docSignatures(["Employee signature", "Manager approval"]),
    ],
  });
}
