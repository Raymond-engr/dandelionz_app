this was the request to this endpoint: https://dandelionz.net/api/auth/register/
{
"email": "raymondomoyakhi@gmail.com",
"password": "SecureAdminPassword123",
"phone_number": "08123456789",
"full_name": "Raymond Omoyakhi",
"role": "CUSTOMER"
}

and this was the response:

{
"success": true,
"data": {
"user": {
"id": 10,
"email": "raymondomoyakhi@gmail.com",
"full_name": "Raymond Omoyakhi",
"phone_number": "08123456789",
"profile_picture": null,
"role": "CUSTOMER",
"is_verified": false,
"created_at": "2025-12-10T11:27:02.137477Z"
},
"tokens": {
"access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzY1MzY2OTIzLCJpYXQiOjE3NjUzNjYwMjMsImp0aSI6IjA4MDZiOTA3LWIxMGUtNDMwNC1hZjY4LWQxYzJhMTUzNTUzYiIsInVzZXJfaWQiOiIxMCIsImlzX3N0YWZmIjpmYWxzZSwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwiaXNfdmVyaWZpZWQiOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.lgqaSfQ3sCqV9c4D1v0N8zdm2fD5cA7cKkdUbOjh0QA",
"refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NjU3NTYyMywiaWF0IjoxNzY1MzY2MDIzLCJqdGkiOiJmZjdhNDJlMC1jMDJkLTRjMDEtODBhMy05NGE2MTliY2I3NDkiLCJ1c2VyX2lkIjoiMTAiLCJpc19zdGFmZiI6ZmFsc2UsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsImlzX3ZlcmlmaWVkIjpmYWxzZSwidHlwZSI6InJlZnJlc2gifQ.22EN3iGYqzhdtAxPzasMxNG-aEb-zCqwsskaHzTP9vQ",
"token_type": "Bearer",
"expires_in": 900,
"refresh_expires_in": 1209600,
"user_id": 10,
"issued_at": 1765366023
},
"is_new_user": true,
"email_verified": false
}
}

I also created an account but this time the role was VENDOR and sent the same request and got similar responses too then the third role is BUSINESS_ADMIN, they don't sign up they have already been seeded in the database and they can just login with the credentials. also for the BUSINESS_ADMIN role this fields are this already when I login: "email_verified": true,
"verification_needed": false

this is the response when you login with the as the BUSINESS_ADMIN

{
"success": true,
"data": {
"user": {
"uuid": "77ead886-cdad-4455-9222-a6ae6f2bce36",
"email": "raymond@dandelionz.net",
"full_name": "",
"phone_number": null,
"profile_picture": null,
"role": "BUSINESS_ADMIN",
"is_verified": true,
"created_at": "2025-12-18T18:25:43.388673Z",
"referral_code": "D78BFAFF3A06"
},
"tokens": {
"access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzY2MzE2MDUwLCJpYXQiOjE3NjYzMTUxNTAsImp0aSI6IjZlZjQzOWE1LWUxZWMtNGJhNy1hYWE4LTZkYWJhODk1NTY2NiIsInVzZXJfdXVpZCI6Ijc3ZWFkODg2LWNkYWQtNDQ1NS05MjIyLWE2YWU2ZjJiY2UzNiIsImlzX3N0YWZmIjpmYWxzZSwiZW1haWwiOiJyYXltb25kQGRhbmRlbGlvbnoubmV0IiwiaXNfdmVyaWZpZWQiOnRydWUsInR5cGUiOiJhY2Nlc3MifQ.R2tE3B13YLQFfAssuLh6mYlTGjo0pQBaqPSOB9LiJgA",
"refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzUyNDc1MCwiaWF0IjoxNzY2MzE1MTUwLCJqdGkiOiI0OWM2YThiNC1kOWI3LTRjMmYtODcyNy01NmQ4NzA3ZjRhMTciLCJ1c2VyX3V1aWQiOiI3N2VhZDg4Ni1jZGFkLTQ0NTUtOTIyMi1hNmFlNmYyYmNlMzYiLCJpc19zdGFmZiI6ZmFsc2UsImVtYWlsIjoicmF5bW9uZEBkYW5kZWxpb256Lm5ldCIsImlzX3ZlcmlmaWVkIjp0cnVlLCJ0eXBlIjoicmVmcmVzaCJ9.ynMmAzRRX_A31ntce4P4Zss-zSo2fynfy6ALLmCiNZk",
"token_type": "Bearer",
"expires_in": 900,
"refresh_expires_in": 1209600,
"user_uuid": "77ead886-cdad-4455-9222-a6ae6f2bce36",
"issued_at": 1766315150
},
"email_verified": true,
"verification_needed": false
}
}

