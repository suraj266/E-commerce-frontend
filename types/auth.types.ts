/**
 * Restricts which role can authenticate via a given login form. Customer
 * storefront posts 'customer'; seller portal posts 'seller'; admin panel
 * posts 'admin'. Backend rejects mismatches with a generic "Invalid
 * credentials" so role can't be enumerated.
 */
export type LoginAccountType = "customer" | "seller" | "admin";

export interface LoginRequest {
  email: string;
  password: string;
  /** Optional — omit for legacy any-role behavior. */
  accountType?: LoginAccountType;
}

export interface UserSnippet {
  id: string;
  email: string;
  name?: string;
  role: {
    id: string;
    name: string;
  };
}

export interface AuthResponse {
  accessToken: string;
  user: UserSnippet;
}
