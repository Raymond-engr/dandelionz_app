import { baseApi } from "./baseApi";

interface AdminProfile {
  uuid: string;
  email: string;
  full_name: string;
  phone_number: string | null;
  profile_picture: string | null;
  role?: string;
  is_verified?: boolean;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
  position?: string;
  can_manage_vendors?: boolean;
  can_manage_orders?: boolean;
  can_manage_payouts?: boolean;
  can_manage_inventory?: boolean;
}

interface Analytics {
  total_orders: number;
  total_revenue: string;
  pending_orders: number;
  delivered_orders: number;
  total_vendors: number;
}

interface DetailedAnalytics {
  total_sales: string;
  total_vendors: number;
  total_orders: number;
  total_users: number;
  sales_chart_data: { period: string; sales: number }[];
  order_stats: {
    completed: number;
    pending: number;
    cancelled: number;
    returned: number;
  };
}

interface OrderSummary {
  pending: number;
  shipped: number;
  delivered: number;
}

export interface Vendor {
  user_uuid: string;
  email: string;
  store_name: string;
  is_verified_vendor: boolean;
  is_active: boolean;
  address?: string;
}

export interface User {
  uuid: string;
  email: string;
  full_name: string;
  phone_number: string;
  role: string;
  is_verified: boolean;
  status: string;
  created_at: string;
  address?: string;
  total_spend?: string;
  total_orders?: string;
  suspension_history?: string;
}

export interface Order {
  uuid?: string;
  order_id: string;
  customer: {
    uuid?: string;
    full_name: string;
    email: string;
    phone_number?: string;
  };
  vendor?: {
    uuid: string;
    store_name: string;
  };
  total_amount?: string;
  total_price: string;
  delivery_fee?: string;
  payment_status?: string;
  status: string;
  current_status?: string;
  created_at?: string;
  ordered_at: string;
  updated_at: string;
  shipping_address?: ShippingAddress;
  order_items?: OrderItem[];
}

export interface Product {
  slug: string;
  name: string;
  price: string;
  vendor: {
    uuid: string;
    store_name: string;
  };
  category: string;
  status: string;
  stock: number;
  discount?: number; // Added discount field
}

interface AdminProduct {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: string;
  category: string; // Name of the category
  stock: number;
  image: string | null; // Product image URL
  images?: any[]; // Added images array
  discount?: number; // Added discount field
  uploadDate: string; // Date when the product was uploaded
  vendor: {
    uuid: string;
    store_name: string;
    email: string;
  };
  status: 'PENDING' | 'APPROVED' | 'REJECTED'; // Specific status for admin actions
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  created_at: string;
  product_count: number;
  total_sales: string;
}

interface Payment {
  id: string;
  order_uuid: string;
  amount: string;
  payment_method: string;
  status: string;
  created_at: string;
}

interface Settlement {
  id: string;
  vendor_uuid: string;
  vendor_name: string;
  amount: string;
  status: string;
  created_at: string;
}

export interface WalletStats {
  withdrawable_balance: string;
  available_balance: string;
  total_earnings: string;
  total_withdrawals: number;
  this_month_earnings: string;
}

export interface WalletTransaction {
  id: string;
  type: string;
  amount: string;
  description: string;
  status: string;
  created_at: string;
}

export interface AdminPaymentSettings {
  bank_name: string;
  account_number: string;
  account_name: string;
}

export interface SettlementSummary {
  total_revenue: string;
  total_payouts: string;
  pending_settlements: string;
  upcoming_payouts: number;
}

export interface VendorSettlement {
  id: string;
  vendor_name: string;
  amount: string;
  payout_date: string;
  status: string;
}

export interface Dispute {
  id: string;
  order_id: string;
  customer_name: string;
  vendor_name: string;
  amount: string;
  reason: string;
  status: string;
  created_at: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  recipient_type: "USERS" | "VENDORS" | "ALL" | "ADMIN";
  status: string;
  created_at: string;
  scheduled_at: string | null;
}