This was the request to this endpoint: https://dandelionz.net/api/auth/login/

{"email": "raymondomoyakhi@gmail.com",
"password": "SecureAdminPassword123"
}

and this was the response:

{
"success": true,
"data": {
"user": {
"uuid": "a2221102-1f78-4b37-ab42-361cd716c6ad",
"email": "raymondomoyakhi@gmail.com",
"full_name": "Raymond Omoyakhi",
"phone_number": "08123456789",
"profile_picture": null,
"role": "CUSTOMER",
"is_verified": false,
"created_at": "2025-12-21T10:39:47.606924Z",
"referral_code": "64F37A135078"
},
"tokens": {
"access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzY2MzE0NTI2LCJpYXQiOjE3NjYzMTM2MjYsImp0aSI6ImJkMTFkNWQyLWY4ZWEtNGY2ZC1hNTMxLTRiNzc3MDZmYjkzNCIsInVzZXJfdXVpZCI6ImEyMjIxMTAyLTFmNzgtNGIzNy1hYjQyLTM2MWNkNzE2YzZhZCIsImlzX3N0YWZmIjpmYWxzZSwiZW1haWwiOiJyYXltb25kb21veWFraGlAZ21haWwuY29tIiwiaXNfdmVyaWZpZWQiOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.m3MvC3lZsRkXtFSu2fDMah6YmFpCOZ6hWaaLA3hrjvM",
"refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzUyMzIyNiwiaWF0IjoxNzY2MzEzNjI2LCJqdGkiOiIzNmY5Yjk5MS0wODI3LTQzYzAtODRhNC00NGRiMjI3MmU3YWYiLCJ1c2VyX3V1aWQiOiJhMjIyMTEwMi0xZjc4LTRiMzctYWI0Mi0zNjFjZDcxNmM2YWQiLCJpc19zdGFmZiI6ZmFsc2UsImVtYWlsIjoicmF5bW9uZG9tb3lha2hpQGdtYWlsLmNvbSIsImlzX3ZlcmlmaWVkIjpmYWxzZSwidHlwZSI6InJlZnJlc2gifQ.cwO_FnxgODf_HjoI15-OCCR7QbNcWD0rkTe3EFvS6I4",
"token_type": "Bearer",
"expires_in": 900,
"refresh_expires_in": 1209600,
"user_uuid": "a2221102-1f78-4b37-ab42-361cd716c6ad",
"issued_at": 1766313626
},
"email_verified": false,
"verification_needed": true
}
}

this was the request to this endpoint: https://dandelionz.net/api/auth/token/refresh/
{
"refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzY2MzE1NDI2LCJpYXQiOjE3NjYzMTQ1MjYsImp0aSI6IjQ2MzQ5ZWM5LWNjNjktNDBkMy1iYmMxLWU5ZmE5ZWE5MmFjZSIsInVzZXJfdXVpZCI6ImEyMjIxMTAyLTFmNzgtNGIzNy1hYjQyLTM2MWNkNzE2YzZhZCIsImlzX3N0YWZmIjpmYWxzZSwiZW1haWwiOiJyYXltb25kb21veWFraGlAZ21haWwuY29tIiwiaXNfdmVyaWZpZWQiOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.omHj0R-Fh17nUZNLc84x6q3UpeeYfBNXZ9hieufPZPA"
}

