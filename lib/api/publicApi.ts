import { baseApi } from "./baseApi";

export interface ProductImage {
  id: number;
  image: string;
  image_url: string;
  is_main: boolean;
  alt_text?: string | null;
  variant_association?: any;
  display_order: number;
  uploaded_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  product_id?: number; // Optional in case it's not strictly passed as flat id
  product: {
    id: number;
    name: string;
    price: string;
    image?: string;
    description?: string;
    tags?: string;
    brand?: string;
    variants?: any[];
    discount?: number;
  };
  quantity: number;
  price_at_purchase?: string;
  item_subtotal: number;
}

export interface OrderTimeline {
  status: string;
  label: string;
  timestamp: string;
  description?: string;
  completed: boolean;
}

export interface Order {
  id: number;
  order_id: string;
  customer: string;
  customer_email: string;
  status: string;
  payment_status: string;
  total_price: string;
  delivery_fee: string;
  /** Whether the separately-billed delivery fee has been settled. */
  delivery_fee_paid?: boolean;
  /** Start of the scheduled delivery window (ISO); null until an admin schedules it. */
  expected_delivery_earliest?: string | null;
  /** End of the scheduled delivery window (ISO); null until an admin schedules it. */
  expected_delivery_latest?: string | null;
  discount: string;
  total_with_delivery: string;
  is_delivered: boolean;
  ordered_at: string;
  created_at?: string;
  tracking_number?: string;
  shipping_address?: {
    full_name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    phone_number?: string;
  };
  order_items?: OrderItem[];
  timeline?: OrderTimeline[];
}

export interface Product {
  id: number;
  name: string;
  price: string;
  rating?: number;
  image?: string | null;
  images?: ProductImage[];
  slug?: string;
  store?: number;
  store_name?: string;
  vendor?: {
    id: number;
    store_name: string;
    email_address: string;
    vendor_status: string;
    store_description: string;
    address: string;
  };
  vendorName?: string;
  description?: string;
  category?: string;
  category_name?: string;
  discounted_price?: string;
  discount?: number; // Added discount percentage
  stock?: number;
  brand?: string;
  tags?: string;
  variants?: any[];
  videos?: any[];
  in_stock?: boolean;
  approval_status?: string;
  uploaded_date?: string;
  created_at?: string;
  updated_at?: string;
  reviews?: any[];
}

export interface InstallmentPayment {
  id: number;
  payment_number: number;
  amount: string;
  status: 'PAID' | 'PENDING' | 'FAILED';
  due_date: string;
  payment_date: string | null;
  reference: string;
  gateway: string;
  paid_at: string | null;
  verified: boolean;
  created_at: string;
  is_overdue: boolean;
}

export interface InstallmentPlan {
  id: number;
  order_id: string;
  duration: string;
  total_amount: string;
  installment_amount: string;
  number_of_installments: number;
  paid_installments_count: number;
  pending_installments_count: number;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'DEFAULTED';
  is_fully_paid: boolean;
  start_date: string;
  created_at: string;
  updated_at: string;
  installments?: InstallmentPayment[];
  // Running-balance ("CDcare") fields: installments are now a balance the customer pays
  // down flexibly rather than a fixed per-row schedule.
  amount_paid: number;
  balance_remaining: number;
  /** 0..1 — share of total_amount that has been paid. Order ships once this reaches 0.5. */
  paid_fraction: number;
  /** Smallest amount that must be paid right now (0 when nothing is currently due). */
  minimum_due_now: number;
  next_due_date: string | null;
}

export interface CartItem {
  id: number;
  product: number;
  product_details: Product;
  quantity: number;
  selected_variants: Record<string, string>;
  subtotal: string;
}

export interface Cart {
  id: number;
  customer: string;
  items: CartItem[];
  total: string;
  created_at: string;
  updated_at: string;
}

type GetProductsResponse = {
  success: boolean;
  data: Product[];
};

export type SearchSuggestion = {
  name: string;
  slug: string;
};

type SearchSuggestionsResponse = {
  success: boolean;
  data: {
    products: SearchSuggestion[];
    categories: SearchSuggestion[];
  };
};

export type RecommendationType = "related" | "for-you" | "trending";

export type RecommendationParams = {
  type: RecommendationType;
  /** Required for `related`: the slug of the product being viewed. */
  product?: string;
  /** Narrows `trending` to a single category. */
  category?: string;
  limit?: number;
};

