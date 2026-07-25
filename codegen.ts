/**
 * GraphQL Codegen — client-preset.
 *
 * Generates a typed `graphql()` tag function + a fragments map into `./gql/`.
 * Apollo Client 4 understands TypedDocumentNode natively, so queries become
 * fully typed without `useQuery<MyData>()` generics at the call site.
 *
 * Usage at call site:
 *   import { graphql } from "@/gql";
 *   const GET_CART = graphql(`
 *     query GetMyCart { myCart { id subtotal } }
 *   `);
 *   const { data } = useQuery(GET_CART); // data is fully typed
 *
 * Migration is INCREMENTAL — existing `lib/graphql/*.ts` files using
 * `import { gql } from "@apollo/client"` keep working until each is moved
 * over. Codegen ignores those gql usages and only generates types for the
 * ones using the new `graphql()` tag.
 *
 * Schema source (offline-first):
 *   Codegen reads the COMMITTED schema snapshot at `./gql/schema.graphql`
 *   instead of introspecting the live backend. This makes `pnpm codegen`
 *   deterministic and runnable in CI without the backend container up, and
 *   underpins the codegen-staleness gate (see below).
 *
 *   Refresh the snapshot from the running backend whenever the API changes:
 *     `pnpm codegen:schema`   (introspects http://localhost:7000/graphql →
 *                              rewrites gql/schema.graphql, sorted + stable)
 *   then re-run `pnpm codegen` and commit both the snapshot and the
 *   regenerated `gql/*` artifacts together.
 *
 * Codegen-staleness gate:
 *   `pnpm codegen:check` runs codegen against the snapshot and then
 *   `git diff --exit-code -- gql/`. If the committed generated artifacts are
 *   out of sync with the snapshot (someone edited a query/fragment or bumped
 *   the schema without re-running codegen), the diff is non-empty and CI
 *   fails. The Frontend CI workflow runs this step before typecheck/build.
 */

import type { CodegenConfig } from "@graphql-codegen/cli";

// Allow overriding the schema source (e.g. the refresh script points this at
// the live backend to regenerate the snapshot). Defaults to the committed
// offline snapshot so plain `pnpm codegen` never needs the backend.
const SCHEMA = process.env.CODEGEN_SCHEMA ?? "./gql/schema.graphql";

const config: CodegenConfig = {
  schema: SCHEMA,
  documents: [
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "lib/**/*.{ts,tsx}",
    // Exclude generated output so codegen doesn't recurse into itself
    "!gql/**/*",
    "!node_modules/**",
    "!.next/**",
  ],
  generates: {
    "./gql/": {
      preset: "client",
      presetConfig: {
        // Use `graphql` as the tag name (instead of the default `gql`) so we
        // can keep the existing `import { gql } from "@apollo/client"`
        // imports working side-by-side with the new typed version during
        // migration. `import { graphql } from "@/gql"` is the new pattern.
        gqlTagName: "graphql",
      },
    },
  },
  // Don't error out on the first codegen run when no documents use the new
  // graphql() tag yet. Migration is gradual.
  ignoreNoDocuments: true,
  // Adds a header noting the file is generated. Better than nothing.
  hooks: {
    afterAllFileWrite: ["echo '✓ codegen finished'"],
  },
};

export default config;
