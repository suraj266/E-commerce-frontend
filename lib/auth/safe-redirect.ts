/**
 * Validate a post-login `next` redirect target.
 *
 * Only same-origin paths are allowed — anything that could navigate the
 * browser to a third-party origin (protocol-relative `//evil.com`, full
 * URLs, backslash variants Windows browsers sometimes interpret as path
 * separators) is rejected.
 */
export function sanitizeRedirect(
  next: string | null | undefined,
  fallback: string,
): string {
  if (!next) return fallback;
  if (!next.startsWith("/")) return fallback;
  // Reject protocol-relative URLs ("//evil.com") and backslash variants
  // that some browsers normalize to "/" path separators.
  if (next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
}
