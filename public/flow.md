{
"email": "rulufaly@fxzig.com",
"password": "SecureAdminPassword123",
"phone_number": "0000000000",
"full_name": "Test",
"role": "VENDOR",
"referral_code": ""
}

{
"success": true,
"data": {
"user": {
"uuid": "344c535a-fc24-4660-8c5f-0fd4ba401f84",
"email": "rulufaly@fxzig.com",
"full_name": "Test",
"phone_number": "0000000000",
"profile_picture": null,
"role": "VENDOR",
"is_verified": false,
"created_at": "2026-01-11T10:38:40.242820Z",
"referral_code": "F17CA70008F7"
},
"tokens": {
"access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzY4MTI4ODIxLCJpYXQiOjE3NjgxMjc5MjEsImp0aSI6ImRiOTJlYzc4LTBlMGYtNGZkYy04ODZlLTNlMjg3MTM2MDFhNiIsInVzZXJfdXVpZCI6IjM0NGM1MzVhLWZjMjQtNDY2MC04YzVmLTBmZDRiYTQwMWY4NCIsImlzX3N0YWZmIjpmYWxzZSwiZW1haWwiOiJydWx1ZmFseUBmeHppZy5jb20iLCJpc192ZXJpZmllZCI6ZmFsc2UsInR5cGUiOiJhY2Nlc3MifQ.GDIh3AFxMkL7NW6neItYyk3l_3id05NMOWAm3pb5jJY",
"refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2OTMzNzUyMSwiaWF0IjoxNzY4MTI3OTIxLCJqdGkiOiIyZDQwZTU4Ni0wOWFhLTQ2ZTktOTcwMS03MDYzOWRiNTEwMzAiLCJ1c2VyX3V1aWQiOiIzNDRjNTM1YS1mYzI0LTQ2NjAtOGM1Zi0wZmQ0YmE0MDFmODQiLCJpc19zdGFmZiI6ZmFsc2UsImVtYWlsIjoicnVsdWZhbHlAZnh6aWcuY29tIiwiaXNfdmVyaWZpZWQiOmZhbHNlLCJ0eXBlIjoicmVmcmVzaCJ9.ekhKpKehrSzbPYJThl2qqyGV0VoYJd-nYnuAzbeJLw0",
"token_type": "Bearer",
"expires_in": 900,
"refresh_expires_in": 1209600,
"user_uuid": "344c535a-fc24-4660-8c5f-0fd4ba401f84",
"issued_at": 1768127922
},
"is_new_user": true,
"email_verified": false
}
}

I recieved this in my email:

http://dandelionz.com.ng/api/auth/email-verify?uid=MzQ0YzUzNWEtZmMyNC00NjYwLThjNWYtMGZkNGJhNDAxZjg0&token=d28lki-c8cf91dc823ebb7308e2ee9d34544e2f

{
"success": true,
"data": {
"user": {
"uuid": "488da72e-1842-4a79-a91c-122b08a7bfd0",
"email": "yadodi3168@gopicta.com",
"full_name": "Test",
"phone_number": "0000000000",
"profile_picture": null,
"role": "VENDOR",
"is_verified": true,
"created_at": "2026-01-11T12:30:48.605888Z",
"referral_code": "60160F80A134"
}
},
"message": "Email verification successful."
}

to login:
{
"email": "rulufaly@fxzig.com",
"password": "SecureAdminPassword123"
}

