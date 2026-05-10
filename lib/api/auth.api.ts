/**
 * =============================================================================
 * Auth API Service
 * =============================================================================
 * 
 * All authentication-related API calls to the backend.
 * Uses the custom apiClient (native fetch with credentials: 'include').
 * 
 * ENDPOINTS:
 * - POST /auth/login    → Login with email & password
 * - POST /auth/refresh  → Refresh the access token using cookie
 * - POST /auth/logout   → Revoke refresh token & clear cookie
 * =============================================================================
 */

import { apiClient } from './client';
import type { LoginRequest, AuthResponse } from '@/types/auth.types';

export interface RegisterSellerRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface RegisterSellerResponse {
  message: string;
  userId: string;
  // Dev convenience — exposes the verification token so the frontend can show
  // a click-through link until SMTP is wired up. Never rely on this in prod.
  verificationToken?: string;
  verificationUrl?: string;
}

export interface RegisterCustomerRequest {
  name: string;
  email: string;
  password: string;
}

export type RegisterCustomerResponse = RegisterSellerResponse;

export interface RequestPasswordResetResponse {
  message: string;
  // Dev-only — frontend shows a click-through link until SMTP is wired.
  // Production responses strip these.
  resetToken?: string;
  resetUrl?: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface VerifyEmailResponse {
  message: string;
  email: string;
}

export interface ResendVerificationResponse {
  message: string;
  verificationToken?: string;
  verificationUrl?: string;
}

export const authApi = {
  /**
   * Login with email and password.
   * Backend sets refreshToken as httpOnly cookie automatically.
   * Returns accessToken + user data.
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    return await apiClient<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  /**
   * Logout the current user.
   * - Sends the accessToken in Authorization header (required by JwtAuthGuard)
   * - Backend revokes the refresh token in DB
   * - Backend clears the refreshToken cookie
   * 
   * @param accessToken - The current JWT access token from Zustand store
   */
  logout: async (accessToken: string): Promise<void> => {
    await apiClient<void>('/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  },

  /**
   * Refresh the access token.
   * The refreshToken cookie is sent automatically (credentials: 'include').
   * Returns a new accessToken.
   */
  refresh: async (): Promise<{ accessToken: string }> => {
    return await apiClient<{ accessToken: string }>('/auth/refresh', {
      method: 'POST',
    });
  },

  // ---------------------------------------------------------------------------
  // Seller registration + email verification
  // ---------------------------------------------------------------------------

  registerSeller: async (
    input: RegisterSellerRequest,
  ): Promise<RegisterSellerResponse> => {
    return await apiClient<RegisterSellerResponse>('/auth/seller/register', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  registerCustomer: async (
    input: RegisterCustomerRequest,
  ): Promise<RegisterCustomerResponse> => {
    return await apiClient<RegisterCustomerResponse>(
      '/auth/customer/register',
      {
        method: 'POST',
        body: JSON.stringify(input),
      },
    );
  },

  // ---------------------------------------------------------------------------
  // Password reset
  // ---------------------------------------------------------------------------

  requestPasswordReset: async (
    email: string,
  ): Promise<RequestPasswordResetResponse> => {
    return await apiClient<RequestPasswordResetResponse>(
      '/auth/request-password-reset',
      {
        method: 'POST',
        body: JSON.stringify({ email }),
      },
    );
  },

  resetPassword: async (
    token: string,
    password: string,
  ): Promise<ResetPasswordResponse> => {
    return await apiClient<ResetPasswordResponse>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  },

  verifyEmail: async (token: string): Promise<VerifyEmailResponse> => {
    return await apiClient<VerifyEmailResponse>('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },

  resendVerification: async (
    email: string,
  ): Promise<ResendVerificationResponse> => {
    return await apiClient<ResendVerificationResponse>(
      '/auth/resend-verification',
      {
        method: 'POST',
        body: JSON.stringify({ email }),
      },
    );
  },

  /**
   * Admin-only: manually mark a user's email as verified.
   * Backend gates this with the `user:update` permission.
   */
  adminVerifyEmail: async (
    userId: string,
    accessToken: string,
  ): Promise<{ message: string; userId: string }> => {
    return await apiClient<{ message: string; userId: string }>(
      '/auth/admin/verify-email',
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ userId }),
      },
    );
  },
};

