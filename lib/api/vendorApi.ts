import { baseApi } from "./baseApi";

interface VendorProfile {
  user: {
    uuid: string;
    email: string;
    full_name: string;
    phone_number: string;
    profile_picture: string | null;
    role: string;
    referral_code: string;
    is_verified: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  store_name: string;
  store_description: string;
  business_registration_number: string;
  address: string;
  bank_name: string;
  account_number: string;
  recipient_code: string;
  is_verified_vendor: boolean;
}

interface Product {
  slug: string;
  name: string;
  description: string;
  price: string;
  discounted_price: string | null;
  category: string;
  brand: string;
  stock: number;
  images: string[];
  variants: {
    colors: string[];
    sizes: string[];
  };
  tags: string[];
  publish_status: string;
  approval_status: string;
  created_at: string;
  updated_at: string;
}

interface Order {
  uuid: string;
  order_id: string;
  customer: {
    uuid: string;
    full_name: string;
    email: string;
    phone_number: string;
  };
  items: Array<{
    product_name: string;
    quantity: number;
    price: string;
  }>;
  total_amount: string;
  status: string;
  shipping_address: string;
  created_at: string;
  updated_at: string;
}

interface VendorAnalytics {
  total_orders: number;
  total_revenue: string;
  pending_orders: number;
  completed_orders: number;
  total_products: number;
  active_products: number;
}

interface WalletBalance {
  withdrawable_balance: string;
  available_balance: string;
  total_earnings: string;
  total_withdrawals: number;
  this_month_earnings: string;
}

interface Transaction {
  id: string;
  type: "credit" | "debit";
  amount: string;
  description: string;
  status: string;
  created_at: string;
}

interface PaymentSettings {
  bank_name: string;
  account_number: string;
  account_name: string;
  recipient_code: string;
  has_pin: boolean;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface OrderSummary {
  pending: number;
  paid: number;
  shipped: number;
  delivered: number;
  canceled: number;
}

export const vendorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Profile Management
    getVendorProfile: builder.query<
      { success: boolean; data: VendorProfile },
      void
    >({
      query: () => "/user/vendor/profile/",
      providesTags: ["Vendor"],
    }),