{
"success": true,
"data": {
"user": {
"uuid": "344c535a-fc24-4660-8c5f-0fd4ba401f84",
"email": "rulufaly@fxzig.com",
"full_name": "Test",
"phone_number": "0000000000",
"profile_picture": null,
"role": "VENDOR",
"is_verified": true,
"created_at": "2026-01-11T10:38:40.242820Z",
"referral_code": "F17CA70008F7"
},
"tokens": {
"access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzY4MTM3ODkxLCJpYXQiOjE3NjgxMzY5OTEsImp0aSI6ImIxN2JhODkyLTBhYjMtNGI2MC04NGI0LWFkYmZhYTU5NDFlZCIsInVzZXJfdXVpZCI6IjM0NGM1MzVhLWZjMjQtNDY2MC04YzVmLTBmZDRiYTQwMWY4NCIsImlzX3N0YWZmIjpmYWxzZSwiZW1haWwiOiJydWx1ZmFseUBmeHppZy5jb20iLCJpc192ZXJpZmllZCI6dHJ1ZSwidHlwZSI6ImFjY2VzcyJ9.yGuZgrQ7f6fxyPSenHUn8Q9kM8PEUpoc3FAqj3RFk4w",
"refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2OTM0NjU5MSwiaWF0IjoxNzY4MTM2OTkxLCJqdGkiOiIzMWZiMTQ4Ni0xMjRjLTRkYjMtOTU3Yi1hOTFjNDk5MjdhMTIiLCJ1c2VyX3V1aWQiOiIzNDRjNTM1YS1mYzI0LTQ2NjAtOGM1Zi0wZmQ0YmE0MDFmODQiLCJpc19zdGFmZiI6ZmFsc2UsImVtYWlsIjoicnVsdWZhbHlAZnh6aWcuY29tIiwiaXNfdmVyaWZpZWQiOnRydWUsInR5cGUiOiJyZWZyZXNoIn0.InHEsgjasAcx6uBcG7uGQjW5WP5rNvMubSbqg3jq8iU",
"token_type": "Bearer",
"expires_in": 900,
"refresh_expires_in": 1209600,
"user_uuid": "344c535a-fc24-4660-8c5f-0fd4ba401f84",
"issued_at": 1768136991
},
"email_verified": true,
"verification_needed": false
}
}

now check for this: https://dandelionz.com.ng/api/auth/password-reset/
the request body:
{
"email": "rulufaly@fxzig.com"
}

the reponse: {
"success": true,
"message": "If an account exists with this email, a password reset link will be sent."
} then I got the email which contained this link in a button to verify: http://dandelionz.com.ng/api/auth/password-reset-confirm?uid=MzQ0YzUzNWEtZmMyNC00NjYwLThjNWYtMGZkNGJhNDAxZjg0&token=d28v2t-b967dad865875615b33f9f9bcac0e2eb
so we already know this isn't going to any frontend page and even clicking on the link took me to the django backend not found page, so now using this endpoint: https://dandelionz.com.ng/api/auth/password-reset/confirm/
this request in the swagger: {
"uid": "MzQ0YzUzNWEtZmMyNC00NjYwLThjNWYtMGZkNGJhNDAxZjg0",
"token": "d28v2t-b967dad865875615b33f9f9bcac0e2eb",
"new_password": "SecureAdminPassword1236"
}

I got this response and I'm trying to find out why: {
"success": false,
"error": "Password reset failed. Please try again."
}

but just confirms if this is the flow my frontend takes now and send the correction to the link sent in the email to be sent to the backend engineer

check if this endpoint is being used: https://dandelionz.com.ng/api/auth/token/validate/; this is its description: Verify the validity of an access token and retrieve user information. Requires a valid Bearer token in the Authorization header. Returns user details if the token is valid and not expired. Use this endpoint to verify token status on application startup or periodically. is it needed in this project if it's not being used or we can do without it?

made request to this endpoint: https://dandelionz.com.ng/api/auth/token/refresh/
{
"refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2OTM1MDU5OSwiaWF0IjoxNzY4MTQwOTk5LCJqdGkiOiJlOTYyOWEzMy04YTM2LTQxNzctOTZlYi00NjUzNWQ3MGU0OTEiLCJ1c2VyX3V1aWQiOiIzNDRjNTM1YS1mYzI0LTQ2NjAtOGM1Zi0wZmQ0YmE0MDFmODQiLCJpc19zdGFmZiI6ZmFsc2UsImVtYWlsIjoicnVsdWZhbHlAZnh6aWcuY29tIiwiaXNfdmVyaWZpZWQiOnRydWUsInR5cGUiOiJyZWZyZXNoIn0.86JIWptRO9l5fpZ5oXbsByNFoSfsKgxNyf7fLIr8mJY"
}

