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

### Part 4: Wallet, Payment & Account Management

**1. Get Wallet Balance**
- **Endpoint:** `GET /user/vendor/wallet/`
- **Functionality:** Fetches the vendor's main balance and earnings summary.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "withdrawable_balance": "150000.00",
      "available_balance": "250000.00",
      "total_earnings": "500000.00",
      "total_withdrawals": 12,
      "this_month_earnings": "75000.00"
    }
  }
  ```

**2. Get Transaction History**
- **Endpoint:** `GET /user/vendor/wallet/transactions/`
- **Functionality:** Returns a paginated list of all transactions (credits and debits) for the vendor's wallet.
- **Query Parameters:**
  - `limit`, `offset`: For pagination.
  - `type` (optional, string): Filter by `credit` or `debit`.
- **Success Response (200 OK):**
  ```json
  {
    "count": 42,
    "next": "...",
    "previous": null,
    "results": [
      {
        "id": "txn-abc-123",
        "type": "debit",
        "amount": "50000.00",
        "description": "Withdrawal to GTBank",
        "status": "successful",
        "created_at": "2026-01-25T14:00:00Z"
      }
    ]
  }
  ```

**3. Request Withdrawal**
- **Endpoint:** `POST /user/vendor/wallet/withdraw/`
- **Functionality:** Initiates a withdrawal request from the vendor's wallet to their bank account. Requires the withdrawal amount and the user's payment PIN for security.
- **Request Body:**
  ```json
  {
    "amount": "50000.00",
    "pin": "1234"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Withdrawal request of ₦50,000.00 is being processed."
  }
  ```

**4. Get Payment Settings**
- **Endpoint:** `GET /user/vendor/payment-settings/`
- **Functionality:** Retrieves the vendor's currently saved bank account details for withdrawal.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "bank_name": "GTBank",
      "account_number": "0123456789",
      "account_name": "Emeka Kalu",
      "recipient_code": "RCP_88229911",
      "has_pin": true
    }
  }
  ```

**5. Update Payment Settings**
- **Endpoint:** `PUT /user/vendor/payment-settings/`
- **Functionality:** Updates the vendor's bank account details.
- **Request Body:**
  ```json
  {
    "bank_name": "Zenith Bank",
    "account_number": "2005556667"
  }
  ```
- **Success Response (200 OK):** Returns the updated payment settings object.

**6. Set/Change Payment PIN**
- **Endpoint:** `POST /user/vendor/payment-settings/pin/`
- **Functionality:** Allows a vendor to set their initial 4-digit payment PIN or change an existing one.
- **Request Body:**
  ```json
  {
    "pin": "1234",
    "confirm_pin": "1234"
  }
  ```
- **Success Response (200 OK):**
  ```json
  { "success": true, "message": "Payment PIN updated successfully." }
  ```

**7. Forgot/Request PIN Reset**
- **Endpoint:** `POST /user/vendor/payment-settings/pin/forgot/`
- **Functionality:** Initiates the process for a user to reset their forgotten payment PIN.
- **Success Response (200 OK):**
  ```json
  { "success": true, "message": "A PIN reset link has been sent to your email." }
  ```

**8. Delete Vendor Account**
- **Endpoint:** `DELETE /user/vendor/account/`
- **Functionality:** Permanently deletes the vendor's account.
- **Request Body:**
  ```json
  {
    "password": "current_secure_password"
  }
  ```
- **Success Response (204 No Content):** An empty response indicating successful deletion.

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
- **Actionable Items**: 
  1.  Update the `GET /user/vendor/profile/` documentation to reflect the nested `user` object in the response.
  2.  Update the `PATCH /user/vendor/profile/` documentation to specify the content-type as `multipart/form-data`.
- **Priority**: High
- **Status**: Open

---

### Part 2: Product Workflow

- **Section**: Overall Product Architecture
- **Findings**: The frontend has been successfully refactored to use a two-system architecture (Drafts vs. Store Products), aligning with the documentation. The API layer (`vendorApi.ts`) now contains separate endpoints for managing drafts and store products.
- **Actionable Items**: None.
- **Priority**: High
- **Status**: Closed

- **Section**: `POST /user/vendor/products/add/` & `POST /store/vendor/drafts/`
- **Findings**: The 'Add New Product' page has been refactored. It now correctly uses `useCreateStoreProductMutation` to publish a product directly and `useCreateDraftMutation` to save a product as a draft.
- **Actionable Items**: None.
- **Priority**: High
- **Status**: Closed

- **Section**: Product Edit Page (`/vendor/product/[id]/edit`)
- **Findings**: The product edit page has been implemented to handle both drafts and store products. It correctly fetches data and displays a 'Submit for Approval' button for drafts.
- **Actionable Items**: None.
- **Priority**: Medium
- **Status**: Closed

- **Section**: Product Edit Page (`PATCH` Discrepancy)
- **Findings**: There is an inconsistency in the update mutations. `updateDraft` sends data as `FormData` (allowing file uploads), but `partialUpdateStoreProduct` is configured to send `JSON`. This prevents updating the product image for an already published product.
- **Actionable Items**: For consistency and to support file uploads, align the `partialUpdateStoreProduct` mutation to also use `FormData`.
- **Priority**: Medium
- **Status**: Open

---

### Part 3: Business Insights, Order Tracking & Notifications

- **Section**: `GET /user/vendor/analytics/` (Vendor Analytics)
- **Findings**: The Vendor Analytics page has been implemented and the homepage now correctly displays `total_revenue` and `total_orders`. However, the UI design requires "Product Sold" and "New Customer" stats which are not yet provided by this API endpoint.
- **Actionable Items**: The backend engineer needs to add `product_sold` and `new_customer` fields to the response of this endpoint.
- **Priority**: Medium
- **Status**: Open

- **Section**: `GET /user/vendor/orders/` (Order Summaries)
- **Findings**: The API layer and UI have been successfully updated. `getVendorOrders` now correctly fetches the summary, and a new `getVendorOrdersList` fetches the order list. The UI on the orders page and homepage uses this live data, replacing the previous mock data and workarounds.
- **Actionable Items**: None.
- **Priority**: High
- **Status**: Closed

- **Section**: `GET /user/vendor/notifications/` (Vendor Notifications)
- **Findings**: The notifications page has been implemented and now correctly fetches and displays live notification data from the backend, replacing the mock data.
- **Actionable Items**: None.
- **Priority**: Low
- **Status**: Closed

---

### Part 4: Wallet, Payment & Account Management

- **Section**: Wallet & Withdrawal Features
- **Findings**: All wallet-related pages (Wallet Home, Withdrawal, PIN Confirmation) have been implemented and connected to the `vendorApi` service. The backend must implement the endpoints as specified in Part 4 of this documentation.
- **Actionable Items**: Implement the backend endpoints for `getWalletBalance`, `requestWithdrawal`, etc.
- **Priority**: High
- **Status**: Open

- **Section**: Payment Settings & PIN Management
- **Findings**: The UI for managing bank details and payment PINs (Change/Forgot) is complete and integrated with the API layer.
- **Actionable Items**: Implement the backend endpoints for `getPaymentSettings`, `updatePaymentSettings`, `setPaymentPIN`, and `requestPINReset`.
- **Priority**: High
- **Status**: Open

- **Section**: Account Deletion
- **Findings**: The account deletion UI now includes a password confirmation step and calls the `deleteAccount` mutation.
- **Actionable Items**: Implement the `DELETE /user/vendor/account/` endpoint.
- **Priority**: Medium
- **Status**: Open