this was the response:
{
"success": true,
"data": {
"access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzY2MzE1MTg5LCJpYXQiOjE3NjYzMTQyODksImp0aSI6ImQ3MWRiYzNkLWQ4YTUtNGQyMy04ZTljLTMyNjdjOGVhMjFmZiIsInVzZXJfdXVpZCI6Ijc3ZWFkODg2LWNkYWQtNDQ1NS05MjIyLWE2YWU2ZjJiY2UzNiIsImlzX3N0YWZmIjpmYWxzZSwiZW1haWwiOiJyYXltb25kQGRhbmRlbGlvbnoubmV0IiwiaXNfdmVyaWZpZWQiOnRydWUsInR5cGUiOiJhY2Nlc3MifQ.Bb8ss3y_YmQWsOOjFnIht9QDX2qKJd3gmNHkMBK--Y0",
"refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc2NzUyMzg4OSwiaWF0IjoxNzY2MzE0Mjg5LCJqdGkiOiJhZDZhZWI1NC0zNzkwLTQ2ZGMtYTUwYi01ZWNjYTQ2NjQxNDEiLCJ1c2VyX3V1aWQiOiI3N2VhZDg4Ni1jZGFkLTQ0NTUtOTIyMi1hNmFlNmYyYmNlMzYiLCJpc19zdGFmZiI6ZmFsc2UsImVtYWlsIjoicmF5bW9uZEBkYW5kZWxpb256Lm5ldCIsImlzX3ZlcmlmaWVkIjp0cnVlLCJ0eXBlIjoicmVmcmVzaCJ9.OEjWgDmRpOWeCNzCLsmhsMV8VB4Nd09KE_pg81kOYWM",
"token_type": "Bearer",
"expires_in": 900
}
}

this was the request I sent to this endpoint: https://dandelionz.net/api/auth/password-reset/

{
"email": "raymondomoyakhi@gmail.com"
}

the response I got back:
{
"success": true,
"message": "If an account exists with this email, a password reset link will be sent."
}

This is the response to this endpoint,it was a get request and I used the BUSINESS_ADMIN credentials to login and check authenticated first: https://dandelionz.net/api/auth/check-verification/

{
"success": true,
"data": {
"is_verified": true
}
}

Now I think for this next set of endpoints I'll be focusing on the admin endpoints firstly, it's your job to see if all the endpoints are needed for each respective or speific page too and being able to find the corresponding page that the endpoints are for

After logging in/authencticating as a BUSINESS_ADMIN, I made a get request to this endpoint: https://dandelionz.net/api/user/admin/analytics/

this is the response:
{
"success": true,
"data": {
"total_orders": 0,
"total_revenue": "0.00",
"pending_orders": 0,
"delivered_orders": 0
}
}

made a get request to this endpoint: https://dandelionz.net/api/user/admin/profile/

this is the reponse:
{
"success": true,
"data": {
"user": {
"uuid": "77ead886-cdad-4455-9222-a6ae6f2bce36",
"email": "raymond@dandelionz.net",
"full_name": "",
"phone_number": null,
"profile_picture": null,
"role": "BUSINESS_ADMIN",
"referral_code": "D78BFAFF3A06",
"is_verified": true,
"is_active": true,
"created_at": "2025-12-18T18:25:43.388673Z",
"updated_at": "2025-12-18T18:25:56.046469Z"
},
"position": "Staff Admin",
"can_manage_vendors": true,
"can_manage_orders": true,
"can_manage_payouts": true,
"can_manage_inventory": true
}
}

I made a post request to this endpoint: https://dandelionz.net/api/user/admin/change-password/

{
"current_password": "TheTeam123!",
"new_password": "TheTeam1234!"
}

this is the response gotten 401:

{
"detail": "Given token not valid for any token type",
"code": "token_not_valid",
"messages": [
{
"token_class": "AccessToken",
"token_type": "access",
"message": "Token is expired"
}
]
}

then I refreshed using my refresh token and the refresh token endpoint to get a new access token also make sure auth handles the places where the refresh token had expired requiring the person to login again. this is the response now:

{
"success": true,
"message": "Password updated successfully"
}

I used the old password to login and got this error:
{
"success": false,
"error": "Invalid email or password"
}

post to this endpoint: https://dandelionz.net/api/user/admin/orders/assign-logistics/
{
"order_uuid": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}

I'll get the response later, I don't have an order yet to assign logistics

this is the get request to this endpoint: https://dandelionz.net/api/user/admin/orders/summary/

this is the response gotten:

{
"success": true,
"data": {
"pending": 0,
"shipped": 0,
"delivered": 0
}
}

this is the post request for this endpoint: https://dandelionz.net/api/user/admin/orders/refund/
{
"order_uuid": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}

I'll get the response later, I don't have an order yet

This is a get request for this endpoint: https://dandelionz.net/api/user/admin/payments/

this is the response gotten:
{
"success": true,
"data": []
}
post request to this endpoint: https://dandelionz.net/api/user/admin/payouts/trigger/

{
"user_uuid": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}

the response gotten:
{
"message": "User not found"
}

