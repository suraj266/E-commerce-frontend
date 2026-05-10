import { redirect } from "next/navigation";

/**
 * /account → /account/profile.
 *
 * Lives here so the user icon in the header can link to /account without
 * having to know which subpage to jump to. Profile is the natural default.
 */
export default function AccountIndex() {
  redirect("/account/profile");
}
