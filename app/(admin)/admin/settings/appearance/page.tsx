/**
 * Appearance Settings — /admin/settings/appearance
 *
 * Server component that fetches the current saved theme via the same
 * server-only fetcher the layout uses, then hands it to the client editor.
 * Co-located with the SSR layout fetch means a refresh after save shows the
 * persisted values, not stale ones.
 */

import { getAdminTheme } from "@/lib/theme/get-admin-theme";
import { AppearanceEditor } from "./_components/appearance-editor";

export default async function AppearanceSettingsPage() {
  const theme = await getAdminTheme();
  return <AppearanceEditor initialTheme={theme} />;
}
