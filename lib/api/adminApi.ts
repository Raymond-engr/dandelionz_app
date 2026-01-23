import { baseApi } from "./baseApi";

interface AdminProfile {
  user: {
    uuid: string;
    email: string;
    full_name: string;
    phone_number: string | null;
    profile_picture: string | null;
    role: string;
    referral_code: string;
    is_verified: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  position: string;
  can_manage_vendors: boolean;
  can_manage_orders: boolean;
  can_manage_payouts: boolean;
  can_manage_inventory: boolean;
}

interface Analytics {
  total_orders: number;
  total_revenue: string;
  pending_orders: number;
  delivered_orders: number;
}

interface OrderSummary {
  pending: number;
  shipped: number;
  delivered: number;
}

interface Vendor {
  user_uuid: string;
  email: string;
  store_name: string;
  is_verified_vendor: boolean;
  is_active: boolean;
}

interface User {
  uuid: string;
  email: string;
  full_name: string;
  phone_number: string;
  role: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
}

interface Order {
  uuid: string;
  order_id: string;
  customer: {
    uuid: string;
    full_name: string;
    email: string;
  };
  vendor: {
    uuid: string;
    store_name: string;
  };
  total_amount: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Product {
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
  uploadDate: string; // Date when the product was uploaded
  vendor: {
    uuid: string;
    store_name: string;
    email: string;
  };
  status: 'PENDING' | 'APPROVED' | 'REJECTED'; // Specific status for admin actions
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  created_at: string;
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

interface Dispute {
  id: string;
  order_uuid: string;
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
  recipient_type: "USERS" | "VENDORS" | "ALL";
  status: string;
  created_at: string;
  scheduled_at: string | null;
}

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Profile Management
    getAdminProfile: builder.query<
      { success: boolean; data: AdminProfile },
      void
    >({
      query: () => "/user/admin/profile/",
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

    // Analytics
    getAnalytics: builder.query<{ success: boolean; data: Analytics }, void>({
      query: () => "/user/admin/analytics/",
      providesTags: ["Analytics"],
    }),

    // User Management
    getAllUsers: builder.query<
      { success: boolean; data: User[] },
      { role?: string; is_active?: boolean }
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

    deleteUser: builder.mutation<{ success: boolean; message: string }, string>(
      {
        query: (uuid) => ({
          url: `/user/admin/users/${uuid}/`,
          method: "DELETE",
        }),
        invalidatesTags: ["User"],
      }
    ),

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
      query: (uuid) => `/user/admin/orders/${uuid}/`,
      providesTags: ["Order"],
    }),

    updateOrderStatus: builder.mutation<
      { success: boolean; data: Order },
      { uuid: string; status: string }
    >({
      query: ({ uuid, ...body }) => ({
        url: `/user/admin/orders/${uuid}/`,
        method: "PATCH",
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
      query: () => "/user/admin/products/categories/",
      providesTags: ["Category"],
    }),

    getCategory: builder.query<{ success: boolean; data: Category }, number>({
      query: (id) => `/user/admin/products/categories/${id}/`,
      providesTags: ["Category"],
    }),

    createCategory: builder.mutation<
      { success: boolean; data: Category },
      Partial<Category>
    >({
      query: (body) => ({
        url: "/user/admin/products/categories/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Category"],
    }),

    updateCategory: builder.mutation<
      { success: boolean; data: Category },
      { id: number; data: Partial<Category> }
    >({
      query: ({ id, data }) => ({
        url: `/user/admin/products/categories/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),

    deleteCategory: builder.mutation<
      { success: boolean; message: string },
      number
    >({
      query: (id) => ({
        url: `/user/admin/products/categories/${id}/`,
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

    getVendorSettlements: builder.query<
      { success: boolean; data: Settlement[] },
      void
    >({
      query: () => "/user/admin/settlements/vendor/",
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
    getAllDisputes: builder.query<
      { success: boolean; data: Dispute[] },
      { status?: string }
    >({
      query: (params) => ({
        url: "/user/admin/settlements/disputes/",
        params,
      }),
      providesTags: ["Settlement"],
    }),

    getDisputeDetails: builder.query<
      { success: boolean; data: Dispute },
      string
    >({
      query: (id) => `/user/admin/settlements/disputes/${id}/`,
      providesTags: ["Settlement"],
    }),

    resolveDispute: builder.mutation<
      { success: boolean; message: string },
      { id: string; action: string; reason: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/user/admin/settlements/disputes/${id}/resolve/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Settlement", "Order"],
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
  useGetAnalyticsQuery,
  useGetAllUsersQuery,
  useGetUserDetailsQuery,
  useSuspendUserMutation,
  useDeleteUserMutation,
  useGetAllVendorsQuery,
  useGetVendorDetailsQuery,
  useApproveVendorMutation,
  useVerifyVendorKYCMutation,
  useGetVendorProductsQuery,
  useGetVendorOrdersQuery,
  useGetVendorAnalyticsQuery,
  useGetOrderSummaryQuery,
  useGetAllOrdersQuery,
  useGetOrderDetailsQuery,
  useUpdateOrderStatusMutation,
  useAssignLogisticsMutation,
  useProcessRefundMutation,
  useGetOrderItemsQuery,
  useGetAllProductsQuery,
  useGetProductDetailsQuery,
  useGetAdminProductDetailsQuery,
  useApproveProductMutation,
  useApproveProductAdminMutation,
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
} = adminApi;
