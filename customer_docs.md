Here is the plan for the Customer API Documentation:

The Documentation Plan
Part 1: Authentication & Account Management

Focus: How users sign up, log in, recover passwords, and manage their shipping details.

Key Endpoints: Registration (Role: CUSTOMER), Login, Password Reset Flow, and Profile Update (Shipping Address, Phone).

Part 2: Discovery & Engagement (Browsing & Wishlist)

Focus: Finding products and saving them for later.

Key Endpoints:

Public: List Categories, Search/Filter Products, Product Details Page, List Reviews.

Customer: Add Review, Add to Favourites (Wishlist), Remove from Favourites.

Part 3: Cart, Checkout & Payments (Paystack Integration)

Focus: The purchase flow. This is where I will explain the Paystack Integration specifically.

Key Endpoints:

Cart: Add/Remove items.

Checkout: Initialize Paystack (getting the authorization_url), Single Payment vs. Installment Payment.

Verification: The critical endpoint that confirms the payment after the user returns from Paystack.

Post-Purchase: Order History and Wallet.

Here is Part 1 (Authentication & Account Management) to get started.

Dandelionz Customer API Documentation - Part 1
Base URL: https://api.dandelionz.com.ng

1. Authentication
The entry point for all customers.

Register New Customer
Endpoint: POST /auth/register/ Note: Role must be "CUSTOMER". Request:

JSON
{
  "email": "customer.joy@example.com",
  "password": "SecurePassword123!",
  "role": "CUSTOMER",
  "full_name": "Joy Okon",
  "phone_number": "08055551234",
  "referral_code": "FRIEND123" 
}
Response:

JSON
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "uuid": "5cc97d04-270d-4973-a5cf-0c273359e5d5",
      "email": "customer.joy@example.com",
      "full_name": "Joy Okon",
      "role": "CUSTOMER",
      "is_verified": false
    },
    "tokens": {
      "access_token": "eyJhbGciOi...",
      "refresh_token": "eyJhbGciOi..."
    }
  }
}
Login
Endpoint: POST /auth/login/ Request:

JSON
{
  "email": "customer.joy@example.com",
  "password": "SecurePassword123!"
}
Response:

JSON
{
  "success": true,
  "data": {
    "user": {
      "uuid": "5cc97d04-270d-4973-a5cf-0c273359e5d5",
      "email": "customer.joy@example.com",
      "full_name": "Joy Okon",
      "role": "CUSTOMER"
    },
    "tokens": {
      "access_token": "eyJhbGciOi...",
      "refresh_token": "eyJhbGciOi..."
    }
  }
}
Request Password Reset
Endpoint: POST /auth/password-reset/ Description: Sends a reset link/token to the user's email. Request:

JSON
{
  "email": "customer.joy@example.com"
}
Response:

JSON
{
  "success": true,
  "message": "Password reset email sent."
}
Confirm Password Reset
Endpoint: POST /auth/password-reset/confirm/ Request:

JSON
{
  "uid": "Nw",
  "token": "bop-4c3d2e1f",
  "new_password": "NewSecurePassword2026"
}
Response:

JSON
{
  "success": true,
  "message": "Password has been reset successfully."
}
2. Profile & Address Management
Managing personal details and shipping address.

Get Customer Profile
Endpoint: GET /user/customer/profile/ Response:

JSON
{
  "user": {
    "uuid": "5cc97d04-270d-4973-a5cf-0c273359e5d5",
    "email": "customer.joy@example.com",
    "full_name": "Joy Okon",
    "phone_number": "08055551234",
    "profile_picture": null
  },
  "shipping_address": "45 Bennet Drive",
  "city": "Benin City",
  "country": "Nigeria",
  "postal_code": "300251",
  "loyalty_points": 50
}
Update Profile (Shipping Address)
Endpoint: PUT /user/customer/profile/ Request:

JSON
{
  "full_name": "Joy Okon",
  "phone_number": "08055551234",
  "shipping_address": "12 Admiralty Way",
  "city": "Lekki",
  "country": "Nigeria",
  "postal_code": "105102"
}
Response:

JSON
{
  "shipping_address": "12 Admiralty Way",
  "city": "Lekki",
  "postal_code": "105102",
  "message": "Profile updated successfully"
}
Change Password (Logged In)
Endpoint: POST /user/customer/change-password/ Request:

JSON
{
  "current_password": "SecurePassword123!",
  "new_password": "NewPassword2026!"
}
Response:

JSON
{
  "message": "Password changed successfully"
}

Here is Part 2 of the Customer API Documentation.

This section covers Product Discovery (Browsing & Searching), the Product Details Page, Reviews, and Wishlist/Favourites.

Dandelionz Customer API Documentation - Part 2
Base URL: https://api.dandelionz.com.ng

3. Product Discovery (Public Access)
These endpoints do not require a login token. Anyone can browse.

List All Categories
Endpoint: GET /store/categories/ Response:

JSON
[
  {
    "id": 5,
    "name": "Smartphones",
    "slug": "smartphones",
    "image": "https://api.dandelionz.com.ng/media/categories/phones.jpg",
    "product_count": 120
  },
  {
    "id": 8,
    "name": "Laptops",
    "slug": "laptops",
    "image": "https://api.dandelionz.com.ng/media/categories/laptops.jpg",
    "product_count": 85
  }
]
Search & Filter Products
Endpoint: GET /store/products/filtered/ Query Params: ?search=iphone&category=smartphones&min_price=100000 Response:

JSON
[
  {
    "id": 301,
    "name": "iPhone 15 Pro",
    "slug": "iphone-15-pro-256gb",
    "price": "1200000.00",
    "discounted_price": "1150000.00",
    "image": "https://api.dandelionz.com.ng/media/products/iphone15.jpg",
    "vendorName": "Tech Gadgets NG",
    "rating": 4.8
  }
]
Product Details Page
Endpoint: GET /store/products/{slug}/ Description: Get full details for a single product page. Response:

JSON
{
  "id": 301,
  "name": "iPhone 15 Pro",
  "slug": "iphone-15-pro-256gb",
  "description": "The latest iPhone with titanium design and A17 Pro chip.",
  "price": "1200000.00",
  "discounted_price": "1150000.00",
  "stock": 15,
  "brand": "Apple",
  "category_name": "Smartphones",
  "vendor": {
    "store_name": "Tech Gadgets NG",
    "is_verified_vendor": true
  },
  "variants": {
    "color": ["Natural Titanium", "Blue Titanium"],
    "storage": ["256GB", "512GB"]
  },
  "images": [
    "https://api.dandelionz.com.ng/media/products/iphone15_front.jpg",
    "https://api.dandelionz.com.ng/media/products/iphone15_back.jpg"
  ],
  "reviews": [
    {
      "customer_name": "Emeka J.",
      "rating": 5,
      "comment": "Best phone I've ever used!",
      "created_at": "2026-01-15T10:00:00Z"
    }
  ]
}
List Product Reviews
Endpoint: GET /store/products/{slug}/reviews/ Response:

JSON
[
  {
    "id": 55,
    "customer_name": "Sarah K.",
    "rating": 4,
    "comment": "Great battery life but expensive.",
    "created_at": "2026-01-20T14:30:00Z"
  }
]
4. Engagement (Customer Only)
Actions that require a logged-in user.

Add Product to Favourites (Wishlist)
Endpoint: POST /store/favourites/add/ Request:

JSON
{
  "product": 301
}
Response:

JSON
{
  "id": 12,
  "product": 301,
  "product_details": {
    "name": "iPhone 15 Pro",
    "price": "1200000.00"
  },
  "added_at": "2026-01-24T16:00:00Z"
}
List Favourites
Endpoint: GET /store/favourites/ Response:

JSON
[
  {
    "id": 12,
    "product": 301,
    "product_details": {
      "name": "iPhone 15 Pro",
      "slug": "iphone-15-pro-256gb",
      "price": "1200000.00",
      "image": "https://api.dandelionz.com.ng/media/products/iphone15.jpg"
    }
  }
]
Remove from Favourites
Endpoint: DELETE /store/favourites/remove/{slug}/ Request: (No Body) Response: (Returns 204 No Content)

JSON
{}
Add a Review
Endpoint: POST /store/products/{slug}/review/add/ Request:

JSON
{
  "rating": 5,
  "comment": "Delivery was super fast and the item is genuine."
}
Response:

JSON
{
  "id": 60,
  "product_name": "iPhone 15 Pro",
  "rating": 5,
  "comment": "Delivery was super fast and the item is genuine.",
  "created_at": "2026-01-24T16:15:00Z"
}

Here is Part 3 of the Customer API Documentation.

