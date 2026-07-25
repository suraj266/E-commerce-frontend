/**
 * Admin Newsletter Broadcast — /admin/newsletter (P3 Wave 4)
 *
 * Server component: gates the consent-gated broadcast console. Composing and
 * sending a campaign requires `newsletter:send` — a strictly higher bar than the
 * `newsletter:read` subscriber-list view, since a send fans marketing mail out
 * to every consenting subscriber.
 *
 * // CENTRAL-WIRING: add ROUTE_PERMISSIONS.newsletter = ["newsletter:send"] to
 * // lib/auth/permission-slugs.ts and seed the `newsletter:send` slug, then swap
 * // the inline anyOf below for ROUTE_PERMISSIONS.newsletter. Also add the nav
 * // item (Marketing → Newsletter, href /admin/newsletter, permission set).
 */
import { PermissionGate } from "@/components/admin/permission-gate";
import NewsletterClient from "./newsletter-client";

export default function AdminNewsletterPage() {
  return (
    <PermissionGate anyOf={["newsletter:send"]}>
      <NewsletterClient />
    </PermissionGate>
  );
}
