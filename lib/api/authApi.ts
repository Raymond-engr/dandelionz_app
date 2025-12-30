import { baseApi } from "./baseApi";

interface RegisterRequest {
  email: string;
  password: string;
  phone_number: string;
  full_name: string;
  role: "CUSTOMER" | "VENDOR";
  referral_code?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  data: {
    user: {
      uuid: string;
      email: string;
      full_name: string;
      phone_number: string;
      profile_picture: string | null;
      role: string;
      is_verified: boolean;
      is_active: boolean;
      created_at: string;
      referral_code: string;
    };
    tokens: {
      access_token: string;
      refresh_token: string;
      token_type: string;
      expires_in: number;
      refresh_expires_in: number;
      user_uuid: string;
      issued_at: number;
    };
    is_new_user?: boolean;
    email_verified: boolean;
    verification_needed?: boolean;
  };
}

interface RefreshTokenRequest {
  refresh_token: string;
}

interface PasswordResetRequest {
  email: string;
}

interface VerifyEmailRequest {
  token: string;
}

interface ResendVerificationRequest {
  email: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Register
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (credentials) => ({
        url: "/auth/register/",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Login
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login/",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Refresh Token
    refreshToken: builder.mutation<
      AuthResponse["data"]["tokens"],
      RefreshTokenRequest
    >({
      query: (body) => ({
        url: "/auth/token/refresh/",
        method: "POST",
        body,
      }),
    }),

    // Password Reset
    requestPasswordReset: builder.mutation<
      { success: boolean; message: string },
      PasswordResetRequest
    >({
      query: (body) => ({
        url: "/auth/password-reset/",
        method: "POST",
        body,
      }),
    }),

    // Check Verification Status
    checkVerification: builder.query<
      { success: boolean; data: { is_verified: boolean } },
      void
    >({
      query: () => "/auth/check-verification/",
      providesTags: ["Auth"],
    }),

    // Send Verification Email
    sendVerificationEmail: builder.mutation<
      { success: boolean; message: string },
      void
    >({
      query: () => ({
        url: "/auth/send-verification/",
        method: "POST",
      }),
    }),

    // Verify Email
    verifyEmail: builder.mutation<
      { success: boolean; message: string },
      VerifyEmailRequest
    >({
      query: (body) => ({
        url: "/auth/verify-email/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Resend Verification Email
    resendVerificationEmail: builder.mutation<
      { success: boolean; message: string },
      ResendVerificationRequest
    >({
      query: (body) => ({
        url: "/auth/resend-verification/",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshTokenMutation,
  useRequestPasswordResetMutation,
  useCheckVerificationQuery,
  useSendVerificationEmailMutation,
  useVerifyEmailMutation,
  useResendVerificationEmailMutation,
} = authApi;