export interface ShippingAddress {
  address: string;
  city: string;
  state: string;
  zip_code: string;
}

export interface OrderItem {
  product_name: string;
  quantity: number;
  item_subtotal: string;
  vendor_name: string;
}

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Profile Management
    getAdminProfile: builder.query<
      { success: boolean; data: AdminProfile },
      void
    >({
      query: () => "/user/admin/account/profile/",
      providesTags: ["Admin"],
    }),

    changeAdminPassword: builder.mutation<
      { success: boolean; message: string },
      { current_password: string; new_password: string }
    >({
      query: (body) => ({
        url: "/user/admin/change-password/",
        method: "POST",
        body,
      }),
    }),

    updateAdminProfile: builder.mutation<
      { success: boolean; data: AdminProfile },
      { full_name: string; phone_number: string }
    >({
      query: (body) => ({
        url: "/user/admin/account/profile/",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Admin"],
    }),

    uploadAdminPhoto: builder.mutation<
      { success: boolean; data: { profile_picture: string } },
      FormData
    >({
      query: (body) => ({
        url: "/user/admin/account/photo/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Admin"],
    }),

    // Admin Wallet & Withdrawals
    getWalletStats: builder.query<{ success: boolean; data: WalletStats }, void>({
      query: () => "/user/admin/wallet/",
      providesTags: ["Wallet"],
    }),

    getWalletTransactions: builder.query<{ success: boolean; data: WalletTransaction[] }, void>({
      query: () => "/user/admin/wallet/transactions/",
      providesTags: ["Wallet"],
    }),

    requestWithdrawal: builder.mutation<{ success: boolean; message: string }, { amount: string; pin: string }>({
      query: (body) => ({
        url: "/user/admin/wallet/withdraw/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Wallet"],
    }),

    // Admin Payment Settings
    getAdminPaymentSettings: builder.query<{ success: boolean; data: AdminPaymentSettings }, void>({
      query: () => "/user/admin/payment-settings/",
      providesTags: ["AdminPaymentSettings"],
    }),

    updateAdminPaymentSettings: builder.mutation<{ success: boolean; data: AdminPaymentSettings }, Partial<AdminPaymentSettings>>({
      query: (body) => ({
        url: "/user/admin/payment-settings/",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["AdminPaymentSettings"],
    }),

    changePaymentPin: builder.mutation<{ success: boolean; message: string }, { current_pin?: string; new_pin: string; confirm_pin: string }>({
      query: (body) => ({
        url: "/user/admin/payment-settings/pin/",
        method: "POST",
        body,
      }),
    }),

    forgotPaymentPin: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: "/user/admin/payment-settings/pin/forgot/",
        method: "POST",
      }),
    }),
    
    // Settlements & Payouts (Platform Dashboard)
    getSettlementSummary: builder.query<{ success: boolean; data: SettlementSummary }, void>({
      query: () => "/user/admin/settlements/summary/",
      providesTags: ["Settlement"],
    }),

    getVendorSettlements: builder.query<{ success: boolean; data: VendorSettlement[] }, { status?: string }>({
      query: (params) => ({
        url: "/user/admin/settlements/vendor/",
        params,
      }),
      providesTags: ["Settlement"],
    }),

    // Disputes
    getAllDisputes: builder.query<{ success: boolean; data: Dispute[] }, { status?: string }>({
      query: (params) => ({
        url: "/user/admin/settlements/disputes/",
        params,
      }),
      providesTags: ["Settlement"],
    }),

    resolveDispute: builder.mutation<{ success: boolean; message: string }, { id: string; action: string; admin_note?: string }>({
      query: ({ id, ...body }) => ({
        url: `/user/admin/settlements/disputes/${id}/resolve/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Settlement"],
    }),

    // Analytics
    getAnalytics: builder.query<{ success: boolean; data: Analytics }, void>({
      query: () => "/user/admin/analytics/",
      providesTags: ["Analytics"],
    }),

    getDetailedAnalytics: builder.query<
      { success: boolean; data: DetailedAnalytics },
      void
    >({
      query: () => "/user/admin/analytics/detailed/",
      providesTags: ["Analytics"],
    }),

    // User Management
    getAllUsers: builder.query<
      { success: boolean; data: User[] },
      { role?: string; status?: string }
    >({
      query: (params) => ({
        url: "/user/admin/users/",
        params,
      }),
      providesTags: ["User"],
    }),

    getUserDetails: builder.query<{ success: boolean; data: User }, string>({
      query: (uuid) => `/user/admin/users/${uuid}/`,
      providesTags: ["User"],
    }),

    suspendUser: builder.mutation<
      { success: boolean; suspended: boolean },
      { user_uuid: string; suspend: boolean }
    >({
      query: (body) => ({
        url: "/user/admin/users/suspend/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User", "Vendor"],
    }),

    updateUserStatus: builder.mutation<
      { success: boolean; message: string },
      { uuid: string; action: "suspend" | "activate"; reason: string }
    >({
      query: ({ uuid, ...body }) => ({
        url: `/user/admin/users/${uuid}/suspend/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // Vendor Management
    getAllVendors: builder.query<{ success: boolean; data: Vendor[] }, void>({
      query: () => "/user/admin/vendors/",
      providesTags: ["Vendor"],
    }),

    getVendorDetails: builder.query<{ success: boolean; data: Vendor }, string>(
      {
        query: (uuid) => `/user/admin/vendors/${uuid}/`,
        providesTags: ["Vendor"],
      }
    ),

    approveVendor: builder.mutation<
      { success: boolean; approved: boolean },
      { user_uuid: string; approve: boolean }
    >({
      query: (body) => ({
        url: "/user/admin/vendors/approve/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Vendor"],
    }),

    verifyVendorKYC: builder.mutation<
      { success: boolean; message: string },
      { user_uuid: string }
    >({
      query: (body) => ({
        url: "/user/admin/vendors/verify-kyc/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Vendor"],
    }),

    suspendVendorWithReason: builder.mutation<
      { success: boolean; message: string },
      { uuid: string; reason: string }
    >({
      query: ({ uuid, ...body }) => ({
        url: `/user/admin/vendors/${uuid}/suspend/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Vendor"],
    }),

    getVendorProducts: builder.query<
      { success: boolean; data: Product[] },
      string
    >({
      query: (uuid) => `/user/admin/vendors/${uuid}/products/`,
      providesTags: ["Product"],
    }),

    getVendorOrders: builder.query<{ success: boolean; data: Order[] }, string>(
      {
        query: (uuid) => `/user/admin/vendors/${uuid}/orders/`,
        providesTags: ["Order"],
      }
    ),

    getVendorAnalytics: builder.query<
      { success: boolean; data: Analytics },
      string
    >({
      query: (uuid) => `/user/admin/vendors/${uuid}/analytics/`,
      providesTags: ["Analytics"],
    }),

    // Order Management
    getOrderSummary: builder.query<
      { success: boolean; data: OrderSummary },
      void
    >({
      query: () => "/user/admin/orders/summary/",
      providesTags: ["Order"],
    }),

    getAllOrders: builder.query<
      { success: boolean; data: Order[] },
      { status?: string; vendor_uuid?: string }
    >({
      query: (params) => ({
        url: "/user/admin/orders/",
        params,
      }),
      providesTags: ["Order"],
    }),

    getOrderDetails: builder.query<{ success: boolean; data: Order }, string>({
      query: (order_id) => `/user/admin/orders/${order_id}/`,
      providesTags: ["Order"],
    }),

    updateOrderStatus: builder.mutation<
      { success: boolean; data: Order },
      { order_id: string; status: string }
    >({
      query: ({ order_id, ...body }) => ({
        url: `/user/admin/orders/${order_id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Order"],
    }),

    cancelOrderWithReason: builder.mutation<
      { success: boolean; message: string },
      { order_id: string; reason: string }
    >({
      query: ({ order_id, ...body }) => ({
        url: `/user/admin/orders/${order_id}/cancel/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Order"],
    }),

    assignLogistics: builder.mutation<
      { success: boolean; message: string },
      { order_uuid: string }
    >({
      query: (body) => ({
        url: "/user/admin/orders/assign-logistics/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Order"],
    }),

    processRefund: builder.mutation<
      { success: boolean; message: string },
      { order_uuid: string }
    >({
      query: (body) => ({
        url: "/user/admin/orders/refund/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Order", "Payment"],
    }),

    getOrderItems: builder.query<{ success: boolean; data: any[] }, string>({
      query: (uuid) => `/user/admin/orders/${uuid}/items/`,
      providesTags: ["Order"],
    }),

    // Product Management
    getAllProducts: builder.query<
      { success: boolean; data: Product[] },
      { status?: string; category?: string }
    >({
      query: (params) => ({
        url: "/user/admin/products/",
        params,
      }),
      providesTags: ["Product"],
    }),

    getProductDetails: builder.query<
      { success: boolean; data: Product },
      string
    >({
      query: (slug) => `/user/admin/products/${slug}/`,
      providesTags: ["Product"],
    }),

    getAdminProductDetails: builder.query<
      { success: boolean; data: AdminProduct },
      string
    >({
      query: (slug) => `/store/admin/products/${slug}/`,
      providesTags: ["Product"],
    }),

    approveProduct: builder.mutation<
      { success: boolean; message: string },
      { slug: string; approve: boolean }
    >({
      query: ({ slug, ...body }) => ({
        url: `/user/admin/products/${slug}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Product"],
    }),

    approveProductAdmin: builder.mutation<
      { success: boolean; message: string },
      string // Only slug is required in the URL
    >({
      query: (slug) => ({
        url: `/store/admin/products/${slug}/approve/`,
        method: "POST",
      }),
      invalidatesTags: ["Product"],
    }),

    rejectProductAdmin: builder.mutation<
      { success: boolean; message: string },
      { slug: string; reason?: string }
    >({
      query: ({ slug, ...body }) => ({
        url: `/store/admin/products/${slug}/reject/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Product"],
    }),

    deleteProduct: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (slug) => ({
        url: `/user/admin/products/${slug}/delete/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),

    // Category Management
    getAllCategories: builder.query<
      { success: boolean; data: Category[] },
      void
    >({
      query: () => "/store/categories/",
      providesTags: ["Category"],
    }),

    getCategory: builder.query<{ success: boolean; data: Category }, string>({
      query: (slug) => `/store/categories/${slug}/`,
      providesTags: ["Category"],
    }),

    createCategory: builder.mutation<
      { success: boolean; data: Category },
      FormData
    >({
      query: (body) => ({
        url: "/store/categories/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Category"],
    }),

    updateCategory: builder.mutation<
      { success: boolean; data: Category },
      { slug: string; data: FormData }
    >({
      query: ({ slug, data }) => ({
        url: `/store/categories/${slug}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),

    deleteCategory: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (slug) => ({
        url: `/store/categories/${slug}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),

    // Payment Management
    getAllPayments: builder.query<{ success: boolean; data: Payment[] }, void>({
      query: () => "/user/admin/payments/",
      providesTags: ["Payment"],
    }),

    getPaymentDetails: builder.query<
      { success: boolean; data: Payment },
      string
    >({
      query: (id) => `/user/admin/payments/${id}/`,
      providesTags: ["Payment"],
    }),

    // Settlement Management
    getAllSettlements: builder.query<
      { success: boolean; data: Settlement[] },
      void
    >({
      query: () => "/user/admin/settlements/",
      providesTags: ["Settlement"],
    }),

    getPayoutHistory: builder.query<{ success: boolean; data: any[] }, void>({
      query: () => "/user/admin/settlements/payout/",
      providesTags: ["Settlement"],
    }),

    triggerPayout: builder.mutation<
      { success: boolean; message: string },
      { user_uuid: string }
    >({
      query: (body) => ({
        url: "/user/admin/payouts/trigger/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Settlement", "Payment"],
    }),

    // Dispute Management
    getDisputeDetails: builder.query<
      { success: boolean; data: Dispute },
      string
    >({
      query: (id) => `/user/admin/settlements/disputes/${id}/`,
      providesTags: ["Settlement"],
    }),

    // Notification Management
    getAllNotifications: builder.query<
      { success: boolean; data: Notification[] },
      void
    >({
      query: () => "/user/admin/notifications/",
      providesTags: ["Notification"],
    }),

    createNotification: builder.mutation<
      { success: boolean; data: Notification },
      Partial<Notification>
    >({
      query: (body) => ({
        url: "/user/admin/notifications/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Notification"],
    }),

    getNotificationDetails: builder.query<
      { success: boolean; data: Notification },
      string
    >({
      query: (id) => `/user/admin/notifications/${id}/`,
      providesTags: ["Notification"],
    }),

    deleteNotification: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/user/admin/notifications/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notification"],
    }),

    // Withdrawal Management
    getAllWithdrawals: builder.query<{ success: boolean; data: any[] }, void>({
      query: () => "/user/admin/withdrawals/",
      providesTags: ["Payment"],
    }),

    processWithdrawal: builder.mutation<
      { success: boolean; message: string },
      { withdrawal_id: string; approve: boolean }
    >({
      query: (body) => ({
        url: "/user/admin/withdrawals/process/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Payment", "Settlement"],
    }),
  }),
});

export const {
  useGetAdminProfileQuery,
  useChangeAdminPasswordMutation,
  useUpdateAdminProfileMutation,
  useUploadAdminPhotoMutation,
  useGetAnalyticsQuery,
  useGetDetailedAnalyticsQuery,
  useGetAllUsersQuery,
  useGetUserDetailsQuery,
  useSuspendUserMutation,
  useUpdateUserStatusMutation,
  useGetAllVendorsQuery,
  useGetVendorDetailsQuery,
  useApproveVendorMutation,
  useVerifyVendorKYCMutation,
  useSuspendVendorWithReasonMutation,
  useGetVendorProductsQuery,
  useGetVendorOrdersQuery,
  useGetVendorAnalyticsQuery,
  useGetOrderSummaryQuery,
  useGetAllOrdersQuery,
  useGetOrderDetailsQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderWithReasonMutation,
  useAssignLogisticsMutation,
  useProcessRefundMutation,
  useGetOrderItemsQuery,
  useGetAllProductsQuery,
  useGetProductDetailsQuery,
  useGetAdminProductDetailsQuery,
  useApproveProductMutation,
  useApproveProductAdminMutation,
  useRejectProductAdminMutation,
  useDeleteProductMutation,
  useGetAllCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetAllPaymentsQuery,
  useGetPaymentDetailsQuery,
  useGetAllSettlementsQuery,
  useGetVendorSettlementsQuery,
  useGetPayoutHistoryQuery,
  useTriggerPayoutMutation,
  useGetAllDisputesQuery,
  useGetDisputeDetailsQuery,
  useResolveDisputeMutation,
  useGetAllNotificationsQuery,
  useCreateNotificationMutation,
  useGetNotificationDetailsQuery,
  useDeleteNotificationMutation,
  useGetAllWithdrawalsQuery,
  useProcessWithdrawalMutation,
  useGetWalletStatsQuery,
  useGetWalletTransactionsQuery,
  useRequestWithdrawalMutation,
  useGetAdminPaymentSettingsQuery,
  useUpdateAdminPaymentSettingsMutation,
  useChangePaymentPinMutation,
  useForgotPaymentPinMutation,
  useGetSettlementSummaryQuery,
} = adminApi;
