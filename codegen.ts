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
 * Schema source:
 *   We introspect the running backend at http://localhost:7000/graphql.
 *   That means `pnpm codegen` requires the backend container to be up.
 *   When CI needs offline codegen, switch to a committed schema snapshot
 *   (`pnpm exec graphql-codegen --schema=./gql/schema.graphql`).
 */

import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://localhost:7000/graphql",
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
