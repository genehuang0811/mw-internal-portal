import { z } from "zod";
import { req, opt } from "./_shared";

export const annualLeaveSchema = z
  .object({
    employeeName: req("Employee name"),
    leaveType: req("Leave type"),
    manager: req("Manager"),
    startDate: req("Start date"),
    endDate: req("End date"),
    notes: opt,
  })
  .superRefine((data, ctx) => {
    const s = Date.parse(`${data.startDate}T00:00:00Z`);
    const e = Date.parse(`${data.endDate}T00:00:00Z`);
    if (!Number.isNaN(s) && !Number.isNaN(e) && e < s) {
      ctx.addIssue({
        code: "custom",
        message: "End date cannot be before start date",
        path: ["endDate"],
      });
    }
  });

export type AnnualLeaveData = z.infer<typeof annualLeaveSchema>;

/** Inclusive whole-day count, or null if dates are invalid. */
export function leaveDays(startDate: string, endDate: string): number | null {
  const s = Date.parse(`${startDate}T00:00:00Z`);
  const e = Date.parse(`${endDate}T00:00:00Z`);
  if (Number.isNaN(s) || Number.isNaN(e) || e < s) return null;
  return Math.round((e - s) / 86_400_000) + 1;
}