This is the most critical section for your frontend integration. It covers the full Shopping Cart workflow and the Paystack Payment Integration (Checkout & Verification).

Dandelionz Customer API Documentation - Part 3
Base URL: https://api.dandelionz.com.ng

5. Shopping Cart
Manage the customer's active cart before checkout.

Add Item to Cart
Endpoint: POST /store/cart/add/ Request:

JSON
{
  "product": 301,
  "quantity": 1
}
Response:

JSON
{
  "id": 55,
  "product": 301,
  "product_details": {
    "name": "iPhone 15 Pro",
    "price": "1200000.00",
    "image": "https://api.dandelionz.com.ng/media/products/iphone.jpg"
  },
  "quantity": 1,
  "subtotal": "1200000.00"
}
View Cart
Endpoint: GET /store/cart/ Response:

JSON
{
  "id": 10,
  "customer": "5cc97d04-270d-4973-a5cf-0c273359e5d5",
  "items": [
    {
      "id": 55,
      "product": 301,
      "quantity": 1,
      "subtotal": "1200000.00"
    }
  ],
  "total": "1200000.00",
  "updated_at": "2026-01-24T16:30:00Z"
}
Remove Item from Cart
Endpoint: DELETE /store/cart/remove/{slug}/ Request: (No Body) Response: (Returns 204 No Content)

JSON
{}
6. Checkout & Paystack Integration
This explains the exact flow to accept payments.

Step 1: Initialize Checkout (Standard)
Endpoint: POST /transactions/checkout/ Description: Creates a pending order and initializes the Paystack transaction. Action: Redirect the user to the authorization_url provided in the response. Request: (No Body - uses active cart) Response:

JSON
{
  "order_id": "ORD-2026-5501",
  "amount": 1200000.00,
  "reference": "tr_889900aabbcc",
  "authorization_url": "https://checkout.paystack.com/access_code_123456789",
  "access_code": "123456789"
}
Step 1 (Alternative): Initialize Installment Payment
Endpoint: POST /transactions/checkout/installment/ Description: Use this if the user chooses to pay in installments (e.g., 3 months). Request:

JSON
{
  "data": {
    "duration": "3_months"
  }
}
Response:

JSON
{
  "order_id": "ORD-2026-5502",
  "installment_plan_id": 205,
  "total_amount": "1200000.00",
  "installment_amount": "400000.00",
  "authorization_url": "https://checkout.paystack.com/access_code_987654321"
}
Step 2: Verify Payment
Endpoint: GET /transactions/verify-payment/ Description: After the user completes payment on Paystack, they are redirected back to your site. You MUST call this endpoint with the reference to confirm the payment and update the order status. Query Params: ?reference=tr_889900aabbcc Response:

JSON
{
  "status": "success",
  "message": "Payment verified successfully",
  "data": {
    "amount": "1200000.00",
    "reference": "tr_889900aabbcc",
    "status": "paid",
    "paid_at": "2026-01-24T16:35:00Z"
  }
}
7. Post-Purchase (Orders & Wallet)
History and balance tracking.

Here is the complete documentation for every endpoint under /transactions/orders, covering listing, creating, updating, deleting, and managing items within an order.

Dandelionz API Documentation - Orders & Transactions
Base URL: https://api.dandelionz.com.ng

1. General Order Management
List Orders
Endpoint: GET /transactions/orders/ Description: Retrieve a list of orders. Customers see their own; Admins see all. Response:

JSON
[
  {
    "id": 105,
    "order_id": "ORD-2026-8899",
    "customer": "5cc97d04-270d-4973-a5cf-0c273359e5d5",
    "customer_email": "customer.joy@example.com",
    "status": "PENDING",
    "payment_status": "PAID",
    "total_price": "45000.00",
    "delivery_fee": "2000.00",
    "discount": "0.00",
    "total_with_delivery": "47000.00",
    "is_delivered": false,
    "ordered_at": "2026-01-25T14:30:00Z"
  }
]
Create Order
Endpoint: POST /transactions/orders/ Description: Create a new order manually (usually called automatically via checkout, but available here). Request:

JSON
{
  "customer": "5cc97d04-270d-4973-a5cf-0c273359e5d5",
  "total_price": "45000.00",
  "delivery_fee": "2000.00",
  "shipping_address": {
    "full_name": "Joy Okon",
    "address": "12 Admiralty Way",
    "city": "Lekki",
    "state": "Lagos",
    "country": "Nigeria",
    "postal_code": "105102",
    "phone_number": "08055551234"
  }
}
Response:

JSON
{
  "id": 106,
  "order_id": "ORD-2026-9000",
  "status": "PENDING",
  "total_price": "45000.00",
  "created_at": "2026-01-25T15:00:00Z"
}
2. Specific Order Operations (ID Required)
Get Order Details
Endpoint: GET /transactions/orders/{order_id}/ Description: Retrieve full details of a specific order. Response:

JSON
{
  "id": 105,
  "order_id": "ORD-2026-8899",
  "customer": "5cc97d04-270d-4973-a5cf-0c273359e5d5",
  "customer_email": "customer.joy@example.com",
  "status": "SHIPPED",
  "payment_status": "PAID",
  "total_price": "45000.00",
  "delivery_fee": "2000.00",
  "tracking_number": "TRACK-882211",
  "shipping_address": {
    "full_name": "Joy Okon",
    "address": "12 Admiralty Way",
    "city": "Lekki",
    "state": "Lagos",
    "country": "Nigeria"
  },
  "order_items": [
    {
      "product_name": "Wireless Headphones",
      "quantity": 1,
      "item_subtotal": "45000.00"
    }
  ],
  "logs": "Order placed on 2026-01-25..."
}
Update Order (Full)
Endpoint: PUT /transactions/orders/{order_id}/ Description: Update all details of an order. Request:

JSON
{
  "customer": "5cc97d04-270d-4973-a5cf-0c273359e5d5",
  "status": "DELIVERED",
  "payment_status": "PAID",
  "total_price": "45000.00",
  "delivery_fee": "2000.00",
  "discount": "0.00",
  "shipping_address": {
    "full_name": "Joy Okon",
    "address": "Updated Address 123",
    "city": "Lagos",
    "state": "Lagos",
    "country": "Nigeria",
    "postal_code": "100001",
    "phone_number": "08055551234"
  }
}
Response:

JSON
{
  "order_id": "ORD-2026-8899",
  "status": "DELIVERED",
  "message": "Order updated successfully"
}
Update Order (Partial)
Endpoint: PATCH /transactions/orders/{order_id}/ Description: Update specific fields (e.g., changing status or adding tracking number). Request:

JSON
{
  "status": "SHIPPED",
  "tracking_number": "UPS-99887766"
}
Response:

JSON
{
  "order_id": "ORD-2026-8899",
  "status": "SHIPPED",
  "tracking_number": "UPS-99887766",
  "updated_at": "2026-01-26T09:00:00Z"
}
Delete Order
Endpoint: DELETE /transactions/orders/{order_id}/ Description: Permanently remove an order. Request: (No Body) Response: (Returns 204 No Content)

JSON
{}
Get Order Receipt
Endpoint: GET /transactions/orders/{order_id}/receipt/ Description: Get a printable receipt view of the order. Response:

JSON
{
  "order_id": "ORD-2026-8899",
  "customer_email": "customer.joy@example.com",
  "total_price": "47000.00",
  "payment": {
    "reference": "tr_123456789",
    "status": "paid",
    "amount": "47000.00",
    "paid_at": "2026-01-25T14:35:00Z"
  },
  "items": [
    {
      "product_name": "Wireless Headphones",
      "quantity": 1,
      "price_at_purchase": "45000.00"
    }
  ]
}
3. Order Items (Managing Content of Orders)
List Order Items
Endpoint: GET /transactions/orders/{order_id}/items/ Description: List just the products inside a specific order. Response:

JSON
[
  {
    "id": 501,
    "product_id": 101,
    "product": {
      "name": "Wireless Headphones",
      "price": "45000.00"
    },
    "quantity": 1,
    "item_subtotal": "45000.00"
  }
]
Create Order Item (Add to Order)
Endpoint: POST /transactions/orders/{order_id}/items/ Description: Add a new product to an existing order. Request:

JSON
{
  "product_id": 202,
  "quantity": 2
}
Response:

JSON
{
  "id": 502,
  "order": 105,
  "product_id": 202,
  "quantity": 2,
  "price_at_purchase": "12000.00",
  "item_subtotal": "24000.00"
}
Check Wallet Balance
Endpoint: GET /transactions/wallet/ Response:

JSON
{
  "balance": "5000.00",
  "updated_at": "2026-01-20T10:00:00Z",
  "transactions": [
    {
      "type": "CREDIT",
      "amount": "5000.00",
      "source": "Refund #45",
      "date": "2026-01-20T10:00:00Z"
    }
  ]
}
How to Integrate Paystack (Summary)
User Clicks Checkout: Call POST /transactions/checkout/.

Redirect: Get authorization_url from response and redirect user window to it.

User Pays: User enters card details on Paystack's secure page.

Return: Paystack redirects user back to your site (e.g., yoursite.com/payment/verify?reference=...).

Verify: Extract reference from URL and call GET /transactions/verify-payment/.

Success: If verification returns success, show "Order Confirmed" page.

Missing Documentation - Part 2: Managing Installments
How a customer pays for the remaining months of an installment plan.

Initialize Next Installment Payment
Endpoint: POST /transactions/installment-plans/init-payment/ Description: Used to pay the 2nd, 3rd, etc., installment. Returns a Paystack link. Request:

JSON
{
  "data": {
    "plan_id": 205,
    "payment_number": 2
  }
}
Response:

JSON
{
  "authorization_url": "https://checkout.paystack.com/access_code_556677",
  "reference": "installment_2_plan_205_xyz",
  "amount": 400000.00,
  "payment_number": 2
}
Verify Installment Payment
Endpoint: GET /transactions/verify-installment-payment/ Description: Verify the payment after returning from Paystack. Query Params: ?reference=installment_2_plan_205_xyz Response:

JSON
{
  "status": "PAID",
  "amount": "400000.00",
  "message": "Installment 2 verified successfully."
}
Get Installment Plan Details (Customer View)
Endpoint: GET /transactions/installment-plans/{id}/ Response:

JSON
{
  "id": 205,
  "total_amount": "1200000.00",
  "paid_installments_count": 2,
  "pending_installments_count": 1,
  "is_fully_paid": false,
  "installments": [
    {
      "payment_number": 1,
      "amount": "400000.00",
      "status": "PAID"
    },
    {
      "payment_number": 2,
      "amount": "400000.00",
      "status": "PENDING"
    }
  ]
}

Here is the clarification on Email Verification, Address Management, and Payment Management based strictly on your file.

1. Email Verification Flow
Status: Available, but the endpoint name is slightly different. You asked for /auth/verify-email/, but in your file, it is named /auth/email-verify/.

Here is the correct flow and endpoints:

Step 1: Send Verification Link

Endpoint: POST /auth/send-verification/

Who: Authenticated User

Action: Triggers an email to the user with a link containing uid and token.

Step 2: Verify Email (The Link Target)

Endpoint: GET /auth/email-verify/

Query Params: ?uid={uid}&token={token}

Action: When the user clicks the link in their email, the frontend hits this endpoint to confirm verification.

Step 2 (Alternative): Verify via POST

Endpoint: POST /auth/email-verify/

Body: { "uid": "...", "token": "..." }

Action: Same result, but used if you prefer a form submission style.

Step 3: Check Status

Endpoint: GET /auth/check-verification/

Action: Returns { "is_verified": true/false } to update the UI.

2. Address Management
Status: Limited (Profile-based only). There is no dedicated "Address Book" endpoint (e.g., /user/addresses/add/ or /user/addresses/list/) that allows a user to save multiple shipping addresses.

Instead, the address is treated as part of the Customer Profile. A customer has only one saved shipping address at a time.

To Manage Address: You must use the Profile Update endpoint.

Endpoint: PUT /user/customer/profile/ or PATCH /user/customer/profile/

Fields: shipping_address, city, state, country, postal_code.

Implication: If a user wants to ship to a different location, they must overwrite their current profile address or enter it manually during checkout (if the checkout UI supports one-off addresses).

3. Payment Method Management
Status: Vendor Only (Bank Details). There are no endpoints for Customers to save/manage Credit Cards (e.g., /user/cards/).

For Customers: Card management is likely handled entirely by the Paystack widget/checkout flow. The API does not store customer card tokens.

For Vendors: There is a flow to manage banking details for payouts.

Vendor Bank Management:

Endpoint: PUT /user/vendor/profile/

Fields: bank_name, account_number, recipient_code.

---
# API Review (Generated by Gemini)

This section contains a review of the API documentation against the client-side implementation.

