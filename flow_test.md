## 🧪 Flow Testing & Validation Guide

### Testing the Complete Customer Journey

This section provides step-by-step instructions to manually test the entire flow from signup through checkout.

#### **Prerequisites**
- API running on `http://localhost:8000`
- Swagger docs available at `http://localhost:8000/swagger/`
- Test email configured
- Paystack sandbox credentials configured

#### **Step 1: User Registration Test**

**Endpoint:** `POST /api/auth/register/`

**Test Data:**
```json
{
  "email": "testcustomer@example.com",
  "password": "TestPassword123!",
  "phone_number": "+2348012345678",
  "full_name": "Test Customer",
  "role": "CUSTOMER"
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "tokens": {
      "access_token": "eyJhbGc...",
      "refresh_token": "eyJhbGc..."
    }
  }
}
```

**Validation Points:**
- ✅ Status code 201
- ✅ User UUID generated
- ✅ JWT tokens issued
- ✅ Email verification link sent
- ✅ CustomerProfile created
- ✅ Wallet created

---

#### **Step 2: Email Verification Test**

**Check email** for verification link and extract token.

**Endpoint:** `POST /api/auth/email-verify/`

**Test Data:**
```json
{
  "token": "{email_token_from_email}"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

**Validation Points:**
- ✅ Status code 200
- ✅ CustomUser.is_verified = true
- ✅ Verification email marked in system

---

#### **Step 3: Login Test**

**Endpoint:** `POST /api/auth/login/`

**Test Data:**
```json
{
  "email": "testcustomer@example.com",
  "password": "TestPassword123!"
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "tokens": {
      "access_token": "eyJhbGc...",
      "refresh_token": "eyJhbGc..."
    }
  }
}
```

**Validation Points:**
- ✅ Status code 200
- ✅ Access token valid
- ✅ Can use token in subsequent requests

**Save the access token** for next steps (use as: `Authorization: Bearer {access_token}`)

---

#### **Step 4: Update Profile with Shipping Address**

**Endpoint:** `PATCH /api/user/profile/`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Test Data:**
```json
{
  "full_name": "Test Customer",
  "phone_number": "+2348012345678",
  "shipping_address": "123 Main Street",
  "shipping_city": "Lagos",
  "shipping_state": "Lagos",
  "shipping_country": "Nigeria",
  "shipping_postal_code": "100001",
  "shipping_latitude": 6.5244,
  "shipping_longitude": 3.3792
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "shipping_address": "123 Main Street",
    "shipping_latitude": 6.5244,
    "shipping_longitude": 3.3792
  }
}
```

**Validation Points:**
- ✅ Status code 200
- ✅ Profile updated
- ✅ Coordinates stored (critical for delivery fee calculation)
- ✅ Subsequent requests can retrieve updated profile

---

#### **Step 5: Browse Products**

**Endpoint:** `GET /api/store/products/?category=electronics&min_price=10000&max_price=1000000`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "slug": "iphone-15-pro",
      "name": "iPhone 15 Pro",
      "price": "1200000.00",
      "discount": 10,
      "stock": 50,
      "approval_status": "approved",
      "publish_status": "submitted"
    }
  ]
}
```

**Validation Points:**
- ✅ Only approved products shown
- ✅ Filtering by category works
- ✅ Price filtering works
- ✅ All required fields present

**Note:** Save a product slug (e.g., `iphone-15-pro`) for next steps.

---

#### **Step 6: Add Items to Cart**

**Endpoint:** `POST /api/store/cart/add/`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Test Data:**
```json
{
  "slug": "iphone-15-pro",
  "quantity": 2
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "product": "iphone-15-pro",
    "quantity": 2,
    "subtotal": "2160000.00"
  }
}
```

**Validation Points:**
- ✅ Status code 201
- ✅ CartItem created
- ✅ Quantity stored correctly
- ✅ Subtotal calculated with discount applied

**Add another item** to cart to test multi-vendor scenario:
```json
{
  "slug": "another-product",
  "quantity": 1
}
```

---

#### **Step 7: View Cart**

