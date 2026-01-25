Here is Part 1 of the Admin API Documentation.

This section covers Admin Account Management, User Management, and Vendor Management.

Dandelionz Admin API Documentation - Part 1
Base URL: https://api.dandelionz.com.ng

1. Admin Account & Profile
Manage the logged-in admin's personal details and security.

Get/Update Admin Profile
Endpoint: GET /user/admin/account/profile/ Response:

JSON
{
  "uuid": "a1b2c3d4-e5f6-4a5b-b5c6-d7e8f9a0b1c2",
  "email": "admin@dandelionz.com.ng",
  "full_name": "Admin Tunde",
  "phone_number": "08011223344",
  "profile_picture": "https://api.dandelionz.com.ng/media/admin/tunde.jpg",
  "created_at": "2024-01-10T09:00:00Z",
  "updated_at": "2025-06-15T14:30:00Z"
}
Endpoint: PUT /user/admin/account/profile/ Request:

JSON
{
  "full_name": "Admin Tunde Updated",
  "phone_number": "08099887766"
}
Response:

JSON
{
  "uuid": "a1b2c3d4-e5f6-4a5b-b5c6-d7e8f9a0b1c2",
  "email": "admin@dandelionz.com.ng",
  "full_name": "Admin Tunde Updated",
  "phone_number": "08099887766",
  "profile_picture": null,
  "created_at": "2024-01-10T09:00:00Z",
  "updated_at": "2026-01-23T10:00:00Z"
}
Upload Admin Photo
Endpoint: POST /user/admin/account/photo/ Request: (Multipart/Form-Data)

JSON
{
  "profile_picture": "(Binary File Data)"
}
Response:

JSON
{
  "profile_picture": "https://api.dandelionz.com.ng/media/admin/new-photo.jpg"
}
Change Password
Endpoint: POST /user/admin/change-password/ Request:

JSON
{
  "current_password": "OldPassword123",
  "new_password": "NewSecurePassword2026"
}
Response:

JSON
{
  "success": true,
  "message": "Password changed successfully"
}
2. User Management (Customers)
View and manage standard platform users.

List All Users
Endpoint: GET /user/admin/users/ Query Params: ?status=ACTIVE&role=CUSTOMER&search=john Response:

JSON
[
  {
    "uuid": "5cc97d04-270d-4973-a5cf-0c273359e5d5",
    "email": "customer.joy@example.com",
    "full_name": "Joy Okon",
    "phone_number": "08055551234",
    "status": "ACTIVE",
    "role": "CUSTOMER",
    "created_at": "2025-11-12T08:43:53Z",
    "total_orders": 15,
    "total_spend": "250000.00"
  },
  {
    "uuid": "88a97d04-330d-4973-b5cf-0c273359e999",
    "email": "mark.edward@example.com",
    "full_name": "Mark Edward",
    "phone_number": "08123456789",
    "status": "SUSPENDED",
    "role": "CUSTOMER",
    "created_at": "2025-10-01T10:00:00Z",
    "total_orders": 2,
    "total_spend": "15000.00"
  }
]
Get User Details
Endpoint: GET /user/admin/users/{uuid}/ Response:

JSON
{
  "uuid": "5cc97d04-270d-4973-a5cf-0c273359e5d5",
  "email": "customer.joy@example.com",
  "full_name": "Joy Okon",
  "phone_number": "08055551234",
  "status": "ACTIVE",
  "role": "CUSTOMER",
  "is_verified": true,
  "created_at": "2025-11-12T08:43:53Z",
  "updated_at": "2026-01-20T12:00:00Z",
  "total_orders": 15,
  "total_spend": "250000.00",
  "suspension_history": "No previous suspensions"
}
Suspend/Reinstate User
Endpoint: POST /user/admin/users/{uuid}/suspend/ Request:

JSON
{
  "action": "suspend",
  "reason": "Violation of terms of service regarding refunds."
}
Response:

