Here is Part 1 of the Vendor API Documentation.

This section covers Onboarding, Store Identity, and Banking Configuration.

Dandelionz Vendor API Documentation - Part 1
Base URL: https://api.dandelionz.com.ng

1. Onboarding (Registration)
How a new user signs up specifically as a Vendor.

Register New Vendor Account
Endpoint: POST /auth/register/ Note: The role must be set to "VENDOR". Request:

JSON
{
  "email": "sales@techgadgets.ng",
  "password": "SecureVendorPass123!",
  "role": "VENDOR",
  "full_name": "Emeka Kalu",
  "phone_number": "07033344455",
  "referral_code": "OPTIONAL_CODE"
}
Response:

JSON
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "uuid": "332211-aa-bb-cc-dd-ee",
      "email": "sales@techgadgets.ng",
      "full_name": "Emeka Kalu",
      "role": "VENDOR",
      "is_verified": false
    },
    "tokens": {
      "access_token": "eyJhbGciOiJIUzI1Ni...",
      "refresh_token": "eyJhbGciOiJIUzI1Ni..."
    },
    "is_new_user": true
  }
}
2. Store Profile & Banking
Manage store details (logo, description) and payout information.

Get Vendor Profile
Endpoint: GET /user/vendor/profile/ Response:

JSON
{
  "user": {
    "uuid": "332211-aa-bb-cc-dd-ee",
    "email": "sales@techgadgets.ng",
    "full_name": "Emeka Kalu",
    "phone_number": "07033344455",
    "role": "VENDOR",
    "is_verified": true
  },
  "store_name": "Tech Gadgets NG",
  "store_description": "We sell the best phones and laptops in Lagos.",
  "business_registration_number": "BN-12345678",
  "address": "15 Computer Village, Ikeja, Lagos",
  "bank_name": "GTBank",
  "account_number": "0123456789",
  "recipient_code": "RCP_88229911",
  "is_verified_vendor": true
}
Update Profile (Full - Store & Bank)
Endpoint: PUT /user/vendor/profile/ Note: This is where vendors input their bank details for payouts. Request:

JSON
{
  "store_name": "Tech Gadgets NG",
  "store_description": "Premium electronics store.",
  "business_registration_number": "BN-12345678",
  "address": "15 Computer Village, Ikeja, Lagos",
  "bank_name": "Zenith Bank",
  "account_number": "2005556667",
  "recipient_code": "RCP_NEW_CODE_123"
}
Response:

JSON
{
  "store_name": "Tech Gadgets NG",
  "bank_name": "Zenith Bank",
  "account_number": "2005556667",
  "is_verified_vendor": true
}
Update Profile (Partial)
Endpoint: PATCH /user/vendor/profile/ Request:

JSON
{
  "store_description": "Updated description: Now selling accessories."
}
Response:

JSON
{
  "store_name": "Tech Gadgets NG",
  "store_description": "Updated description: Now selling accessories.",
  "is_verified_vendor": true
}
Change Password
Endpoint: POST /user/vendor/change-password/ Request:

JSON
{
  "current_password": "SecureVendorPass123!",
  "new_password": "NewPassword2026!"
}
Response:

JSON
{
  "success": true,
  "message": "Password changed successfully"
}

Here is Part 2 of the Vendor API Documentation.

This section covers the Product Workflow, which is unique to vendors. It distinguishes between Drafts (work-in-progress) and Store Products (items submitted to the marketplace).

Dandelionz Vendor API Documentation - Part 2
Base URL: https://api.dandelionz.com.ng

3. Draft Management (Work-In-Progress)
Manage products before they are submitted to the admin. These are invisible to customers.

List All Drafts
Endpoint: GET /store/vendor/drafts/ Response:

JSON
[
  {
    "slug": "bluetooth-speaker-prototype",
    "name": "Bluetooth Speaker V2",
    "price": "15000.00",
    "publish_status": "draft",
    "created_at": "2026-01-24T09:00:00Z"
  }
]
Update Draft Details
Endpoint: PATCH /store/vendor/drafts/{slug}/update/ Note: Only works for products with publish_status: draft. Request:

JSON
{
  "price": "16500.00",
  "stock": 50
}
Response:

JSON
{
  "slug": "bluetooth-speaker-prototype",
  "name": "Bluetooth Speaker V2",
  "price": "16500.00",
  "publish_status": "draft",
  "updated_at": "2026-01-24T10:30:00Z"
}
Submit Draft for Approval
Endpoint: POST /store/vendor/drafts/{slug}/submit/ Description: Moves the product from "Draft" to "Submitted". It will appear in the Admin's pending list. Request: (No Body) Response:

JSON
{
  "success": true,
  "message": "Product submitted successfully. Pending admin approval."
}
Delete Draft
Endpoint: DELETE /store/vendor/drafts/{slug}/delete/ Note: Irreversible. Only works for drafts. Request: (No Body) Response: (Returns 204 No Content)