---
- Section: Checkout & Payments
- Findings: There was a major disconnect between the documented Paystack integration flow and the client-side implementation. The documented redirect-based flow was chosen as the source of truth.
- Actionable Items:
    1. **Decision:** Adopt the payment flow described in the documentation (redirect-based). (Completed)
    2. Implemented `POST /transactions/checkout/` and `GET /transactions/verify-payment/` in `lib/api/publicApi.ts`. (Completed)
    3. Reworked `app/(customer)/checkout/payment/page.tsx` to use the `initializeCheckout` mutation and redirect to Paystack. (Completed)
    4. Made `app/(customer)/checkout/success/page.tsx` dynamic to handle payment verification using the `verifyPayment` query. (Completed)
- Priority: High
- Status: Closed

---
- Section: Authentication - Password Reset
- Findings: The application's frontend was missing the UI for the second step of the password reset flow.
- Actionable Items:
    1. Created a new page at `app/forgot-password/confirm/page.tsx`. (Completed)
    2. Implemented the `confirmPasswordReset` mutation in `lib/api/authApi.ts`. (Completed)
    3. Connected the new page to the mutation to complete the feature. (Completed)
- Priority: High
- Status: Closed

---
- Section: Authentication & Profile - Feature Mismatch
- Findings: The documentation contradicted the implementation regarding address and payment method management.
- Actionable Items:
    1. **Decision:** Aligned the application with the documentation. It now supports a single address per customer profile and no saved payment methods for customers. (Completed)
    2. Removed the multi-address and payment method endpoints from `lib/api/customerApi.ts`. (Completed)
    3. Renamed the `addresses` directory to `address` and reworked the page to edit the single profile address using `PATCH`. (Completed)
    4. Verified the main profile page also correctly uses `PATCH` for address updates. (Completed)
    5. Deleted the obsolete payment management UI page. (Completed)
- Priority: High
- Status: Closed

---
- Section: Authentication - Email Verification URL Correction
- Findings: The `lib/api/authApi.ts` implemented the `verifyEmail` mutation using `/auth/verify-email/`, while the documentation addendum specified `/auth/email-verify/`.
- Actionable Items:
    1. Corrected the URL for the `verifyEmail` mutation in `lib/api/authApi.ts` to `/auth/email-verify/` to align with the documentation. (Completed)
- Priority: High
- Status: Closed

---
- Section: Engagement & Cart - Incorrect Identifiers
- Findings: The endpoints for adding/removing items from the cart and wishlist are documented to use a product `id` (integer) or `slug`, but the client-side implementation is inconsistent.
- Actionable Items:
    1. **Clarification:** The backend requires `product` (slug string) for "Add" operations.
    2. Updated `lib/api/publicApi.ts` to expect `product` (string) for `addToCart` and `addToWishlist`. (Completed)
    3. Updated frontend components (`ProductCard`, `ProductDetailPage`) to pass the slug for these actions. (Completed)
- Priority: Medium
- Status: Closed

---
- Section: Product Discovery - Product Filtering
- Findings: The documentation specifies the endpoint for filtering products as `/store/products/filtered/`, but the implementation uses `/store/products/`.
- Actionable Items:
    1. Decision: Retain documentation as `/store/products/filtered/`. Backend should alias this or frontend will continue using standard REST filtering on the main endpoint.
- Priority: Low
- Status: Closed

---
- Section: Order & Tracking Implementation
- Findings: The frontend UI for Orders, Order Details, Receipts, and Tracking was using hardcoded data and missing dedicated endpoints for timelines and receipts in the original implementation plan.
- Actionable Items:
    1. **Decision:** Updated `publicApi.ts` to include `Order`, `OrderTimeline`, and `OrderItem` interfaces. (Completed)
    2. Implemented `getOrderDetails` (with timeline support) and `getOrderReceipt` endpoints in `publicApi.ts`. (Completed)
    3. Refactored `app/(customer)/orders/page.tsx` to fetch live data and filter by status (Completed/Ongoing/Returned). (Completed)
    4. Refactored `app/(customer)/orders/[id]/page.tsx` to display dynamic order details and the status timeline. (Completed)
    5. Refactored `app/(customer)/receipt/page.tsx` to read `orderId` from URL and fetch live receipt data. (Completed)
    6. Refactored `app/(customer)/order-tracking/page.tsx` to support searching by Order ID and displaying the live tracking timeline. (Completed)
- Priority: High
- Status: Closed