JSON
{
  "uuid": "5cc97d04-270d-4973-a5cf-0c273359e5d5",
  "status": "SUSPENDED",
  "reason": "Violation of terms of service regarding refunds."
}
3. Vendor Management
Approve, verify, and manage marketplace sellers.

List All Vendors
Endpoint: GET /user/admin/vendors/ Response:

JSON
[
  {
    "user_uuid": "332211-aa-bb-cc-dd-ee",
    "email": "sales@techgadgets.ng",
    "store_name": "Tech Gadgets NG",
    "is_verified_vendor": true,
    "is_active": true
  },
  {
    "user_uuid": "998877-xx-yy-zz-11-22",
    "email": "contact@fashionhub.com",
    "store_name": "Fashion Hub",
    "is_verified_vendor": false,
    "is_active": true
  }
]
Get Vendor Details
Endpoint: GET /user/admin/vendors/{vendor_uuid}/ Response:

JSON
{
  "user_uuid": "332211-aa-bb-cc-dd-ee",
  "email": "sales@techgadgets.ng",
  "full_name": "Emeka Kalu",
  "phone_number": "07033344455",
  "store_name": "Tech Gadgets NG",
  "store_description": "We sell the best phones and laptops in Lagos.",
  "business_registration_number": "BN-12345678",
  "address": "15 Computer Village, Ikeja, Lagos",
  "bank_name": "GTBank",
  "account_number": "0123456789",
  "recipient_code": "RCP_123884",
  "is_verified_vendor": true,
  "is_active": true,
  "is_verified": true,
  "created_at": "2024-05-20T09:15:00Z"
}
Approve/Unapprove Vendor
Endpoint: POST /user/admin/vendors/approve/ Request:

JSON
{
  "user_uuid": "998877-xx-yy-zz-11-22",
  "approve": true
}
Response:

JSON
{
  "success": true,
  "approved": true,
  "suspended": false,
  "message": "Vendor status updated successfully."
}
Verify Vendor KYC
Endpoint: POST /user/admin/vendors/verify-kyc/ Request:

JSON
{
  "user_uuid": "998877-xx-yy-zz-11-22"
}
Response:

JSON
{
  "success": true,
  "message": "Vendor KYC marked as verified."
}
Admin Analytics Overview
Endpoint: GET /user/admin/analytics/ Response:

JSON
{
  "total_users": 10500,
  "total_vendors": 120,
  "total_orders": 45000,
  "total_products": 3200
}
Admin Audit Logs
Endpoint: GET /user/admin/audit-logs/ Response:

JSON
[
  {
    "id": 55,
    "admin_email": "admin@dandelionz.com.ng",
    "action": "suspend_user",
    "target_entity": "User",
    "target_id": "5cc97d04-270d-4973-a5cf-0c273359e5d5",
    "reason": "Fraudulent activity",
    "details": { "ip_address": "192.168.1.1" },
    "created_at": "2026-01-23T11:00:00Z"
  }
]

Here is Part 2 of the Admin API Documentation.

This section covers Product Management, Order Processing, and Delivery Logistics.

Dandelionz Admin API Documentation - Part 2
Base URL: https://api.dandelionz.com.ng

4. Product Management (Marketplace)
Manage all products listed by vendors, including approval and deletion.

List All Products (Admin View)
Endpoint: GET /user/admin/products/ Response:

JSON
[
  {
    "slug": "gaming-laptop-alienware",
    "name": "Gaming Laptop Alienware M15",
    "price": "450000.00",
    "store": "Tech World",
    "is_active": true
  },
  {
    "slug": "mens-running-shoes-nike",
    "name": "Nike Running Shoes",
    "price": "25000.00",
    "store": "Fashion Hub",
    "is_active": false
  }
]
List Pending Products (Awaiting Approval)
Endpoint: GET /store/admin/products/pending/ Response:

JSON
[
  {
    "id": 202,
    "name": "New Smartphone Model X",
    "slug": "new-smartphone-model-x",
    "store": 5,
    "vendorName": "Gadget Store",
    "price": "120000.00",
    "publish_status": "submitted",
    "approval_status": "pending",
    "created_at": "2026-01-22T10:00:00Z"
  }
]
Approve a Product
Endpoint: POST /store/admin/products/{slug}/approve/ Request: (No Body) Response:

JSON
{
  "success": true,
  "message": "Product approved successfully."
}
Reject a Product
Endpoint: POST /store/admin/products/{slug}/reject/ Request: (No Body) Response:

JSON
{
  "success": true,
  "message": "Product rejected."
}
Update Product Details (Full)
Endpoint: PUT /user/admin/products/update/ Request:

JSON
{
  "product_slug": "gaming-laptop-alienware",
  "name": "Alienware Gaming Laptop M15 R6",
  "description": "Updated description: Now includes 32GB RAM upgrade option.",
  "price": "460000.00",
  "discounted_price": "440000.00",
  "stock": 10,
  "is_active": true
}
Response:

JSON
{
  "message": "Product updated successfully"
}
Delete Product
Endpoint: DELETE /user/admin/products/{slug}/delete/ Request: (No Body) Response:

JSON
{
  "success": true,
  "message": "Product deleted successfully"
}
Product Stats
Endpoint: GET /store/admin/products/stats/ Response:

JSON
{
  "total": 500,
  "pending": 15,
  "approved": 480,
  "rejected": 5
}
5. Order Management & Logistics
View orders, assign delivery agents, and manage fulfillment.

List All Orders (Admin View)
Endpoint: GET /user/admin/orders/list/ Query Params: ?status=PENDING&payment_status=PAID Response:

JSON
[
  {
    "order_id": "ORD-2026-1001",
    "customer_email": "customer@example.com",
    "current_status": "PENDING",
    "payment_status": "PAID",
    "total_price": "15000.00",
    "delivery_fee": "1000.00",
    "ordered_at": "2026-01-23T08:30:00Z"
  }
]
Get Order Details
Endpoint: GET /user/admin/orders/{order_id}/ Response:

JSON
{
  "order_id": "ORD-2026-1001",
  "customer_email": "customer@example.com",
  "customer_phone": "08012345678",
  "current_status": "PENDING",
  "payment_status": "PAID",
  "total_price": "16000.00",
  "delivery_fee": "1000.00",
  "shipping_address": {
      "address": "123 Lagos St",
      "city": "Lagos"
  },
  "order_items": [
    {
      "product_name": "Nike Shoes",
      "quantity": 1,
      "item_subtotal": "15000.00",
      "vendor_name": "Fashion Hub"
    }
  ]
}
Cancel Order
Endpoint: POST /user/admin/orders/{order_id}/cancel/ Request:

JSON
{
  "reason": "Out of stock and vendor unable to fulfill."
}
Response:

JSON
{
  "order_id": "ORD-2026-1001",
  "status": "CANCELED",
  "reason": "Out of stock and vendor unable to fulfill."
}
Orders Summary
Endpoint: GET /user/admin/orders/summary/ Response:

JSON
{
  "pending": 12,
  "shipped": 45,
  "delivered": 120,
  "canceled": 5
}
6. Delivery Agents (Logistics)
Manage riders/drivers and assign them to orders.

List All Delivery Agents
Endpoint: GET /user/admin/delivery-agents/ Response:

JSON
[
  {
    "id": 1,
    "user_email": "rider1@dandelionz.com.ng",
    "user_full_name": "Rider Mike",
    "phone": "08099887766",
    "is_active": true,
    "current_assignments": 3
  }
]
Create Delivery Agent
Endpoint: POST /user/admin/delivery-agents/create/ Request:

JSON
{
  "email": "rider.john@dandelionz.com.ng",
  "full_name": "John Rider",
  "phone": "08122334455",
  "password": "RiderPassword123",
  "is_active": true
}
Response:

JSON
{
  "message": "Delivery agent created successfully"
}
Assign Order to Agent
Endpoint: POST /user/admin/orders/assign-logistics/ Request:

JSON
{
  "order_id": "ORD-2026-1001",
  "delivery_agent_id": 1
}
Response:

JSON
{
  "message": "Delivery agent assigned successfully",
  "order_id": "ORD-2026-1001",
  "agent": "Rider Mike"
}
Get Agent Details
Endpoint: GET /user/admin/delivery-agents/details/{agent_id}/ Response:

JSON
{
  "id": 1,
  "name": "Rider Mike",
  "total_deliveries": 150,
  "success_rate": 98.5,
  "last_active": "2026-01-23T14:00:00Z"
}

Here is Part 4, covering the missing Category Management endpoints that are strictly for Admins (Creating, Updating, and Deleting).

Dandelionz Admin API Documentation - Part 4
Base URL: https://api.dandelionz.com.ng

9. Category Management
Create and manage product categories. Note: Viewing categories (GET) is public, but modifying them is Admin-only.

Create New Categor
Endpoint: POST /store/categories/ Note: Admin access only. Request:

JSON
{
  "name": "Smart Home Devices",
  "description": "Devices for home automation and security.",
  "is_active": true,
  "image": "https://api.dandelionz.com.ng/media/categories/smarthome.jpg"
}
Response:

JSON
{
  "id": 15,
  "name": "Smart Home Devices",
  "slug": "smart-home-devices",
  "description": "Devices for home automation and security.",
  "image": "https://api.dandelionz.com.ng/media/categories/smarthome.jpg",
  "is_active": true,
  "product_count": 0,
  "total_sales": "0.00",
  "created_at": "2026-01-24T12:00:00Z",
  "updated_at": "2026-01-24T12:00:00Z"
}
Update Category (Full)
Endpoint: PUT /store/categories/{slug}/ Note: Admin access only. Request:

JSON
{
  "name": "Smart Home & Security",
  "description": "Updated description for smart home category.",
  "is_active": true,
  "image": "https://api.dandelionz.com.ng/media/categories/smarthome_v2.jpg"
}
Response:

JSON
{
  "id": 15,
  "name": "Smart Home & Security",
  "slug": "smart-home-devices",
  "description": "Updated description for smart home category.",
  "image": "https://api.dandelionz.com.ng/media/categories/smarthome_v2.jpg",
  "is_active": true,
  "product_count": 5,
  "total_sales": "150000.00",
  "updated_at": "2026-02-01T09:30:00Z"
}
Update Category (Partial)
Endpoint: PATCH /store/categories/{slug}/ Note: Admin access only. Request:

JSON
{
  "is_active": false
}
Response:

JSON
{
  "id": 15,
  "name": "Smart Home & Security",
  "slug": "smart-home-devices",
  "is_active": false,
  "updated_at": "2026-02-05T14:00:00Z"
}
Delete Category
Endpoint: DELETE /store/categories/{slug}/ Note: Admin access only. Request: (No Body) Response: (Returns 204 No Content on success)

JSON
{}

Here is Part 5: Hidden & Alternative Admin Endpoints.

1. Installment Plans (Admin View)
While this endpoint looks like a user endpoint, the description explicitly states: "Customers see their own; admins see all."

Endpoint: GET /transactions/installment-plans/ Response:

JSON
[
  {
    "id": 205,
    "order_id": "ORD-2026-5555",
    "duration": "3_months",
    "total_amount": "150000.00",
    "installment_amount": "50000.00",
    "number_of_installments": 3,
    "paid_installments_count": 1,
    "pending_installments_count": 2,
    "status": "ACTIVE",
    "is_fully_paid": false,
    "start_date": "2026-01-10T10:00:00Z"
  }
]
2. Alternative Product Review (By ID)
I previously listed the approve/reject endpoints (which use the product slug). There is also a generic review endpoint that uses the numeric ID.