**Endpoint:** `GET /api/store/cart/`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "items": [
      {
        "id": 1,
        "product_slug": "iphone-15-pro",
        "quantity": 2,
        "subtotal": "2160000.00"
      },
      {
        "id": 2,
        "product_slug": "another-product",
        "quantity": 1,
        "subtotal": "540000.00"
      }
    ],
    "total": "2700000.00"
  }
}
```

**Validation Points:**
- ✅ All cart items displayed
- ✅ Subtotals calculated correctly
- ✅ Cart total is sum of all items
- ✅ Multiple vendors possible

---

#### **Step 8: Checkout (Create Order)**

**Endpoint:** `POST /api/transactions/checkout/`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request:** Empty body (uses cart items automatically)
```json
{}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "order_id": "550e8400-e29b-41d4-a716-446655440001",
    "authorization_url": "https://checkout.paystack.com/...",
    "reference": "order-ref-1234567890",
    "amount": 2700000,
    "order_items": [
      {
        "product": "iphone-15-pro",
        "quantity": 2,
        "price_at_purchase": "1200000.00"
      }
    ],
    "delivery_fee": 5000,
    "delivery_distance": "15.3 km"
  }
}
```

**Validation Points:**
- ✅ Status code 201
- ✅ Order created with PENDING status
- ✅ Order UUID generated
- ✅ CartItems converted to OrderItems
- ✅ Payment record created
- ✅ Paystack initialized
- ✅ authorization_url provided
- ✅ Delivery fee calculated from coordinates
- ✅ Order total = cart_subtotal + delivery_fee
- ✅ Order.payment_status = 'UNPAID'
- ✅ Order.status = 'PENDING'

**Save the order_id and reference** for payment verification.

---

#### **Step 9: Verify Payment**

**Endpoint:** `POST /api/transactions/verify-payment/`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Test Data:**
```json
{
  "reference": "order-ref-1234567890"
}
```

**In Paystack Sandbox:**
- Complete payment with test card: `4111 1111 1111 1111`
- OTP: `123456`
- Enter any future expiry date

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "order_id": "550e8400-e29b-41d4-a716-446655440001",
    "status": "PAID",
    "payment_status": "PAID",
    "amount": 2700000
  }
}
```

**Validation Points:**
- ✅ Status code 200
- ✅ Payment marked verified
- ✅ Order status = PAID
- ✅ Order payment_status = PAID

---

#### **Step 10: Verify Webhook Processing**

**Backend automatically processes** Paystack webhook when payment completes.

**Check:**
1. **Vendor wallets credited:**
   ```
   Endpoint: GET /api/transactions/wallet/
   Expected: Vendor balance increased by (item_subtotal * 0.9)
   ```

2. **Wallet transactions created:**
   ```
   Endpoint: GET /api/transactions/wallet/transactions/
   Expected: CREDIT transaction for each vendor
   ```

3. **Order status updated:**
   ```
   Endpoint: GET /api/transactions/orders/{order_id}/
   Expected: payment_status = 'PAID', status = 'PAID'
   ```

**Validation Points:**
- ✅ Order.payment_status changed to PAID
- ✅ Vendors credited in wallets
- ✅ WalletTransactions created
- ✅ TransactionLogs created for audit
- ✅ Platform commission (10%) deducted
- ✅ Notifications sent to vendors

---

#### **Step 11: View Order Details**

**Endpoint:** `GET /api/transactions/orders/{order_id}/`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "order_id": "550e8400-e29b-41d4-a716-446655440001",
    "status": "PAID",
    "payment_status": "PAID",
    "total_price": "2700000.00",
    "delivery_fee": "5000.00",
    "order_items": [
      {
        "product": "iphone-15-pro",
        "quantity": 2,
        "price_at_purchase": "1200000.00",
        "item_subtotal": "2400000.00"
      }
    ],
    "ordered_at": "2024-01-08T10:30:00Z"
  }
}
```

**Validation Points:**
- ✅ Order fully populated
- ✅ Historical prices preserved
- ✅ Delivery fee included
- ✅ Status transitions visible

---

#### **Step 12: Get Order Receipt**

**Endpoint:** `GET /api/transactions/orders/{order_id}/receipt/`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "order_id": "550e8400-e29b-41d4-a716-446655440001",
    "invoice_number": "INV-20240108-001",
    "customer": "Test Customer",
    "items": [...],
    "subtotal": "2695000.00",
    "delivery_fee": "5000.00",
    "total": "2700000.00",
    "payment_method": "Paystack",
    "status": "PAID"
  }
}
```