I didn't use an accurate vendor user_uuid that's why

when I used this request:
{
"user_uuid": "d5b5eb11-e7f6-47b9-bfb9-81a7df662fdc"
}

I got this response:
{
"message": "Nothing to payout"
}

made a get request to this endpoint: https://dandelionz.net/api/user/admin/vendors/

got this response:
{
"success": true,
"data": [
{
"user_uuid": "d5b5eb11-e7f6-47b9-bfb9-81a7df662fdc",
"email": "raymondyakhi@gmail.com",
"store_name": "Unnamed Store",
"is_verified_vendor": false,
"is_active": true
}
]
}

when the admin uses this: ( https://dandelionz.net/api/user/admin/users/suspend/) with a suspend boolean of true to suspend this particular vendor the is_active field becomes false

this is the get request for this endpoint: https://dandelionz.net/api/user/admin/products/

this is the response gotten: {
"success": true,
"data": []
}
I don't know if there's a place in the admin that needs the endpoint tho

this next few ones should be for the vendor management I think:

post request to this endpoint: https://dandelionz.net/api/user/admin/users/suspend/

{
"user_uuid": "d5b5eb11-e7f6-47b9-bfb9-81a7df662fdc",
"suspend": true
}

this is the response gotten:
{
"success": true,
"suspended": true
}

when the same request is sent wwith a "suspend": false you get this response
{
"success": true,
"suspended": false
}
and the is_active field for the vendor becomes true again

I sent a post request to this endpoint: https://dandelionz.net/api/user/admin/vendors/approve/

{
"user_uuid": "d5b5eb11-e7f6-47b9-bfb9-81a7df662fdc",
"approve": true
}

I got this response:
{
"success": true,
"approved": true
}
then know that the is_verified_vendor field becomes true
changing the approve field: "approve": false does the opposite

made a post request to this endpoint: https://dandelionz.net/api/user/admin/vendors/verify-kyc/

{
"user_uuid": "d5b5eb11-e7f6-47b9-bfb9-81a7df662fdc"
}

the response gotten:

{
"success": true,
"message": "Vendor KYC verified"
}
this makes the "is_verified": true

made a request to this endpoint: https://dandelionz.net/api/user/customer/change-password/

{
"current_password": "string",
"new_password": "string"
}
this is for the CUSTOMER role

get request to this endpoint: https://dandelionz.net/api/user/customer/profile/

for the customer role with this response:
{
"user": {
"uuid": "1388c992-70bf-4149-8d7c-98850b0bfd23",
"email": "raymondomoyakhi@gmail.com",
"full_name": "Raymond Omoyakhi",
"phone_number": "08123456789",
"profile_picture": null,
"role": "CUSTOMER",
"referral_code": "9CE935C23489",
"is_verified": false,
"is_active": true,
"created_at": "2025-12-22T12:23:32.075229Z",
"updated_at": "2025-12-22T12:23:33.020018Z"
},
"shipping_address": "",
"city": "",
"country": "",
"postal_code": "",
"loyalty_points": 0
}

this is a put request to this endpoint: https://dandelionz.net/api/user/customer/profile/

{
"shipping_address": "string",
"city": "string",
"country": "string",
"postal_code": "string"
}

got this response:
{
"user": {
"uuid": "1388c992-70bf-4149-8d7c-98850b0bfd23",
"email": "raymondomoyakhi@gmail.com",
"full_name": "Raymond Omoyakhi",
"phone_number": "08123456789",
"profile_picture": null,
"role": "CUSTOMER",
"referral_code": "9CE935C23489",
"is_verified": false,
"is_active": true,
"created_at": "2025-12-22T12:23:32.075229Z",
"updated_at": "2025-12-22T12:23:33.020018Z"
},
"shipping_address": "string",
"city": "string",
"country": "string",
"postal_code": "string",
"loyalty_points": 0
}

then a patch request to this endpoint: https://dandelionz.net/api/user/customer/profile/

with similar fields to partially update the customer profile:
{
"shipping_address": "string",
"city": "string",
"country": "singapore"
}

the response gotten: {
"user": {
"uuid": "1388c992-70bf-4149-8d7c-98850b0bfd23",
"email": "raymondomoyakhi@gmail.com",
"full_name": "Raymond Omoyakhi",
"phone_number": "08123456789",
"profile_picture": null,
"role": "CUSTOMER",
"referral_code": "9CE935C23489",
"is_verified": false,
"is_active": true,
"created_at": "2025-12-22T12:23:32.075229Z",
"updated_at": "2025-12-22T12:23:33.020018Z"
},
"shipping_address": "string",
"city": "string",
"country": "singapore",
"postal_code": "string",
"loyalty_points": 0
}

this ones are similar but for the vendor: https://dandelionz.net/api/user/vendor/profile/

get request got this response: {
"success": true,
"data": {
"user": {
"uuid": "cd6ceccc-53bb-48cf-94bc-f27ecfe46858",
"email": "raymondyakhi@gmail.com",
"full_name": "Raymond Omoyakhi",
"phone_number": "08123456789",
"profile_picture": null,
"role": "VENDOR",
"referral_code": "DB8AE5BB3D3F",
"is_verified": false,
"is_active": true,
"created_at": "2025-12-22T12:21:46.907676Z",
"updated_at": "2025-12-22T12:21:47.853897Z"
},
"store_name": "Unnamed Store",
"store_description": "",
"business_registration_number": "",
"address": "",
"bank_name": "",
"account_number": "",
"recipient_code": "",
"is_verified_vendor": false
}
}, then a put request to the same endpoint with this as the request:
{
"user": {},
"store_name": "string",
"store_description": "string",
"business_registration_number": "string",
"address": "string",
"bank_name": "string",
"account_number": "string",
"recipient_code": "string"
}

then a patch request to the same endpoint with same fields but to partially update the fields

post request: https://dandelionz.net/api/user/vendor/change-password/
{
"current_password": "string",
"new_password": "string"
}

get request to this endpoint: https://dandelionz.net/api/user/vendor/analytics/
the response: {
"success": true,
"data": {
"total_revenue": 0,
"top_products": []
}
}

get request to this endpoint: https://dandelionz.net/api/user/vendor/notifications/
the response:
{
"success": true,
"data": []
}

get request to this endpoint: https://dandelionz.net/api/user/vendor/orders/
the response: {
"success": true,
"data": {
"pending": 0,
"paid": 0,
"shipped": 0,
"delivered": 0,
"canceled": 0
}
}

get request to this endpoint: https://dandelionz.net/api/user/vendor/products/
the response: {
"success": true,
"data": []
}

after adding products I got this response:
{
"success": true,
"data": [
{
"id": 1,
"store": 2,
"store_name": "Unnamed Store",
"name": "string",
"slug": "string",
"description": "string",
"category": "electronics",
"price": "600.00",
"stock": 2147483647,
"image": "image/upload/string",
"in_stock": true,
"created_at": "2025-12-22T13:10:31.095139Z",
"updated_at": "2025-12-22T13:10:31.095218Z",
"reviews": []
},
{
"id": 2,
"store": 2,
"store_name": "Unnamed Store",
"name": "Testing",
"slug": "testing",
"description": "Just a test product",
"category": "electronics",
"price": "700.00",
"stock": 2147483647,
"image": "image/upload/test.png",
"in_stock": true,
"created_at": "2025-12-22T13:23:53.404555Z",
"updated_at": "2025-12-22T13:23:53.404595Z",
"reviews": []
}
]
}

A post request to this endpoint: https://dandelionz.net/api/user/vendor/products/add/

{
"name": "string",
"description": "string",
"category": "electronics",
"price": "600",
"stock": 2147483647,
"image": "string"
}
this is the response gotten:
{
"success": true,
"data": {
"id": 1,
"name": "string",
"slug": "string",
"description": "string",
"category": "electronics",
"price": "600.00",
"stock": 2147483647,
"image": "image/upload/string",
"store": "Unnamed Store",
"created_at": "2025-12-22T13:10:31.095139Z",
"updated_at": "2025-12-22T13:10:31.095218Z"
}
}

added a new product again:
{
"name": "Testing",
"description": "Just a test product",
"category": "electronics",
"price": "700",
"stock": 2147483647,
"image": "test.png"
}
the response: {
"success": true,
"data": {
"id": 2,
"name": "Testing",
"slug": "testing",
"description": "Just a test product",
"category": "electronics",
"price": "700.00",
"stock": 2147483647,
"image": "image/upload/test.png",
"store": "Unnamed Store",
"created_at": "2025-12-22T13:23:53.404555Z",
"updated_at": "2025-12-22T13:23:53.404595Z"
}
}
