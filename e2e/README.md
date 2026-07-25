# E2E suite (Playwright)

Behaviour-locking end-to-end specs that pin the current UX of the two pages
decomposed in **P3-12** so the refactor is provably behaviour-preserving:

- `product-form.spec.ts` — seller product **create** + **edit** happy paths and
  the full set of form sections.
- `checkout.spec.ts` — checkout layout, **COD** happy path, and **prepaid
  (Razorpay)** happy path.

## Not yet wired (do centrally)

Playwright is **not installed**. To make this suite runnable, the orchestrator
must add — this workstream is forbidden from installing deps or editing
`package.json`:

1. Dev dependency: `@playwright/test` (+ `npx playwright install --with-deps chromium`).
2. `package.json` scripts:
   ```json
   "test:e2e": "playwright test",
   "test:e2e:ui": "playwright test --ui"
   ```
3. Optional CI job invoking `pnpm test:e2e` against a booted app + seeded backend.

The `playwright.config.ts` at the frontend root is already authored.

## Fixtures / env (👤 human-provided)

| Var | Purpose |
| --- | --- |
| `E2E_BASE_URL` | App URL (default `http://localhost:3000`; when unset the config boots `next dev`). |
| `E2E_SELLER_EMAIL` / `E2E_SELLER_PASSWORD` | Seller with ≥1 **ACTIVE** store. |
| `E2E_CUSTOMER_EMAIL` / `E2E_CUSTOMER_PASSWORD` | Customer with a non-empty cart + ≥1 saved address, and at least the COD + Razorpay gateways enabled. |
| `E2E_EDIT_PRODUCT_ID` | An existing DRAFT product owned by the seller (edit spec skips if unset). |

Terminal mutations (`CreateMyProduct`, `UpdateMyProduct`, `InitiateCheckout`,
`VerifyPayment`) are stubbed in-test via `helpers/graphql.ts` so runs are
deterministic and never mutate real data; all reference-data queries hit the
real backend. If the GraphQL endpoint is not served at `**/graphql`, adjust the
route glob in `helpers/graphql.ts`.
