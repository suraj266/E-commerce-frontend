import type { ReactElement } from "react";

type JsonLdData = Record<string, unknown>;

/**
 * Renders a JSON-LD structured-data `<script>` tag. Server-safe — emits no
 * client JavaScript, the payload is serialized once during SSR.
 *
 * `<` is escaped to `<` so a value that happens to contain `</script>`
 * can never break out of the script element (the data is server-built and
 * trusted, but this is cheap defense-in-depth).
 */
export function JsonLd({ data }: { data: JsonLdData }): ReactElement {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
