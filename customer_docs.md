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

List Order History
Endpoint: GET /transactions/orders/ Response:

JSON
[
  {
    "order_id": "ORD-2026-5501",
    "status": "PAID",
    "total_price": "1200000.00",
    "is_delivered": false,
    "ordered_at": "2026-01-24T16:30:00Z"
  }
]
Get Order Receipt/Details
Endpoint: GET /transactions/orders/{order_id}/receipt/ Response:

JSON
{
  "order_id": "ORD-2026-5501",
  "customer_email": "customer.joy@example.com",
  "total_price": "1200000.00",
  "payment_status": "PAID",
  "shipping_address": {
    "address": "45 Bennet Drive",
    "city": "Benin City"
  },
  "items": [
    {
      "product_name": "iPhone 15 Pro",
      "quantity": 1,
      "price": "1200000.00"
    }
  ]
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