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
  shipping_latitude?: number;
  shipping_longitude?: number;
  city: string;
  country: string;
  postal_code: string;
  loyalty_points: number;
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
      FormData
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

    deleteCustomerAccount: builder.mutation<void, { password: string }>({
      query: (body) => ({
        url: "/user/customer/account/",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["Customer", "Auth"],
    }),
  }),
});

export const {
  useGetCustomerProfileQuery,
  useUpdateCustomerProfileMutation,
  usePartialUpdateCustomerProfileMutation,
  useChangeCustomerPasswordMutation,
  useDeleteCustomerAccountMutation,
} = customerApi;