response: {
"success": true,
"data": {
"access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzY4MTQyMTgyLCJpYXQiOjE3NjgxNDEyODIsImp0aSI6ImM2OGIyYTlkLWIwYjQtNGZiNS05ZGZjLTZlOTQ5ZjU4ZDBlMyIsInVzZXJfdXVpZCI6IjM0NGM1MzVhLWZjMjQtNDY2MC04YzVmLTBmZDRiYTQwMWY4NCIsImlzX3N0YWZmIjpmYWxzZSwiZW1haWwiOiJydWx1ZmFseUBmeHppZy5jb20iLCJpc192ZXJpZmllZCI6dHJ1ZSwidHlwZSI6ImFjY2VzcyJ9.Ypsn1vT3RpGXb0I3UID7lD8gl-9T6bwsSCcWKaswcAU",
"refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2OTM1MDg4MiwiaWF0IjoxNzY4MTQxMjgyLCJqdGkiOiJkOTQ4Zjk2Ny05NjE5LTQwMTUtYTU4OS0yNDhjNGQ2MjQ2YjIiLCJ1c2VyX3V1aWQiOiIzNDRjNTM1YS1mYzI0LTQ2NjAtOGM1Zi0wZmQ0YmE0MDFmODQiLCJpc19zdGFmZiI6ZmFsc2UsImVtYWlsIjoicnVsdWZhbHlAZnh6aWcuY29tIiwiaXNfdmVyaWZpZWQiOnRydWUsInR5cGUiOiJyZWZyZXNoIn0.kZuIowZLpLqCsw4pFPtWJ-AebkM60DBeUT6EqqVuKjw",
"token_type": "Bearer",
"expires_in": 900
}
}

Tell me how the logout functionality works too

---

# API INTEGRATION REVIEW GUIDE (Last Updated: 2026-01-11)

This document summarizes the review status of key authentication pages and flows.

## Core Authentication Logic

- **Token Refresh (`lib/api/baseApi.ts`):**
  - **Status:** Reviewed & Refactored
  - **Notes:** Implemented a mutex to prevent race conditions during token refresh. This is a critical fix for stability.
- **Logout (`lib/hooks.ts`):**
  - **Status:** Reviewed & Implemented
  - **Notes:** Created a `useLogout` hook that correctly clears both the Redux state and the authentication cookies.

## Page-by-Page Review

- **Registration (`app/(auth)/register/page.tsx`):**

  - **Status:** Reviewed & Refactored
  - **Notes:** The redirection logic was updated to correctly use the `email_verified` flag from the API response.

- **Email Verification (`app/verify-email/page.tsx`):**

  - **Status:** Reviewed & Refactored
  - **Notes:**
    - The page was updated to correctly extract both `uid` and `token` from the URL, as required by the backend.
    - The "Resend" button flow was corrected to point users to the login page, allowing them to use the authenticated resend endpoint.
    - An optimization was added to prevent the verification API from being called multiple times on re-renders.

- **Verification Notice (`app/verify-notice/page.tsx`):**

  - **Status:** Reviewed
  - **Notes:** This page correctly handles the flow for an authenticated but unverified user, allowing them to resend the verification email. No changes were needed.

- **Login (`app/login/page.tsx`):**

  - **Status:** Reviewed
  - **Notes:** The page correctly handles role-based redirection and redirects unverified users to the `/verify-notice` page. No changes were needed.

- **Customer Account Page (`app/(customer)/account/page.tsx`):**

  - **Status:** Reviewed & Refactored
  - **Notes:**
    - The page now fetches live profile data instead of using mock data.
    - A functional "Logout" button has been added.
    - The UI has been updated to use the Next.js `<Image>` component and a `<LoadingSpinner/>`.

- **Vendor Account Page (`app/vendor/account/page.tsx`):**

  - **Status:** Reviewed & Refactored
  - **Notes:**
    - The page now fetches live profile data instead of using mock data.
    - A functional "Logout" button has been added.
    - The UI has been updated to handle loading/unauthenticated states correctly.