JSON
{}
4. Store Product Management (Live/Submitted)
Manage the main inventory. Note: Updating a live product might trigger a re-review depending on platform rules.

Add New Product
Endpoint: POST /user/vendor/products/add/ Description: Creates a new product entry. Request:

JSON
{
  "name": "Gaming Mouse",
  "description": "RGB Wireless Gaming Mouse",
  "price": "8000.00",
  "stock": 100,
  "category": "accessories",
  "brand": "Logitech",
  "image": "https://api.dandelionz.com.ng/media/products/mouse.jpg"
}
Response:

JSON
{
  "id": 305,
  "slug": "gaming-mouse-logitech",
  "name": "Gaming Mouse",
  "publish_status": "draft",
  "approval_status": "pending",
  "created_at": "2026-01-24T12:00:00Z"
}
List Vendor's Products
Endpoint: GET /user/vendor/products/ Response:

JSON
[
  {
    "slug": "gaming-mouse-logitech",
    "name": "Gaming Mouse",
    "price": "8000.00",
    "stock": 100,
    "approval_status": "approved",
    "is_active": true
  },
  {
    "slug": "old-keyboard",
    "name": "Mechanical Keyboard",
    "price": "12000.00",
    "stock": 0,
    "approval_status": "approved",
    "is_active": false
  }
]
Update Product (Full)
Endpoint: PUT /user/vendor/products/{slug}/ Request:

JSON
{
  "name": "Gaming Mouse Pro",
  "description": "Updated description for Pro version",
  "price": "9000.00",
  "discounted_price": "8500.00",
  "stock": 120,
  "category": "accessories",
  "brand": "Logitech",
  "tags": "gaming,wireless,rgb"
}
Response:

JSON
{
  "slug": "gaming-mouse-logitech",
  "name": "Gaming Mouse Pro",
  "price": "9000.00",
  "updated_at": "2026-01-25T08:00:00Z"
}
Update Product (Partial)
Endpoint: PATCH /user/vendor/products/{slug}/ Request:

JSON
{
  "stock": 50,
  "discounted_price": "7500.00"
}
Response:

JSON
{
  "slug": "gaming-mouse-logitech",
  "stock": 50,
  "discounted_price": "7500.00",
  "updated_at": "2026-01-25T09:00:00Z"
}
Delete Product
Endpoint: DELETE /user/vendor/products/{slug}/ Description: Removes the product from the store entirely. Request: (No Body) Response: (Returns 200 OK)

JSON
{
  "message": "Product deleted successfully"
}

Here is Part 3 of the Vendor API Documentation.

This final section covers Business Insights, Order Tracking, and Notifications.

Dandelionz Vendor API Documentation - Part 3
Base URL: https://api.dandelionz.com.ng

5. Business Insights (Analytics)
Track revenue and identify best-selling products.

Get Vendor Analytics
Endpoint: GET /user/vendor/analytics/ Response:

JSON
{
  "success": true,
  "data": {
    "total_revenue": "1540000.00",
    "total_orders": 342,
    "top_products": [
      {
        "name": "Gaming Mouse",
        "units_sold": 150
      },
      {
        "name": "Mechanical Keyboard",
        "units_sold": 85
      },
      {
        "name": "USB-C Hub",
        "units_sold": 40
      }
    ]
  }
}
6. Order Summaries
Monitor the status of orders related to your store.

Get Order Status Summary
Endpoint: GET /user/vendor/orders/ Description: Returns a count of orders grouped by their current status. Use this to see how many items need shipping. Response:

JSON
{
  "success": true,
  "data": {
    "pending": 12,    // Orders waiting to be processed
    "paid": 5,        // Orders paid for but not yet shipped
    "shipped": 45,    // Orders currently with logistics
    "delivered": 280, // Completed orders
    "canceled": 3     // Cancelled orders
  }
}
7. Notifications
Stay updated on sales, approvals, and system alerts.

List Vendor Notifications
Endpoint: GET /user/vendor/notifications/ Response:

JSON
[
  {
    "id": 801,
    "recipient_email": "sales@techgadgets.ng",
    "recipient_name": "Emeka Kalu",
    "title": "Product Approved",
    "message": "Your product 'Gaming Mouse' has been approved and is now live.",
    "is_read": false,
    "created_at": "2026-01-24T14:30:00Z"
  },
  {
    "id": 802,
    "recipient_email": "sales@techgadgets.ng",
    "recipient_name": "Emeka Kalu",
    "title": "New Order Received",
    "message": "You have a new order (ORD-2026-999) for 'Mechanical Keyboard'.",
    "is_read": true,
    "created_at": "2026-01-24T10:15:00Z"
  }
]

---
# API Review Findings (as of Jan 24, 2026)

This section summarizes the discrepancies found between the API documentation, the frontend API layer (`lib/api/*.ts`), and the UI components.

---

### Part 1: Onboarding, Store Profile & Banking