Endpoint: POST /store/admin/products/{id}/review/ Note: Admin access only. Request: (No Body specified in basic Swagger, likely implies status update)

JSON
{}
Response:

JSON
{
  "success": true,
  "message": "Product review status updated."
}
3. Alternative User Suspension (Toggle)
I previously listed the detailed suspension endpoint (which requires a reason). There is a simpler "Toggle" endpoint that just takes a boolean (true/false).

Endpoint: POST /user/admin/users/suspend/ Note: Admin access only. Request:

JSON
{
  "user_uuid": "5cc97d04-270d-4973-a5cf-0c273359e5d5",
  "suspend": true
}
Response:

JSON


Here is Part 3 of the Admin API Documentation.

This final section covers Finance (Payments & Wallets) and Refund Management.

Dandelionz Admin API Documentation - Part 3
Base URL: https://api.dandelionz.com.ng

7. Finance & Payouts
Monitor platform revenue, view payments, and manage vendor payouts.

List All Payments
Endpoint: GET /user/admin/payments/ Response:

JSON
[
  {
    "id": 5001,
    "user": "Customer Ray",
    "amount": "15000.00",
    "status": "success",
    "created_at": "2026-01-23T10:00:00Z"
  },
  {
    "id": 5002,
    "user": "Customer Joy",
    "amount": "4500.00",
    "status": "failed",
    "created_at": "2026-01-23T10:15:00Z"
  }
]
Trigger Payout (Vendor/User)
Endpoint: POST /user/admin/payouts/trigger/ Request:

JSON
{
  "user_uuid": "332211-aa-bb-cc-dd-ee"
}
Response:

JSON
{
  "success": true,
  "amount": "250000.00",
  "message": "Payout of ₦250,000.00 triggered successfully for Tech Gadgets NG."
}
List All Customer Wallets
Endpoint: GET /transactions/admin/wallets/ Query Params: ?search=customer@email.com Response:

JSON
[
  {
    "id": 101,
    "user_email": "customer@email.com",
    "balance": "5000.00",
    "updated_at": "2026-01-20T09:00:00Z",
    "transactions": []
  }
]
View Transaction Logs
Endpoint: GET /transactions/logs/ Response:

JSON
[
  {
    "id": 9001,
    "order_id": "ORD-2026-1001",
    "message": "Payment successful via Paystack",
    "level": "INFO",
    "created_at": "2026-01-23T08:30:00Z"
  },
  {
    "id": 9002,
    "order_id": "ORD-2026-1001",
    "message": "Wallet credited with refund",
    "level": "INFO",
    "created_at": "2026-01-24T09:00:00Z"
  }
]
8. Refunds & Disputes
Handle customer refund requests and process financial reversals.

List Refund Requests
Endpoint: GET /transactions/refunds/ Response:

JSON
[
  {
    "id": 45,
    "payment_reference": "tr_123456789",
    "order_id": "ORD-2026-1001",
    "customer_email": "customer@example.com",
    "reason": "Item arrived damaged",
    "refunded_amount": "15000.00",
    "status": "PENDING",
    "created_at": "2026-01-24T08:00:00Z"
  }
]
Get Refund Details
Endpoint: GET /transactions/refunds/{id}/ Response:

JSON
{
  "id": 45,
  "payment_reference": "tr_123456789",
  "order_id": "ORD-2026-1001",
  "customer_email": "customer@example.com",
  "reason": "Item arrived damaged",
  "refunded_amount": "15000.00",
  "status": "PENDING",
  "created_at": "2026-01-24T08:00:00Z",
  "processed_at": null
}
Approve or Reject Refund
Endpoint: PATCH /transactions/refunds/{id}/ Request:

JSON
{
  "action": "APPROVE"
}
(Accepts "APPROVE" or "REJECT")

Response:

JSON
{
  "id": 45,
  "status": "APPROVED",
  "message": "Refund approved. Customer wallet credited."
}
Process Order Refund (Direct)
Endpoint: POST /user/admin/orders/refund/ Request:

JSON
{
  "order_uuid": "ORD-2026-1001"
}
Response:

JSON
{
  "success": true,
  "message": "Order refunded successfully."
}


I've completed my review of Part 1, comparing admin_docs.md with the code in lib/api/adminApi.ts. I found several discrepancies.

  Summary of Part 1 Review:

  High-Level Issues:

   * Base URL Mismatch: The code uses https://dandelionz.net/api, while the documentation specifies https://api.dandelionz.com.ng.
   * Response Wrapping: The code wraps all responses in a { success: boolean; data: ... } object, which the documentation omits.

  Missing Endpoints:

   * Update Admin Profile (PUT /user/admin/account/profile/)
   * Upload Admin Photo (POST /user/admin/account/photo/)
   * Suspend user with a reason (POST /user/admin/users/{uuid}/suspend/)
   * Admin Audit Logs (GET /user/admin/audit-logs/)

  Endpoint Discrepancies (Path, Fields, or Parameters):

   * Get Admin Profile: The URL in the code is /user/admin/profile/ (missing /account), and the response interface has different fields.
   * List All Users: The search parameter is missing from the code, and the response is missing total_orders and total_spend.
   * Get User Details: The response is missing total_orders, total_spend, and suspension_history.
   * Suspend User: The implemented endpoint is a simple toggle (/user/admin/users/suspend/) and doesn't match the documented one which includes a uuid     and a reason.
   * Get Vendor Details: The response interface in the code is missing most of the fields defined in the documentation.
   * Admin Analytics: The fields in the response (total_revenue, etc.) do not match the documentation (total_users, total_vendors, etc.).

  Before I proceed, how would you like to address these findings?

  I recommend we start by correcting the base URL, as it's a fundamental issue. Please let me know how you'd like to move forward.
╭────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮│ ✓  WriteTodos Set 6 todo(s)                                                                                                                        ││                                                                                                                                                    │╰────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯✦ I will continue with the review. Here is my analysis of Part 2.

  Part 2 Review: Product & Order Management

  Missing Endpoints:

   * List Pending Products (GET /store/admin/products/pending/)
   * Reject a Product (POST /store/admin/products/{slug}/reject/)
   * Update Product Details (PUT /user/admin/products/update/)
   * Product Stats (GET /store/admin/products/stats/)
   * Cancel Order (POST /user/admin/orders/{order_id}/cancel/)
   * List All Delivery Agents (GET /user/admin/delivery-agents/)
   * Create Delivery Agent (POST /user/admin/delivery-agents/create/)
   * Get Agent Details (GET /user/admin/delivery-agents/details/{agent_id}/)

  Major Discrepancies:

   * List All Orders: The path in the code is /user/admin/orders/, not /user/admin/orders/list/. The payment_status query parameter is missing, and   
     the delivery_fee is missing from the response.
   * Get Order Details: The code uses the internal uuid in the path, not the public order_id. The response is missing customer_phone and
     shipping_address.
   * Assign Order to Agent: The delivery_agent_id is missing from the request in the code.
   * Orders Summary: The response in the code is missing the canceled order count.

  I will now proceed to Part 4. After all parts are reviewed, we can create a plan to address these discrepancies.
╭────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮│ ✓  WriteTodos Set 6 todo(s)                                                                                                                        ││                                                                                                                                                    │╰────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯✦ I will now review Part 4.

  Part 4 Review: Category Management

  This section has significant discrepancies between the documentation and the code.

  Missing Endpoint:

   * Partial Category Update (PATCH /store/categories/{slug}/)

  Major Discrepancies:

   * Endpoint Paths: The paths are completely different. The docs use /store/categories/, while the code uses /user/admin/products/categories/.       
   * Request Body: The code expects FormData for creating and updating categories, but the documentation specifies a JSON body.
   * Identifiers: The code uses the category {id} for updates and deletions, while the documentation specifies the {slug}.
   * Response Fields: The product_count and total_sales fields are missing from the Category interface in the code.

  I will now proceed with Part 5.