- **Admin Account Page (`app/admin/account/page.tsx`):**

  - **Status:** Reviewed & Refactored
  - **Notes:** - The page now fetches live profile data instead of using mock data. - A functional "Logout" button has been added. - The UI has been updated to handle loading/unauthenticated states correctly.

                        response for the https://dandelionz.com.ng/api/user/vendor/products/add/
                        {

                    "success": true,
                    "data": {
                    "id": 1,
                    "name": "Classic Test Product",
                    "slug": "classic-test-product",
                    "description": "A high-quality product for all your testing needs.",
                    "category": "electronics",
                    "price": "199.99",
                    "stock": 100,
                    "image": null,
                    "store": "Unnamed Store",
                    "created_at": "2026-01-11T21:05:47.679253Z",
                    "updated_at": "2026-01-11T21:05:47.679292Z"
                    }
                    }

                in the app is the image upload fuctionlaity implemented well?


        https://api.dandelionz.com.ng/user/admin/vendors/approve/
            {
            "user_uuid": "344c535a-fc24-4660-8c5f-0fd4ba401f84",
            "approve": true
            }

    {
    "success": true,
    "approved": true
    }

https://api.dandelionz.com.ng/user/admin/vendors/
get request with this response: {
"success": true,
"data": [
{
"user_uuid": "488da72e-1842-4a79-a91c-122b08a7bfd0",
"email": "yadodi3168@gopicta.com",
"store_name": "Unnamed Store",
"is_verified_vendor": false,
"is_active": true
},
{
"user_uuid": "344c535a-fc24-4660-8c5f-0fd4ba401f84",
"email": "rulufaly@fxzig.com",
"store_name": "Unnamed Store",
"is_verified_vendor": true,
"is_active": true
}
]
}

https://api.dandelionz.com.ng/user/admin/vendors/verify-kyc/
{
"user_uuid": "344c535a-fc24-4660-8c5f-0fd4ba401f84"
}
{
"success": true,
"message": "Vendor KYC verified"
}

https://api.dandelionz.com.ng/user/admin/users/suspend/
{
"user_uuid": "344c535a-fc24-4660-8c5f-0fd4ba401f84",
"suspend": true
}
changing the suspend field to false does the opposite or revert it back to not being suspended.
{
"success": true,
"suspended": true
}
I think if you are suspended, the vendor suspended won't be able to login

These are the categories the backend expects: ('electronics', 'Electronics'),
('fashion', 'Fashion'),
('home_appliances', 'Home Appliances'),
('beauty', 'Beauty & Personal Care'),
('sports', 'Sports & Outdoors'),
('automotive', 'Automotive'),
('books', 'Books'),
('toys', 'Toys & Games'),
('groceries', 'Groceries'),
('computers', 'Computers & Accessories'),
('phones', 'Phones & Tablets'),
('jewelry', 'Jewelry & Watches'),
('baby', 'Baby Products'),
('pets', 'Pet Supplies'),
('office', 'Office Products'),
('gaming', 'Video Games & Consoles'),

https://api.dandelionz.com.ng/user/vendor/products/
Retrieve all products in the vendor's store with their details, pricing, and status.
it's a get request with this response
{
"success": true,
"data": [
{
"id": 1,
"store": 11,
"store_name": "Unnamed Store",
"name": "Classic Test Product",
"slug": "classic-test-product",
"description": "A high-quality product for all your testing needs.",
"category": "electronics",
"price": "199.99",
"stock": 100,
"image": null,
"in_stock": true,
"created_at": "2026-01-11T21:05:47.679253Z",
"updated_at": "2026-01-11T21:05:47.679292Z",
"reviews": []
}
]
}

https://api.dandelionz.com.ng/user/vendor/orders/
Get a count of vendor's orders grouped by status (pending, paid, shipped, delivered, canceled).
get request:
{
"success": true,
"data": {
"pending": 0,
"paid": 0,
"shipped": 0,
"delivered": 0,
"canceled": 0
}
}

---
# API INTEGRATION REVIEW GUIDE (Last Updated: 2026-01-12)
This guide provides a comprehensive summary of the frontend application's status for future reference.

## Core Authentication System
- **`lib/api/baseApi.ts` (Token Refresh Logic):**
  - **Status:** COMPLETE
  - **Details:** The core API query function has been refactored to handle automatic access token refreshing. It uses a mutex lock to prevent race conditions where multiple API calls with an expired token could trigger simultaneous refresh attempts. This is a critical production-ready fix.
- **`lib/hooks.ts` (Logout Hook):**
  - **Status:** COMPLETE
  - **Details:** A `useLogout` hook was created to centralize logout logic. It dispatches the Redux `logout` action to clear the session state and also explicitly clears the `access_token` and `user_role` cookies to prevent state mismatches.

