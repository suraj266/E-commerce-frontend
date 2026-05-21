/**
 * Pure helper — lives in its own file so client components (e.g. login
 * pages) can import it without dragging in the `next/headers` import that
 * `session.ts` uses. `next/headers` is server-only and breaks the build
 * the moment it lands in a client bundle.
 */
export function getRoleHome(roleName: string | undefined | null): string {
  switch (roleName) {
    case "superAdmin":
    case "admin":
      return "/admin/dashboard";
    case "seller":
      return "/seller/dashboard";
    case "customer":
      return "/account";
    default:
      return "/";
  }
}