**Validation Points:**
- ✅ Receipt formatted correctly
- ✅ All order details included
- ✅ Ready for printing/PDF export

---

### Common Issues & Troubleshooting

| Issue | Solution |
|-------|----------|
| **Checkout fails** with "Shipping address with coordinates required" | Make sure to update profile with shipping_latitude and shipping_longitude (Step 4) |
| **Delivery fee = 0** | Verify vendor has store_latitude/store_longitude. Check delivery service is configured. |
| **Payment verification fails** | Ensure reference matches exactly. Check Paystack credentials in settings. |
| **Vendors not credited** | Check webhook was processed. Verify payment_status = 'PAID'. Check Wallet model exists. |
| **Cart persists after checkout** | Cart is intentionally not cleared until order confirmed. This is by design. |
| **Only one item in cart** | Each user has ONE cart with unique constraint per product. Quantity is incremented. |
| **Product not visible** | Verify approval_status='approved' AND publish_status='submitted'. |

---

## 🏗️ System Architecture

### High-Level Flow

```
Client Application
       ↓
API Endpoints (REST)
       ↓
┌─────────────────────────────────────┐
│    Authentication & Verification     │
│  (JWT Tokens, Email Verification)    │
└─────────────────────────────────────┘
       ↓
┌──────────────────────────────────────────────────────────┐
│  Core Services (User Profiles, Orders, Payments)         │
│  ┌─────────────┬────────────┬────────────┬─────────────┐ │
│  │  Users      │  Products  │  Orders    │ Payments    │ │
│  │  (Vendor,   │  (Create,  │  (CRUD,    │ (Paystack,  │ │
│  │   Customer) │   Catalog) │   Status)  │  Wallet)    │ │
│  └─────────────┴────────────┴────────────┴─────────────┘ │
└──────────────────────────────────────────────────────────┘
       ↓
┌──────────────────────────────────────┐
│      PostgreSQL Database              │
│  (Models, Transactions, Audit Trail)  │
└──────────────────────────────────────┘
       ↓
┌──────────────────────────────────────┐
│  External Services                    │
│  ├─ Cloudinary (Image Storage)        │
│  ├─ Paystack (Payment Gateway)        │
│  ├─ Email Service (Verification)      │
│  └─ Redis (Caching/Queues)            │
└──────────────────────────────────────┘
```



Here is the comprehensive documentation for Payments & Checkout, covering both Instant (One-time) payments and Installment plans.

This includes the flows for initiating checkout, verifying payments, paying subsequent installments, and managing plans.

Dandelionz API Documentation - Payments & Checkout
Base URL: https://api.dandelionz.com.ng

1. Checkout Initiation (The Start)
The entry point for paying. You either pay everything at once or choose a plan.

Option A: Instant / Complete Checkout
Endpoint: POST /transactions/checkout/ Description: Pay for the entire cart contents immediately. Request: (No Body - uses active cart) Response:

JSON
{
  "order_id": "ORD-2026-1050",
  "amount": 150000.00,
  "reference": "tr_instant_889900",
  "authorization_url": "https://checkout.paystack.com/access_code_instant_123",
  "access_code": "instant_123"
}
Option B: Installment Checkout (Pay Over Time)
Endpoint: POST /transactions/checkout/installment/ Description: Create an order but split the payment. This initializes the 1st Payment immediately. Request:

JSON
{
  "data": {
    "duration": "3_months"
  }
}
Supported Durations: 1_month, 3_months, 6_months, 1_year.

Response:

JSON
{
  "order_id": "ORD-2026-1055",
  "installment_plan_id": 205,
  "duration": "3_months",
  "total_amount": "150000.00",
  "number_of_installments": 3,
  "installment_amount": "50000.00",
  "first_installment_reference": "tr_inst_1_plan_205",
  "authorization_url": "https://checkout.paystack.com/access_code_inst_1"
}
2. Payment Verification (Closing the Loop)
After the user returns from Paystack, you must verify the transaction.

Verify Instant Payment
Endpoint: GET /transactions/verify-payment/ Query Params: ?reference=tr_instant_889900 Response:

JSON
{
  "status": "success",
  "message": "Payment verified",
  "data": {
    "amount": "150000.00",
    "status": "paid",
    "reference": "tr_instant_889900",
    "paid_at": "2026-01-29T10:00:00Z"
  }
}
Verify Installment Payment
Endpoint: GET /transactions/verify-installment-payment/ Description: Verifies ANY installment payment (1st, 2nd, or 3rd). Query Params: ?reference=tr_inst_1_plan_205 Response:

JSON
{
  "status": "success",
  "message": "Installment payment verified",
  "data": {
    "payment_number": 1,
    "amount": "50000.00",
    "status": "PAID",
    "plan_id": 205,
    "is_plan_completed": false
  }
}
3. Subsequent Installments (Paying the Rest)
How a customer comes back later to pay the 2nd, 3rd, etc. installment.

Initialize Next Payment
Endpoint: POST /transactions/installment-plans/init-payment/ Description: Generates a payment link for a specific installment. Request:

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
  "authorization_url": "https://checkout.paystack.com/access_code_inst_2",
  "reference": "tr_inst_2_plan_205",
  "amount": 50000.00,
  "payment_number": 2,
  "installment_plan_id": 205
}
4. Installment Management (History & Status)
Endpoints for Customers to track progress and Admins to monitor plans.

List Installment Plans
Endpoint: GET /transactions/installment-plans/ Description:

Customer: Lists only their active/past plans.

Admin: Lists all plans on the platform. Response:

JSON
[
  {
    "id": 205,
    "order_id": "ORD-2026-1055",
    "duration": "3_months",
    "total_amount": "150000.00",
    "installment_amount": "50000.00",
    "paid_installments_count": 1,
    "pending_installments_count": 2,
    "status": "ACTIVE",
    "is_fully_paid": false,
    "start_date": "2026-01-29T10:00:00Z"
  }
]
Get Plan Details
Endpoint: GET /transactions/installment-plans/{id}/ Description: Get the full breakdown of a specific plan, including the status of every payment. Response:

JSON
{
  "id": 205,
  "order_id": "ORD-2026-1055",
  "total_amount": "150000.00",
  "status": "ACTIVE",
  "installments": [
    {
      "payment_number": 1,
      "amount": "50000.00",
      "status": "PAID",
      "paid_at": "2026-01-29T10:05:00Z"
    },
    {
      "payment_number": 2,
      "amount": "50000.00",
      "status": "PENDING",
      "due_date": "2026-02-28T10:00:00Z"
    },
    {
      "payment_number": 3,
      "amount": "50000.00",
      "status": "PENDING",
      "due_date": "2026-03-29T10:00:00Z"
    }
  ]
}
List Payments for a Plan
Endpoint: GET /transactions/installment-plans/{plan_id}/payments/ Description: Retrieve just the payment records for a specific plan. Response:

JSON
[
  {
    "payment_number": 1,
    "amount": "50000.00",
    "reference": "tr_inst_1_plan_205",
    "status": "PAID",
    "gateway": "paystack"
  },
  {
    "payment_number": 2,
    "amount": "50000.00",
    "reference": null,
    "status": "PENDING",
    "gateway": "paystack"
  }
]
5. Webhooks (System Notifications)
Endpoints called automatically by Paystack (Backend Only).

Single Payment Webhook
Endpoint: POST /transactions/webhook/ Response: (200 OK)

Installment Payment Webhook
Endpoint: POST /transactions/installment-webhook/ Response: (200 OK)