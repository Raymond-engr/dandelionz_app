import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { RootState } from "../store";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://dandelionz.net/api";

// Base query with auth token injection
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

// Base query with automatic token refresh
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const state = api.getState() as RootState;
    const refreshToken = state.auth.refreshToken;

    if (refreshToken) {
      // Try to refresh token
      const refreshResult = await baseQuery(
        {
          url: "/auth/token/refresh/",
          method: "POST",
          body: { refresh_token: refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const { access_token, refresh_token } = (refreshResult.data as any)
          .data;

        // Update tokens in state
        api.dispatch({
          type: "auth/setTokens",
          payload: { accessToken: access_token, refreshToken: refresh_token },
        });

        // Retry original request
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed - logout user
        api.dispatch({ type: "auth/logout" });
      }
    } else {
      // No refresh token - logout user
      api.dispatch({ type: "auth/logout" });
    }
  }

  return result;
};

// Base API slice
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Auth",
    "User",
    "Admin",
    "Vendor",
    "Customer",
    "Product",
    "Order",
    "Category",
    "Cart",
    "Wishlist",
    "Payment",
    "Settlement",
    "Notification",
    "Analytics",
  ],
  endpoints: () => ({}),
});

// Export hooks
export const { reducerPath, reducer, middleware } = baseApi;
