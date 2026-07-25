/**
 * Refresh the committed GraphQL schema snapshot (`gql/schema.graphql`) from the
 * running backend.
 *
 * Codegen reads the snapshot offline (see codegen.ts). Run this whenever the
 * backend API changes, then re-run `pnpm codegen` and commit both the snapshot
 * and the regenerated `gql/*` artifacts together. The codegen-staleness gate
 * (`pnpm codegen:check`) fails CI if you forget the regenerate step.
 *
 * Output is sorted with `lexicographicSortSchema` so the snapshot is stable and
 * diffs stay minimal regardless of the backend's field ordering.
 *
 * Usage:
 *   pnpm codegen:schema
 *   GRAPHQL_URL=http://localhost:7000/graphql pnpm codegen:schema
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  getIntrospectionQuery,
  buildClientSchema,
  printSchema,
  lexicographicSortSchema,
} from "graphql";

const ENDPOINT =
  process.env.GRAPHQL_URL ??
  process.env.NEXT_PUBLIC_GRAPHQL_URL ??
  "http://localhost:7000/graphql";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "gql", "schema.graphql");

async function main() {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: getIntrospectionQuery() }),
  });
  if (!res.ok) {
    throw new Error(`Introspection request failed: ${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  if (json.errors) {
    throw new Error(`Introspection returned errors: ${JSON.stringify(json.errors)}`);
  }
  const schema = lexicographicSortSchema(buildClientSchema(json.data));
  writeFileSync(OUT, printSchema(schema).trimEnd() + "\n");
  // eslint-disable-next-line no-console
  console.log(`✓ wrote schema snapshot from ${ENDPOINT} → gql/schema.graphql`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