- **Section**: `POST /auth/register/` (Vendor Registration)
- **Findings**: The registration request from the frontend is correct. However, the `AuthResponse` interface in `lib/api/authApi.ts` expects a much more detailed response object than is documented. The frontend relies on undocumented fields like `email_verified` for its redirection logic.
- **Actionable Items**: Decide on the source of truth. Either (a) update the documentation to include all fields the frontend uses (e.g., `email_verified`, detailed token info) or (b) modify the frontend to only rely on fields present in the current documentation.
- **Priority**: Medium
- **Status**: Open

- **Section**: Profile Management (`GET`, `PATCH /user/vendor/profile/`)
- **Findings**: 
  1.  **Response Shape**: The `GET` response documented is flat, but the frontend implementation expects a nested `user` object and uses fields not listed in the docs (e.g., `profile_picture`).
  2.  **Request Format**: The `PATCH` endpoint is documented to accept `JSON`, but the frontend correctly sends `FormData` to handle profile picture uploads.
  3.  The `PUT` endpoint is defined in the API slice but is not used anywhere.
- **Actionable Items**: 
  1.  Update the `GET /user/vendor/profile/` documentation to reflect the nested `user` object in the response.
  2.  Update the `PATCH /user/vendor/profile/` documentation to specify the content-type as `multipart/form-data`.
  3.  Consider removing the unused `PUT` endpoint to avoid confusion.
- **Priority**: High
- **Status**: Open

---

### Part 2: Product Workflow

- **Section**: Overall Product Architecture
- **Findings**: There is a fundamental architectural conflict. The documentation describes a system with two distinct sets of endpoints (one for "Drafts", one for "Store Products"). The frontend implementation, however, points to a single, unified set of product endpoints where a product's state is managed by a `status` field. The entire "Draft Management" section of the documentation is inconsistent with the implemented design.
- **Actionable Items**: A strategic decision must be made. It is recommended to update the documentation to reflect the implemented, status-based architecture and remove the obsolete "Draft Management" section, as this aligns with the current frontend code.
- **Priority**: High
- **Status**: Open

- **Section**: `POST /user/vendor/products/add/` (Add New Product)
- **Findings**: 
  1.  **URL Mismatch**: Documented endpoint is `/user/vendor/products/add/`, but implementation uses `/user/vendor/products/`.
  2.  **Request/Response Mismatch**: Similar to the profile endpoint, the docs specify `JSON` but the implementation uses `FormData`. The response expected by the code is also more detailed than documented.
  3.  **Incomplete Feature**: The UI has a "Save as Draft" button, but the logic is not implemented, further confirming the status-based architecture is intended but unfinished.
- **Actionable Items**: 
  1.  Correct the endpoint URL in the documentation.
  2.  Update the docs to specify `multipart/form-data` for the request and align the response schema.
  3.  Implement the `handleSaveAsDraft` function to send `status: 'draft'` in the request.
- **Priority**: High
- **Status**: Open

- **Section**: Product Edit Page (`/vendor/product/[id]/edit`)
- **Findings**: The entire product edit feature is a UI scaffold. It uses mock data and does not make any API calls to fetch or update product details.
- **Actionable Items**: Implement the feature. Connect the page to the backend by using `useGetProductDetailsQuery` to fetch data and `usePartialUpdateProductMutation` to save changes.
- **Priority**: Medium
- **Status**: Open

---

### Part 3: Business Insights, Order Tracking & Notifications

- **Section**: `GET /user/vendor/analytics/` (Vendor Analytics)
- **Findings**: The feature is not implemented; the corresponding page does not exist.
- **Actionable Items**: Create the analytics page and connect it to the `useGetVendorAnalyticsQuery`.
- **Priority**: Low
- **Status**: Open

- **Section**: `GET /user/vendor/orders/` (Order Summaries)
- **Findings**: This endpoint is a major source of confusion. The docs and the actual API behavior indicate it returns a summary object with order counts. However, the `getVendorOrders` definition in `lib/api/vendorApi.ts` is incorrectly typed to expect an array of `Order` objects. This forces a workaround (`@ts-ignore`) in the UI, and the actual list of orders is rendered using mock data.
- **Actionable Items**: 
  1.  Fix the type definition for `getVendorOrders` in `vendorApi.ts` to match the summary object response.
  2.  Create a new, separate endpoint and API slice definition for fetching the *list* of orders (e.g., `GET /user/vendor/orders/list`).
  3.  Update the UI to use the new endpoint for rendering the order list instead of mock data.
- **Priority**: High
- **Status**: Open

- **Section**: `GET /user/vendor/notifications/` (Vendor Notifications)
- **Findings**: The feature is not implemented. The UI page exists but uses mock data and does not call the API.
- **Actionable Items**: Connect the notifications page to the backend by implementing the `useGetVendorNotificationsQuery`.
- **Priority**: Low
- **Status**: Open