    partialUpdateVendorProfile: builder.mutation<
      { success: boolean; data: VendorProfile },
      FormData
    >({
      query: (body) => ({
        url: "/user/vendor/profile/",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Vendor"],
    }),

    changeVendorPassword: builder.mutation<
      { success: boolean; message: string },
      { current_password: string; new_password: string }
    >({
      query: (body) => ({
        url: "/user/vendor/change-password/",
        method: "POST",
        body,
      }),
    }),

    // --- Store Product Management ---
    getStoreProducts: builder.query<
      { success: boolean; data: Product[] },
      { status?: string }
    >({
      query: (params) => ({
        url: "/user/vendor/products/",
        params,
      }),
      providesTags: ["Product"],
    }),

    createStoreProduct: builder.mutation<
      { success: boolean; data: Product },
      FormData
    >({
      query: (body) => ({
        url: "/user/vendor/products/add/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Product", "Draft"],
    }),

    getStoreProductDetails: builder.query<
      { success: boolean; data: Product },
      string
    >({
      query: (slug) => `/user/vendor/products/${slug}/`,
      providesTags: ["Product"],
    }),

    updateStoreProduct: builder.mutation<
      { success: boolean; data: Product },
      { slug: string; data: FormData }
    >({
      query: ({ slug, data }) => ({
        url: `/user/vendor/products/${slug}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),

    partialUpdateStoreProduct: builder.mutation<
      { success: boolean; data: Product },
      { slug: string; data: Partial<Product> }
    >({
      query: ({ slug, data }) => ({
        url: `/user/vendor/products/${slug}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),

    deleteStoreProduct: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (slug) => ({
        url: `/user/vendor/products/${slug}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),

    // --- Draft Management ---
    getDrafts: builder.query<{ success: boolean; data: Product[] }, void>({
      query: () => "/store/vendor/drafts/",
      providesTags: ["Draft"],
    }),

    getDraftDetails: builder.query<{ success: boolean; data: Product }, string>({
      query: (slug) => `/store/vendor/drafts/${slug}/`,
      providesTags: ["Draft"],
    }),

    createDraft: builder.mutation<{ success: boolean; data: Product }, FormData>({
      query: (body) => ({
        url: "/store/vendor/drafts/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Draft"],
    }),

    updateDraft: builder.mutation<
      { success: boolean; data: Product },
      { slug: string; data: FormData }
    >({
      query: ({ slug, data }) => ({
        url: `/store/vendor/drafts/${slug}/update/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Draft", "Product"],
    }),

    submitDraft: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (slug) => ({
        url: `/store/vendor/drafts/${slug}/submit/`,
        method: "POST",
      }),
      invalidatesTags: ["Draft", "Product"],
    }),

    deleteDraft: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (slug) => ({
        url: `/store/vendor/drafts/${slug}/delete/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Draft"],
    }),

    // Order Management
    getVendorOrders: builder.query<
      { success: boolean; data: OrderSummary },
      void // No params for summary
    >({
      query: () => ({
        url: "/user/vendor/orders/",
      }),
      providesTags: ["Order"],
    }),

    getVendorOrdersList: builder.query<
      { success: boolean; data: Order[] },
      { limit?: number; offset?: number; status?: string } // Example params
    >({
      query: (params) => ({
        url: "/user/vendor/orders/list/",
        params,
      }),
      providesTags: ["Order"],
    }),

    getVendorOrderDetails: builder.query<
      { success: boolean; data: Order },
      string
    >({
      query: (uuid) => `/user/vendor/orders/${uuid}/`,
      providesTags: ["Order"],
    }),

    updateVendorOrderStatus: builder.mutation<
      { success: boolean; data: Order },
      { uuid: string; status: string }
    >({
      query: ({ uuid, ...body }) => ({
        url: `/user/vendor/orders/${uuid}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Order"],
    }),

    // Analytics
    getVendorAnalytics: builder.query<
      { success: boolean; data: VendorAnalytics },
      void
    >({
      query: () => "/user/vendor/analytics/",
      providesTags: ["Analytics"],
    }),

    // Wallet Management
    getWalletBalance: builder.query<
      { success: boolean; data: WalletBalance },
      void
    >({
      query: () => "/user/vendor/wallet/",
      providesTags: ["Payment"],
    }),

    requestWithdrawal: builder.mutation<
      { success: boolean; message: string },
      { amount: string; pin: string }
    >({
      query: (body) => ({
        url: "/user/vendor/wallet/withdraw/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Payment"],
    }),

    getTransactionHistory: builder.query<
      { success: boolean; data: Transaction[] },
      { type?: string }
    >({
      query: (params) => ({
        url: "/user/vendor/wallet/transactions/",
        params,
      }),
      providesTags: ["Payment"],
    }),

    // Payment Settings
    getPaymentSettings: builder.query<
      { success: boolean; data: PaymentSettings },
      void
    >({
      query: () => "/user/vendor/payment-settings/",
      providesTags: ["Payment"],
    }),

    updatePaymentSettings: builder.mutation<
      { success: boolean; data: PaymentSettings },
      Partial<PaymentSettings>
    >({
      query: (body) => ({
        url: "/user/vendor/payment-settings/",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Payment"],
    }),

    setPaymentPIN: builder.mutation<
      { success: boolean; message: string },
      { pin: string; confirm_pin: string }
    >({
      query: (body) => ({
        url: "/user/vendor/payment-settings/pin/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Payment"],
    }),

    verifyPaymentPIN: builder.mutation<
      { success: boolean; valid: boolean },
      { pin: string }
    >({
      query: (body) => ({
        url: "/user/vendor/payment-settings/pin/verify/",
        method: "POST",
        body,
      }),
    }),

    requestPINReset: builder.mutation<
      { success: boolean; message: string },
      void
    >({
      query: () => ({
        url: "/user/vendor/payment-settings/pin/forgot/",
        method: "POST",
      }),
    }),

    // Notifications
    getVendorNotifications: builder.query<
      { success: boolean; data: Notification[] },
      void
    >({
      query: () => "/user/vendor/notifications/",
      providesTags: ["Notification"],
    }),

    markNotificationAsRead: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/user/vendor/notifications/${id}/read/`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),

    // Account Management
    deleteAccount: builder.mutation<void, { password: string }>({
      query: (body) => ({
        url: "/user/vendor/account/",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["Vendor", "Auth"],
    }),
  }),
});

export const {
  useGetVendorProfileQuery,
  usePartialUpdateVendorProfileMutation,
  useChangeVendorPasswordMutation,
  useGetStoreProductsQuery,
  useCreateStoreProductMutation,
  useGetStoreProductDetailsQuery,
  useUpdateStoreProductMutation,
  usePartialUpdateStoreProductMutation,
  useDeleteStoreProductMutation,
  useGetDraftsQuery,
  useGetDraftDetailsQuery,
  useCreateDraftMutation,
  useUpdateDraftMutation,
  useSubmitDraftMutation,
  useDeleteDraftMutation,
  useGetVendorOrdersQuery,
  useGetVendorOrdersListQuery,
  useGetVendorOrderDetailsQuery,
  useUpdateVendorOrderStatusMutation,
  useGetVendorAnalyticsQuery,
  useGetWalletBalanceQuery,
  useRequestWithdrawalMutation,
  useGetTransactionHistoryQuery,
  useGetPaymentSettingsQuery,
  useUpdatePaymentSettingsMutation,
  useSetPaymentPINMutation,
  useVerifyPaymentPINMutation,
  useRequestPINResetMutation,
  useGetVendorNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useDeleteAccountMutation,
} = vendorApi;
