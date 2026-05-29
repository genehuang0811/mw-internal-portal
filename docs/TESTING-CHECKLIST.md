# MW Staff Hub — Testing Checklist

Use this to verify the preview build before sign-off. Tick each item.
Sign in with the shared password (`INTERNAL_APP_PASSWORD`).

## 1. Access & navigation
- [ ] Visiting `/` while signed out redirects to `/login`.
- [ ] Wrong password is rejected; correct password lands on `/dashboard`.
- [ ] All header nav links work: Dashboard, Knowledge, Updates, Calendar, Templates, AI.
- [ ] Sign out returns to `/login` and the dashboard is no longer accessible.

## 2. Dashboard
- [ ] Quick actions, Important notices, Recently updated panels render.
- [ ] Search filters module cards live (try "refund", "leave", "pricing").
- [ ] Status chips (All / Active / Demo / Coming Soon) filter correctly.
- [ ] Icons appear on sections, cards, quick actions, and nav.

## 3. Refund Application (must stay working — Excel)
- [ ] `/forms/refund` generates an `.xlsx` download.
- [ ] Refund amount greater than amount paid is rejected with a clear error.
- [ ] Generated file opens in Excel with formatting intact.

## 4. Document Engine — PDFs (`/api/generate/[doc]`)
For each: complete required fields, generate, and confirm a branded PDF downloads.

### Vehicle Drop-Off Inspection (`/forms/vehicle-inspection`)
- [ ] Required fields enforced (customer, rego, make/model, odometer, fuel, drop-off, damage notes, staff).
- [ ] **Photo uploads**: add photos for several angles; thumbnails show; remove works.
- [ ] **Damage annotations**: draw on the vehicle outline; Undo and Clear work.
- [ ] **Customer signature** and **Staff signature** pads capture; Clear works.
- [ ] Generated PDF embeds the photos, damage diagram, and both signatures.
- [ ] BLIS / sensor disclaimer acknowledgement reflects the checkbox.

### Workshop Job Card (`/forms/job-card`)
- [ ] **MW order number** required and shown on the PDF.
- [ ] **Parts list**: add/remove rows; empty rows are ignored; table renders in PDF.
- [ ] **Installer checklist**: ticked vs unticked items render as filled/empty boxes.
- [ ] **Completion sign-off**: completed flag, date, notes, and installer signature render.

### Warranty Claim (`/forms/warranty`)
- [ ] Required fields enforced; PDF renders customer, claim, and review sections.

### Annual Leave (`/forms/annual-leave`)
- [ ] Total days auto-calculates (e.g. 1–5 June = 5 days).
- [ ] End-before-start is blocked with a friendly message.
- [ ] PDF shows the approval flow (Employee » Manager » Accounts).

### Insurance Claim (`/forms/insurance`)
- [ ] Required fields enforced; amounts render formatted; PDF renders.

## 5. Validation & errors
- [ ] Submitting with missing required fields shows an inline message (no download).
- [ ] Unknown document slug returns 404 (engine guard).
- [ ] Generating while signed out is rejected (401).

## 6. Knowledge / Updates / Calendar / Templates / AI (demo)
- [ ] Vehicle Dimensions: search + make filter work; Last updated / Owner shown.
- [ ] Pricing: view/download/ask-AI buttons present and disabled.
- [ ] Updates: category filter works; "Post update" disabled.
- [ ] Calendar: events grouped by month; quarter summary; ".ics" buttons disabled.
- [ ] Templates: file-type, last updated, owner shown; view/download disabled.
- [ ] AI Assistant: example questions link to the right pages; chat input disabled.

## 7. Responsive / cross-device
- [ ] Mobile (≤640px): hamburger nav opens; forms usable; photo capture offers camera.
- [ ] Tablet: layout holds; tables scroll horizontally where needed.
- [ ] Desktop: 2–3 column grids render as expected.

## 8. PDF quality
- [ ] MW header/footer appear on every page (including page 2+).
- [ ] No broken glyphs; amounts/dates formatted; filenames are descriptive.
- [ ] Embedded images are reasonably sized (payloads stay small; photos are resized client-side).

## 9. Console / regressions
- [ ] No console errors on any page.
- [ ] Existing demo modules (anonymous feedback, incident) still load.

---
**Known limits (by design, Draft 2):** no database, no AI, no Google Drive, no
email. Generated PDFs download to the device only — cloud delivery and email
are intentionally deferred until the document formats are signed off.
