import { baseApi } from "./baseApi";

interface CustomerProfile {
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
  shipping_address: string;
  city: string;
  country: string;
  postal_code: string;
  loyalty_points: number;
}

interface Address {
  id: number;
  label: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  is_default: boolean;
}

interface PaymentMethod {
  id: string;
  type: string;
  card_number: string;
  expiry_date: string;
  holder_name: string;
  is_default: boolean;
}

export const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Profile Management
    getCustomerProfile: builder.query<CustomerProfile, void>({
      query: () => "/user/customer/profile/",
      providesTags: ["Customer"],
    }),

    updateCustomerProfile: builder.mutation<
      CustomerProfile,
      Partial<CustomerProfile>
    >({
      query: (body) => ({
        url: "/user/customer/profile/",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Customer"],
    }),

    partialUpdateCustomerProfile: builder.mutation<
      CustomerProfile,
      Partial<CustomerProfile>
    >({
      query: (body) => ({
        url: "/user/customer/profile/",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Customer"],
    }),

    changeCustomerPassword: builder.mutation<
      { success: boolean; message: string },
      { current_password: string; new_password: string }
    >({
      query: (body) => ({
        url: "/user/customer/change-password/",
        method: "POST",
        body,
      }),
    }),

    // Address Management
    getAddresses: builder.query<{ success: boolean; data: Address[] }, void>({
      query: () => "/user/customer/addresses/",
      providesTags: ["Customer"],
    }),

    addAddress: builder.mutation<
      { success: boolean; data: Address },
      Partial<Address>
    >({
      query: (body) => ({
        url: "/user/customer/addresses/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Customer"],
    }),

    updateAddress: builder.mutation<
      { success: boolean; data: Address },
      { id: number; data: Partial<Address> }
    >({
      query: ({ id, data }) => ({
        url: `/user/customer/addresses/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Customer"],
    }),

    deleteAddress: builder.mutation<
      { success: boolean; message: string },
      number
    >({
      query: (id) => ({
        url: `/user/customer/addresses/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Customer"],
    }),

    // Payment Methods
    getPaymentMethods: builder.query<
      { success: boolean; data: PaymentMethod[] },
      void
    >({
      query: () => "/user/customer/payment-options/",
      providesTags: ["Payment"],
    }),

    addPaymentMethod: builder.mutation<
      { success: boolean; data: PaymentMethod },
      Partial<PaymentMethod>
    >({
      query: (body) => ({
        url: "/user/customer/payment-options/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Payment"],
    }),

    deletePaymentMethod: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/user/customer/payment-options/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Payment"],
    }),
  }),
});

export const {
  useGetCustomerProfileQuery,
  useUpdateCustomerProfileMutation,
  usePartialUpdateCustomerProfileMutation,
  useChangeCustomerPasswordMutation,
  useGetAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useGetPaymentMethodsQuery,
  useAddPaymentMethodMutation,
  useDeletePaymentMethodMutation,
} = customerApi;
