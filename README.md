# MW Internal Forms Portal

Internal MW Manufacturing portal that hosts every staff-facing form and tool
behind a single password gate. Staff sign in once, land on a dashboard, and
launch the module they need.

Built with Next.js (App Router, Turbopack), TypeScript, Tailwind CSS, ExcelJS,
and Zod. Deploys to Vercel.

## V1 modules

| Module                       | Status        | Route                       |
| ---------------------------- | ------------- | --------------------------- |
| Refund Application           | **Active**    | `/forms/refund`             |
| Warranty Claim               | Coming Soon   | `/forms/warranty`           |
| Insurance Claim              | Coming Soon   | `/forms/insurance`          |
| Job Card Generator           | Coming Soon   | `/forms/job-card`           |
| Vehicle Drop-Off Inspection  | Coming Soon   | `/forms/vehicle-inspection` |
| HR Forms                     | Coming Soon   | `/forms/hr`                 |
| Finance Approval Request     | Coming Soon   | `/forms/finance-approval`   |
| Stock Request                | Coming Soon   | `/forms/stock-request`      |
| Supplier Claim               | Coming Soon   | `/forms/supplier-claim`     |
| MW AI Assistant              | Coming Soon   | `/ai-assistant`             |

## Configuration

```bash
cp .env.example .env.local
# edit .env.local and set INTERNAL_APP_PASSWORD
```

| Variable                | Purpose                                   |
| ----------------------- | ----------------------------------------- |
| `INTERNAL_APP_PASSWORD` | Shared password required to access the portal. |

On Vercel, set this in **Project Settings → Environment Variables** for each
environment (Production, Preview, Development).

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. The root path `/` redirects to `/login` (or to
`/dashboard` if already signed in).

## Scripts

| Script          | Purpose                          |
| --------------- | -------------------------------- |
| `npm run dev`   | Start the local dev server.      |
| `npm run build` | Build for production.            |
| `npm run start` | Run the production build.        |
| `npm run lint`  | Lint the codebase with ESLint.   |

## Architecture

```
src/
  app/
    layout.tsx                       Root <html>/<body>, global metadata.
    page.tsx                         Root redirector (→ /login or /dashboard).
    login/
      page.tsx                       Public login screen.
      login-form.tsx                 Client password form.
    (portal)/                        Route group — auth-gated.
      layout.tsx                     Auth check, portal header + nav.
      dashboard/
        page.tsx                     Dashboard of module cards.
      forms/
        refund/
          page.tsx                   Refund Application page.
          refund-form.tsx            Client form for the refund module.
        [slug]/
          page.tsx                   Dynamic "Coming Soon" for all other forms.
      ai-assistant/
        page.tsx                     "Coming Soon" AI assistant.
    api/
      auth/login/route.ts            POST: validate password, set cookie.
      auth/logout/route.ts           POST: clear cookie.
      generate-refund/route.ts       POST: validate + generate refund .xlsx.
  components/
    portal-nav.tsx                   Header nav (Dashboard, Refund Form, Sign out).
    coming-soon.tsx                  Shared placeholder card.
  lib/
    auth.ts                          Cookie helper, isAuthenticated().
    modules.ts                       Single source of truth for portal modules.
    schema.ts                        Refund Zod schema + cell map.
    excel-fill.ts                    ExcelJS template fill + filename builder.
public/
  templates/
    refund-application-template.xlsx  Excel template (bundled with API route).
```

### Adding a new module

1. Add an entry to `src/lib/modules.ts` (`id`, `title`, `description`, `href`,
   `status`). The dashboard updates automatically.
2. When it's ready to go live, set `status: "active"` and add a real
   `src/app/(portal)/<route>/page.tsx` (and any supporting API route). The
   `[slug]` route handles all `Coming Soon` placeholders for `/forms/*`.

### Refund module

- `public/templates/refund-application-template.xlsx` — the source template,
  bundled with the API function via `outputFileTracingIncludes` in
  `next.config.ts`. Layout, formatting, merged cells, formulas, validations,
  and dropdowns are preserved on every generation.
- `src/lib/schema.ts` — Zod schema, dropdown option lists, and the
  field-to-cell map.
- `src/lib/excel-fill.ts` — fills only the mapped cells; formula cells
  (`D5`, `E3`, `B20`, `B24`, `Lists!J2`) are left untouched.
- `src/app/api/generate-refund/route.ts` — auth-gated, validates input,
  streams the `.xlsx`.

#### Validation rules

- Sections 1–6 plus Sales Staff are required.
- The rest of Section 7 (Authorisation) and all of Section 8 (Accounting
  Department Use Only) are optional.
- Refund Amount cannot exceed Amount Paid.
- BSB must be 6 digits (dashes/spaces allowed, e.g. `064-000`).
- Email must be a valid email address.

## Authentication

Single shared password, set via `INTERNAL_APP_PASSWORD`. On successful login,
an HttpOnly + SameSite=Strict cookie (8-hour expiry) stores a SHA-256 token of
the password. The `(portal)` route group's layout and `/api/generate-refund`
both verify the cookie server-side.

## Deployment

Push to GitHub and import in Vercel. Set `INTERNAL_APP_PASSWORD`. No further
configuration is required — the refund template is bundled with the API
function automatically.

## Status

V1: portal shell + working Refund Application. Other modules are stubbed as
"Coming Soon" placeholders.
