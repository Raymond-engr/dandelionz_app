import { baseApi } from "./baseApi";

export interface Product {
  id: number;
  name: string;
  price: string;
  rating?: number;
  image?: string | null;
  images?: string[];
  slug?: string;
  store?: number;
  store_name?: string;
  description?: string;
  category?: string;
  stock?: number;
  in_stock?: boolean;
  created_at?: string;
  updated_at?: string;
  reviews?: any[];
}

type GetProductsResponse = {
  success: boolean;
  data: Product[];
};

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

    // Categories
    getCategories: builder.query<{ success: boolean; data: any[] }, void>({
      query: () => "/store/categories/",
      providesTags: ["Category"],
    }),

    // Cart (requires auth)
    getCart: builder.query<{ success: boolean; data: any }, void>({
      query: () => "/store/cart/",
      providesTags: ["Cart"],
    }),

    addToCart: builder.mutation<
      { success: boolean; data: any },
      { product: number; quantity: number; variant?: any }
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
      string
    >({
      query: (slug) => ({
        url: `/store/cart/remove/${slug}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    updateCartItem: builder.mutation<
      { success: boolean; data: any },
      { product_id: string; quantity: number }
    >({
      query: (body) => ({
        url: "/store/cart/update/",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),

    // Wishlist
    getWishlist: builder.query<{ success: boolean; data: any[] }, void>({
      query: () => "/store/favourites/",
      providesTags: ["Wishlist"],
    }),

    addToWishlist: builder.mutation<
      { success: boolean; message: string },
      { product: number }
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
      string
    >({
      query: (slug) => ({
        url: `/store/favourites/remove/${slug}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),

    // Orders
    getCustomerOrders: builder.query<
      { success: boolean; data: any[] },
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

    getOrderDetails: builder.query<{ success: boolean; data: any }, string>({
      query: (uuid) => `/transactions/orders/${uuid}/`,
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

    getProductReviews: builder.query<{ success: boolean; data: any[] }, string>(
      {
        query: (slug) => `/store/products/${slug}/reviews/`,
        providesTags: ["Product"],
      }
    ),

    // Payments
    initializeCheckout: builder.mutation<
      {
        order_id: string;
        amount: number;
        reference: string;
        authorization_url: string;
        access_code: string;
      },
      void
    >({
      query: () => ({
        url: "/transactions/checkout/",
        method: "POST",
      }),
      invalidatesTags: ["Cart", "Order"],
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
  }),
});

export const {
  useGetProductsQuery,
  useGetProductBySlugQuery,
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
  useGetOrderDetailsQuery,
  usePayForOrderMutation,
  useAddProductReviewMutation,
  useGetProductReviewsQuery,
  useInitializeCheckoutMutation,
  useVerifyPaymentQuery,
} = publicApi;