## Page-by-Page Review

### Authentication Flow
- **Registration (`app/(auth)/register/page.tsx`):**
  - **Status:** COMPLETE
  - **Details:** Refactored the submission logic to correctly redirect users based on the `email_verified: false` flag in the API response, aligning it with the actual API behavior.
- **Email Verification (`app/verify-email/page.tsx`):**
  - **Status:** COMPLETE
  - **Details:** This page was significantly refactored. It now correctly extracts both the `uid` and `token` from the URL to send in the `POST` request to the verification endpoint. The user flow for a failed token was also improved; the "Resend" button now correctly directs the user to `/verify-notice`, which will either show the resend option (if authenticated) or trigger a redirect to the login page (if unauthenticated).
- **Verification Notice (`app/verify-notice/page.tsx`):**
  - **Status:** COMPLETE
  - **Details:** Reviewed and confirmed to be correctly implemented. It serves authenticated but unverified users, allowing them to trigger the resend-verification endpoint. No changes were necessary.
- **Login (`app/login/page.tsx`):**
  - **Status:** COMPLETE
  - **Details:** Reviewed and confirmed to be correctly implemented. It properly handles role-based redirection and sends unverified users to the `/verify-notice` page after login. No changes were necessary.

### Account Management Pages
- **Customer Account (`app/(customer)/account/page.tsx`):**
  - **Status:** COMPLETE
  - **Details:** The page was fully refactored from a static mock page to a dynamic one. It now uses `useGetCustomerProfileQuery` to fetch live data, displays a loading state, and uses the `useLogout` hook for a functional logout button. The UI was also updated to use the Next.js `<Image>` component for avatars.
- **Vendor Account (`app/vendor/account/page.tsx`):**
  - **Status:** COMPLETE
  - **Details:** Refactored to be a fully dynamic page using `useGetVendorProfileQuery` and a functional `useLogout` hook.
- **Admin Account (`app/admin/account/page.tsx`):**
  - **Status:** COMPLETE
  - **Details:** Refactored to be a fully dynamic page using `useGetAdminProfileQuery` and a functional `useLogout` hook.

### Vendor Features
- **Add New Product (`app/vendor/product/new/page.tsx`):**
  - **Status:** COMPLETE
  - **Details:** This multi-step form was heavily refactored. It now correctly handles image file uploads by using a `FormData` object. The form now submits all required product data to the `useCreateProductMutation` hook, including optional variants and the official, hardcoded category list.
- **Vendor Products List (`app/vendor/product/page.tsx`):**
  - **Status:** COMPLETE
  - **Details:** Reviewed and confirmed to be well-implemented. It correctly uses `useGetVendorProductsQuery` to fetch products and then filters them into "Published" and "Draft" categories on the client-side.
- **Vendor Orders Page (`app/vendor/orders/page.tsx`):**
  - **Status:** COMPLETE
  - **Details:** Refactored from a static mock page to a dynamic one using `useGetVendorOrdersQuery` to display order summary statistics and a list of orders.
- **Vendor Dashboard (`app/vendor/page.tsx`):**
  - **Status:** REVIEWED
  - **Notes for Improvement:** The dashboard currently uses `useGetVendorAnalyticsQuery`, which only provides `total_revenue`. To make the dashboard's "Total Orders," "Product Sold," and "New Customer" cards functional, the `/user/vendor/analytics/` API endpoint needs to be expanded on the backend to provide this summary data.

### Admin Features
- **Vendor Management List (`app/admin/vendor/page.tsx`):**
  - **Status:** COMPLETE
  - **Details:** Reviewed and confirmed to be correctly implemented. It uses `useGetAllVendorsQuery` to fetch and display the list of vendors and their status.
- **Vendor Details Page (`app/admin/vendor/[id]/page.tsx`):**
  - **Status:** COMPLETE
  - **Details:** Reviewed and confirmed to be correctly implemented. It uses the appropriate hooks (`useApproveVendorMutation`, `useSuspendUserMutation`, `useVerifyVendorKYCMutation`) to manage vendors. The UI is functional and provides clear feedback to the admin.