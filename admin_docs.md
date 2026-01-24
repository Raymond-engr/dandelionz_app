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