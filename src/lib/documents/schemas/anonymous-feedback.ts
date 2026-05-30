import { z } from "zod";
import { req, opt } from "./_shared";

export const SUBMISSION_TYPES = ["Complaint", "Feedback", "Suggestion"] as const;
export const URGENCY_LEVELS = ["Low", "Medium", "High"] as const;
export const FEEDBACK_BRANCHES = [
  "Toowoomba",
  "Brisbane",
  "Sunshine Coast",
  "Gold Coast",
] as const;

export const anonymousFeedbackSchema = z.object({
  submissionType: req("Submission type"),
  branch: req("Branch"),
  urgency: req("Urgency"),
  // Optional — left blank keeps the submission anonymous.
  contactName: opt,
  details: req("Details"),
});

export type AnonymousFeedbackData = z.infer<typeof anonymousFeedbackSchema>;