╭────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮│ ✓  WriteTodos Set 6 todo(s)                                                                                                                        ││                                                                                                                                                    │╰────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
✦ I will now review Part 5.

  Part 5 Review: Hidden & Alternative Endpoints

   * Missing Endpoints:
       * Get Installment Plans (GET /transactions/installment-plans/)
       * Product Review by ID (POST /store/admin/products/{id}/review/)

   * Confirmation:
       * The suspendUser mutation implemented in the code matches the "Alternative User Suspension" endpoint described in this section.

  I will now proceed with the final review of Part 3.
╭────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮│ ✓  WriteTodos Set 6 todo(s)                                                                                                                        ││                                                                                                                                                    │╰────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
✦ I will now review Part 3.

  Part 3 Review: Finance, Payouts & Refunds

  This section has the most missing endpoints.

  Missing Endpoints:

   * List All Customer Wallets (GET /transactions/admin/wallets/)
   * View Transaction Logs (GET /transactions/logs/)
   * List Refund Requests (GET /transactions/refunds/)
   * Get Refund Details (GET /transactions/refunds/{id}/)        
   * Approve or Reject Refund (PATCH /transactions/refunds/{id}/)

  Major Discrepancies:

   * List All Payments: The user field is missing from the response interface in the code.
   * Trigger Payout: The amount field is missing from the response.

  This completes the review of all parts. I will now provide a comprehensive summary and then we can decide on the next steps.