/** Same envelope as /store/products/, so `Product` is reused verbatim. */
type RecommendationsResponse = {
  success: boolean;
  data: Product[];
};

export type InteractionEventType = "view" | "cart_add";

// Public/Store API (no auth required)
export const publicApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Products
    getProducts: builder.query<
      GetProductsResponse,
      { 
        category?: string; 
        search?: string; 
        page?: number;
        store?: string;
        min_price?: number;
        max_price?: number;
        price?: number; // for exact price match
        ordering?: string;
      }
    >({
      query: (params) => ({
        url: "/store/products/",
        params,
      }),
      providesTags: ["Product"],
    }),

    getProductBySlug: builder.query<{ success: boolean; data: Product }, string>({
      query: (slug) => `/store/products/${slug}/`,
      providesTags: ["Product"],
    }),

    getSearchSuggestions: builder.query<SearchSuggestionsResponse, string>({
      query: (q) => ({
        url: "/store/products/suggestions/",
        params: { q },
      }),
      // Deliberately untagged: suggestions are a transient typeahead aid, and
      // invalidating them on every product mutation would refetch constantly.
    }),

    getRecommendations: builder.query<RecommendationsResponse, RecommendationParams>({
      query: ({ type, product, category, limit }) => ({
        url: "/store/recommendations/",
        // fetchBaseQuery drops undefined params, so the optional ones simply
        // don't appear for the surfaces that never send them.
        params: { type, product, category, limit },
      }),
      // Untagged for the same reason as suggestions: these are ranked feeds,
      // and invalidating on "Product" would refetch every row on any write.
    }),

    recordInteraction: builder.mutation<
      unknown,
      { product: string; event_type: InteractionEventType }
    >({
      query: (body) => ({
        url: "/store/events/",
        method: "POST",
        body,
      }),
      // No invalidation on purpose. This is fire-and-forget telemetry, and
      // re-ranking a visible feed mid-session would shuffle products out from
      // under the shopper's finger.
    }),

    // Categories
    getCategories: builder.query<any[], void>({
      query: () => "/store/categories/",
      providesTags: ["Category"],
    }),

    // Cart (requires auth)
    getCart: builder.query<{ success: boolean; data: Cart }, void>({
      query: () => "/store/cart/",
      providesTags: ["Cart"],
    }),

    addToCart: builder.mutation<
      { success: boolean; data: CartItem; message?: string },
      { slug: string; quantity: number; selected_variants?: Record<string, string> }
    >({
      query: (body) => ({
        url: "/store/cart/add/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),

    removeFromCart: builder.mutation<
      { success: boolean; message: string },
      { slug: string; selected_variants?: Record<string, string> }
    >({
      query: ({ slug, selected_variants }) => {
        let url = `/store/cart/remove/${slug}/`;
        if (selected_variants && Object.keys(selected_variants).length > 0) {
          const variantsJson = JSON.stringify(selected_variants);
          url += `?selected_variants=${encodeURIComponent(variantsJson)}`;
        }
        return {
          url,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Cart"],
    }),

    updateCartItem: builder.mutation<
      { success: boolean; data?: CartItem; message: string },
      { slug: string; quantity: number; selected_variants?: Record<string, string> }
    >({
      query: (body) => ({
        url: "/store/cart/update/",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),

    // Wishlist
    getWishlist: builder.query<any[], void>({
      query: () => "/store/favourites/",
      providesTags: ["Wishlist"],
    }),

    addToWishlist: builder.mutation<
      { success: boolean; message: string },
      { slug: string }
    >({
      query: (body) => ({
        url: "/store/favourites/add/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Wishlist"],
    }),

    removeFromWishlist: builder.mutation<
      { success: boolean; message: string },
      string // slug
    >({
      query: (slug) => ({
        url: `/store/favourites/remove/${slug}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),

    // Orders
    getCustomerOrders: builder.query<
      Order[],
      { status?: string }
    >({
      query: (params) => ({
        url: "/transactions/orders/",
        params,
      }),
      providesTags: ["Order"],
    }),

    createOrder: builder.mutation<{ success: boolean; data: any }, any>({
      query: (body) => ({
        url: "/transactions/orders/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Order", "Cart"],
    }),

    getCustomerOrderDetails: builder.query<Order, string>({
      query: (uuid) => `/transactions/orders/${uuid}/`,
      providesTags: ["Order"],
    }),

    getOrderReceipt: builder.query<{ success: boolean; data: any }, string>({
      query: (uuid) => `/transactions/orders/${uuid}/receipt/`,
      providesTags: ["Order"],
    }),

    payForOrder: builder.mutation<
      { success: boolean; data: any },
      { uuid: string; payment_method: string }
    >({
      query: ({ uuid, ...body }) => ({
        url: `/transactions/orders/${uuid}/pay/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Order", "Payment"],
    }),

    cancelOrder: builder.mutation<
      { success: boolean; data: { order_id: string; status: string; refund_pending: boolean }; message: string },
      string // order_id
    >({
      query: (order_id) => ({
        url: `/transactions/orders/${order_id}/cancel/`,
        method: 'POST',
      }),
      invalidatesTags: ['Order'],
    }),

    // Reviews
    addProductReview: builder.mutation<
      { success: boolean; data: any },
      { slug: string; rating: number; comment: string }
    >({
      query: ({ slug, ...body }) => ({
        url: `/store/products/${slug}/review/add/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Product"],
    }),

    getProductReviews: builder.query<any[], string>(
      {
        query: (slug) => `/store/products/${slug}/reviews/`,
        providesTags: ["Product"],
      }
    ),

    // Payments
    initializeCheckout: builder.mutation<
      {
        success: boolean;
        data: {
          order_id: string;
          /** The card leg only. On a split payment this is less than total_amount. */
          amount: number;
          reference: string;
          /** Null when the wallet covered the whole order and there is no card leg. */
          authorization_url: string | null;
          access_code?: string;
          /** How much of the order the wallet paid. */
          wallet_amount: number;
          total_amount: number;
          /**
           * False when the wallet covered everything. The client must then skip the
           * Paystack redirect — the order is already paid.
           */
          requires_payment: boolean;
          delivery_fee: number;
        };
        message: string;
      },
      { use_wallet?: boolean; wallet_amount?: number } | void
    >({
      query: (body) => ({
        url: "/transactions/checkout/",
        method: "POST",
        body: body || {},
      }),
      // The wallet is debited when checkout starts, not when the card leg lands, so the
      // balance has really changed by the time this returns.
      invalidatesTags: ["Cart", "Order", "CustomerWallet"],
    }),

    initializeInstallmentCheckout: builder.mutation<
      {
        success: boolean;
        data: {
          order_id: string;
          installment_plan_id: number;
          duration: string;
          total_amount: number;
          number_of_installments: number;
          installment_amount: number;
          first_installment_reference: string;
          authorization_url: string;
          delivery_fee: number;
        };
        message: string;
      },
      { duration: string }
    >({
      query: (body) => ({
        url: "/transactions/checkout/installment/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart", "Order"],
    }),

    // Delivery fee is billed separately from the goods, after an admin schedules the order.
    // Mirrors the checkout split-payment flow: the wallet can cover part or all of the fee,
    // and only the remainder (if any) goes to Paystack.
    initializeDeliveryPayment: builder.mutation<
      {
        success: boolean;
        data: {
          /**
           * False when the wallet covered the whole fee: it is already paid, so the client
           * must skip the Paystack redirect.
           */
          requires_payment: boolean;
          /** Null when the wallet covered everything and there is no card leg. */
          authorization_url?: string | null;
          reference: string;
          wallet_amount: number;
          card_amount: number;
          order_id: string;
        };
        message?: string;
      },
      { order_id: string; use_wallet: boolean; wallet_amount?: number }
    >({
      query: ({ order_id, ...body }) => ({
        url: `/transactions/orders/${order_id}/delivery-payment/`,
        method: "POST",
        body,
      }),
      // The wallet is debited when the delivery payment starts, not when the card leg lands.
      invalidatesTags: ["Order", "CustomerWallet"],
    }),

    // Called after returning from Paystack for a delivery fee. Delivery references are
    // prefixed DLV-, distinguishing them from order (no prefix), installment and DEP- refs.
    verifyDeliveryPayment: builder.query<
      {
        success: boolean;
        data: {
          reference: string;
          status: string;
          order_id: string;
          delivery_fee_paid: boolean;
        };
      },
      { reference: string }
    >({
      query: ({ reference }) => ({
        url: `/transactions/verify-delivery-payment/?reference=${reference}`,
        method: "GET",
      }),
      providesTags: ["Order"],
      // A successful verify is when the balance and the order's paid flag actually change.
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(publicApi.util.invalidateTags(["Order", "CustomerWallet"]));
        } catch {
          // Verification failed; nothing changed, so there is nothing to refresh.
        }
      },
    }),

    verifyPayment: builder.query<
      {
        status: string;
        message: string;
        data: {
          amount: string;
          reference: string;
          status: string;
          paid_at: string;
        };
      },
      { reference: string }
    >({
      query: ({ reference }) => ({
        url: `/transactions/verify-payment/?reference=${reference}`,
        method: "GET",
      }),
      providesTags: ["Order"],
    }),

    // Called after returning from Paystack for an installment payment. Installment references
    // are prefixed INS-, distinguishing them from order (no prefix), delivery (DLV-) and
    // deposit (DEP-) refs. Verifying settles the running balance and may complete the plan.
    verifyInstallmentPayment: builder.query<
      {
        success: boolean;
        message?: string;
        data: {
          reference: string;
          status: string;
          plan_id: number;
          order_id: string;
          amount_paid: number;
          balance_remaining: number;
          plan_status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'DEFAULTED';
        };
      },
      { reference: string }
    >({
      query: ({ reference }) => ({
        url: `/transactions/verify-installment-payment/?reference=${reference}`,
        method: "GET",
      }),
      providesTags: ["Order"],
      // A successful verify is the moment the balance and plan status actually change.
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(publicApi.util.invalidateTags(["Order", "CustomerWallet"]));
        } catch {
          // Verification failed; nothing changed, so there is nothing to refresh.
        }
      },
    }),

    // Pay down the installment running balance. Send an explicit `amount`, or omit it with
    // `clear_balance: true` to pay off the whole balance. `use_wallet` spends wallet balance
    // first (mirrors the delivery-fee flow). When the wallet covers the payment the response
    // has requires_payment: false and no card leg; otherwise redirect to authorization_url.
    payInstallment: builder.mutation<
      {
        success: boolean;
        data: {
          /** False when the wallet settled it: already paid, so skip the Paystack redirect. */
          requires_payment: boolean;
          /** Null when the wallet covered everything and there is no card leg. */
          authorization_url?: string | null;
          reference: string;
          method: 'WALLET' | 'CARD';
          amount: number;
          plan_id: number;
          order_id: string;
        };
        message?: string;
      },
      { plan_id: number; amount?: number; clear_balance?: boolean; use_wallet?: boolean }
    >({
      query: (body) => ({
        url: "/transactions/installment-plans/init-payment/",
        method: "POST",
        body,
      }),
      // The wallet is debited when the payment starts, not when the card leg lands.
      invalidatesTags: ["Order", "CustomerWallet"],
    }),

    getInstallmentPlans: builder.query<{ success: boolean; data: InstallmentPlan[] }, void>({
      query: () => "/transactions/installment-plans/",
      providesTags: ["Order"],
    }),

    getInstallmentPlanDetails: builder.query<{ success: boolean; data: InstallmentPlan }, number>({
      query: (id) => `/transactions/installment-plans/${id}/`,
      providesTags: ["Order"],
    }),

    getInstallmentPayments: builder.query<{ success: boolean; data: InstallmentPayment[] }, number>({
      query: (plan_id) => `/transactions/installment-plans/${plan_id}/payments/`,
      providesTags: ["Order"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductBySlugQuery,
  useGetSearchSuggestionsQuery,
  useGetRecommendationsQuery,
  useRecordInteractionMutation,
  useGetCategoriesQuery,
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useUpdateCartItemMutation,
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useGetCustomerOrdersQuery,
  useCreateOrderMutation,
  useGetCustomerOrderDetailsQuery,
  useGetOrderReceiptQuery,
  usePayForOrderMutation,
  useCancelOrderMutation,
  useAddProductReviewMutation,
  useGetProductReviewsQuery,
  useInitializeCheckoutMutation,
  useInitializeInstallmentCheckoutMutation,
  useInitializeDeliveryPaymentMutation,
  useVerifyDeliveryPaymentQuery,
  useVerifyPaymentQuery,
  useVerifyInstallmentPaymentQuery,
  usePayInstallmentMutation,
  useGetInstallmentPlansQuery,
  useGetInstallmentPlanDetailsQuery,
  useGetInstallmentPaymentsQuery,
} = publicApi;
