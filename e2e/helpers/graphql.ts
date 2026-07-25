import type { Page, Route } from "@playwright/test";

/**
 * Stub selected GraphQL operations by operationName so terminal mutations are
 * deterministic and don't mutate real data. Every other operation (the cart /
 * address / gateway queries that render the page from fixtures) is passed
 * through untouched.
 *
 * The endpoint matches NEXT_PUBLIC_GRAPHQL_URL; we route on the conventional
 * graphql-suffixed glob (see page.route below). Adjust it centrally if the API
 * path differs.
 */
export type GraphQLStubs = Record<string, unknown>;

export async function stubGraphQL(
  page: Page,
  stubs: GraphQLStubs,
): Promise<void> {
  await page.route("**/graphql", async (route: Route) => {
    const request = route.request();
    if (request.method() !== "POST") return route.continue();

    let operationName: string | undefined;
    try {
      const body = request.postDataJSON() as
        | { operationName?: string }
        | Array<{ operationName?: string }>;
      operationName = Array.isArray(body)
        ? body[0]?.operationName
        : body?.operationName;
    } catch {
      return route.continue();
    }

    if (!operationName || !(operationName in stubs)) {
      return route.continue();
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ data: stubs[operationName] }),
    });
  });
}