╭────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮│ ✓  WriteTodos Set 6 todo(s)                                                                                                                        ││                                                                                                                                                    │╰────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
✦ I have completed the review of all specified parts of the admin_docs.md file.

  Full Review Summary

  Global Issues:

   1. Base URL Mismatch: The code (https://dandelionz.net/api) and documentation (https://api.dandelionz.com.ng) have different base URLs.
   2. Response Wrapping: The code wraps responses in a { success: boolean; data: ... } object, which the documentation does not show.
   3. Inconsistent Identifiers: There's a mix of uuid, slug, and id used for resources, often inconsistently between the docs and the code.
   4. JSON vs. FormData: For category management, the code expects FormData, while the documentation specifies JSON.

  Missing Endpoints:

  The following endpoints are documented but not implemented in adminApi.ts:

   * Account & Users: Update Profile, Upload Photo, Suspend with reason, Audit Logs.
   * Products & Orders: List Pending Products, Reject Product, Update Product, Product Stats, Cancel Order, and all Delivery Agent endpoints.
   * Finance & Refunds: List Wallets, Transaction Logs, List Refunds, Refund Details, Approve/Reject Refund.
   * Categories: Partial Category Update.
   * Alternative Endpoints: Installment Plans, Product Review by ID.

  Implemented Endpoints with Major Discrepancies:

   * Get Admin Profile: Incorrect path and incomplete response interface.
   * User Management: Missing search parameter and fields in response.
   * Get Vendor Details: The response interface is missing most fields.
   * Admin Analytics: Response fields do not match the documentation.
   * Order Management: Incorrect paths, missing query parameters, and missing fields in responses.
   * Category Management: Incorrect paths, identifiers (id vs. slug), and request body format (FormData vs. JSON).

  Proposed Action Plan

   1. Correct the Base URL: I will start by updating the base URL in lib/api/baseApi.ts to match the documentation. This is a critical first step.    
   2. Align Interfaces & Endpoints: Next, I will fix the interfaces, paths, and parameters in lib/api/adminApi.ts to match the documentation for all  
      existing endpoints.
   3. Implement Missing Endpoints: After correcting the existing code, I will begin implementing the missing endpoints, prioritizing those that are   
      most critical for your admin panel.
   4. Clarify JSON vs. FormData: We will need to determine the correct format for category management. I will assume the code's use of FormData is    
      correct for now.
-------------------------------------------------------------------


Updated Project Status Summary

  Global API & Codebase Status:

   * Base URL: FIXED (correctly https://api.dandelionz.com.ng/api).
   * Response Wrapping: Consistent { success, data } pattern in code. admin_docs.md needs to reflect this.
   * Identifiers & Body Formats: We've aligned most critical paths and request/response structures with UI needs. Discrepancies in     admin_docs.md remain where it doesn't match the working code.

  Implemented Features (Functional & Connected to Backend):

   1. Admin Account & Profile:
       * Get Admin Profile: Functional. Path /user/admin/account/profile/ is correct.
       * Update Admin Profile: Functional (name, phone number update).
       * Upload Admin Photo: Functional.
       * Change Password: Functional.

   2. User Management:
       * Users List: Functional, displaying live data.
       * User Details: Functional, displaying rich user data.
       * Update User Status (Suspend/Activate with Reason): Functional via updateUserStatus mutation.
       * `deleteUser`: REMOVED as requested.

   3. Vendor Management:
       * Vendors List: Functional.
       * Vendor Details: Functional, displaying vendor details including address.
       * Suspend Vendor (with Reason): Functional via suspendVendorWithReason mutation.
       * Approve/Reject Vendor (Simple Toggle): Functional.
       * Verify Vendor KYC: Functional.

   4. Order Management:
       * Orders List: Functional.
       * Order Details: Functional, displaying detailed order data.
       * Cancel Order (with Reason): Functional via cancelOrderWithReason mutation.
       * Update Order Status: Functional for "Process" and "Complete" actions.

   5. Product Management:
       * Products List: Functional.
       * Admin Product Details: Functional.
       * Approve Product: Functional.
       * Reject Product (with Reason): Functional via rejectProductAdmin mutation.

  ---

  Remaining Significant Discrepancies & Unimplemented UI/API:

   1. Admin Analytics Page:
       * Status: UI (app/admin/account/analytics/page.tsx) exists but is not connected.
       * API Discrepancy: The Analytics interface in adminApi.ts needs to be updated to reflect the Figma design (Total Sales,    
         Total Vendors, Total Orders, Total Users, plus order breakdown stats).

   2. Notification Management:
       * Status: UI for "Notification List" and "Create Notification" exists but is not connected to the backend.
       * API Readiness: All necessary API mutations/queries are defined in adminApi.ts.

   3. Other Missing Endpoints/Features from `admin_docs.md`: Numerous endpoints are documented but remain unimplemented in the    
      frontend (e.g., Audit Logs, advanced Product/Category management, Delivery Agents, most Finance & Payouts, Refunds &        
      Disputes).

  ---

  Next Steps (Proceeding with Notifications as instructed):

  Based on your last instruction, the next logical step is to connect the Admin Notification pages to the backend.

  Plan for Admin Notifications:

   1. Implement `Create Notification` Page (`app/admin/account/notifications/create/page.tsx`):
       * Connect the form to useCreateNotificationMutation.
       * Handle "Send Notification" and "Save as Draft" actions, passing title, message, recipient_type, and status.
       * "Attach File" and "Schedule Notification" buttons will remain in the UI but will be disabled/non-functional as their     
         backend support is not yet handled.

   2. Implement `Notification List` Page (`app/admin/account/notifications/page.tsx`):
       * Connect to useGetAllNotificationsQuery.
       * Replace mockNotifications with fetched data and display it.

---

## Implementation Status

### Notification Management
- **GET /user/admin/notifications/**: Implemented.
- **POST /user/admin/notifications/**: Implemented.
- **GET /user/admin/notifications/{id}/**: Implemented.
- **DELETE /user/admin/notifications/{id}/**: Implemented.
