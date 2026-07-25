/**
 * Admin API keys (Phase 3, Wave 4) — consumes ApiKeyResolver:
 *   Query    apiKeys(ownerUserId: ID): [ApiKeyEntity!]!          (apikey:read)
 *   Mutation createApiKey(input: CreateApiKeyInput!): CreateApiKeyResult!  (apikey:manage)
 *   Mutation revokeApiKey(id: ID!): ApiKeyEntity!                (apikey:manage)
 *
 * SECURITY: `createApiKey` returns the plaintext `secret` EXACTLY ONCE. It is
 * never stored server-side and cannot be retrieved again — the UI must surface
 * it in a copy dialog immediately. The list/revoke payloads expose only the
 * public `keyPrefix`, never the secret or its hash.
 */
import { gql } from "@apollo/client";

export const API_KEY_FIELDS = gql`
  fragment ApiKeyFields on ApiKeyEntity {
    id
    name
    keyPrefix
    scopes
    ownerUserId
    lastUsedAt
    expiresAt
    revokedAt
    createdAt
  }
`;

export const GET_API_KEYS = gql`
  ${API_KEY_FIELDS}
  query GetApiKeys($ownerUserId: ID) {
    apiKeys(ownerUserId: $ownerUserId) {
      ...ApiKeyFields
    }
  }
`;

export const CREATE_API_KEY = gql`
  ${API_KEY_FIELDS}
  mutation CreateApiKey($input: CreateApiKeyInput!) {
    createApiKey(input: $input) {
      secret
      apiKey {
        ...ApiKeyFields
      }
    }
  }
`;

export const REVOKE_API_KEY = gql`
  ${API_KEY_FIELDS}
  mutation RevokeApiKey($id: ID!) {
    revokeApiKey(id: $id) {
      ...ApiKeyFields
    }
  }
`;

export interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  scopes: string[];
  ownerUserId: string;
  lastUsedAt?: string | null;
  expiresAt?: string | null;
  revokedAt?: string | null;
  createdAt: string;
}

export interface CreateApiKeyInput {
  name: string;
  scopes: string[];
  expiresAt?: string | null;
}

export interface ApiKeysData {
  apiKeys: ApiKey[];
}

export interface CreateApiKeyData {
  createApiKey: {
    secret: string;
    apiKey: ApiKey;
  };
}

export interface RevokeApiKeyData {
  revokeApiKey: ApiKey;
}
