# Sample documents

Generated PDFs from the MW Document Engine (`/api/generate/[doc]`), one per
document type. These are produced from representative demo data to show the
finalised formats and MW branding.

| File | Document | Notes |
| ---- | -------- | ----- |
| `01-vehicle-inspection.pdf` | Vehicle Drop-Off Inspection | Photos, customer/staff signatures, and damage annotations are embedded when captured in the form — this sample omits them for a clean preview. |
| `02-warranty.pdf` | Warranty Claim | |
| `03-annual-leave.pdf` | Annual Leave Request | Auto day-count + approval flow. |
| `04-insurance.pdf` | Insurance Claim | |
| `05-job-card.pdf` | Workshop Job Card | MW order number, parts list, installer checklist, completion sign-off. |

To regenerate after format changes, run the app, sign in, and POST to
`/api/generate/<slug>` (see `scripts`/`samples` generation, or use the live
forms under `/forms/...`).
