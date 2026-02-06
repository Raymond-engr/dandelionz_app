sorry bro. it's not api/notifications it:

GET
/user/notifications/


POST
/user/notifications/


POST
/user/notifications/bulk_delete/


POST
/user/notifications/mark_all_as_read/


POST
/user/notifications/mark_as_read/


GET
/user/notifications/preferences/


POST
/user/notifications/preferences/disable_dnd/


POST
/user/notifications/preferences/disable_quiet_hours/


POST
/user/notifications/preferences/enable_dnd/


POST
/user/notifications/preferences/enable_quiet_hours/


PUT
/user/notifications/preferences/{id}/


GET
/user/notifications/stats/


GET
/user/notifications/types/


GET
/user/notifications/types/{id}/


GET
/user/notifications/unread_count/


GET
/user/notifications/{id}/


PUT
/user/notifications/{id}/


PATCH
/user/notifications/{id}/


DELETE
/user/notifications/{id}/


POST
/user/notifications/{id}/archive/


POST
/user/notifications/{id}/unarchive/

Testing Recommendations - Complete Request/Response Examples
13.1 List Notifications
Request:

curl -X GET \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  "http://api.dandelionz.com.ng/user/notifications/?page=1&page_size=20"
Response (200 OK):

{
  "count": 45,
  "next": "http://api.dandelionz.com.ng/user/notifications/?page=2&page_size=20",
  "previous": null,
  "results": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Order Confirmed",
      "message": "Your order #ORD-123456 has been confirmed",
      "priority": "normal",
      "category": "order",
      "is_read": false,
      "is_archived": false,
      "created_at": "2026-02-05T10:30:00Z",
      "read_at": null,
      "notification_type_display": "Order Updated",
      "notification_type_icon": "📦",
      "notification_type_color": "#FF5733",
      "action_url": "/orders/ORD-123456/",
      "action_text": "View Order"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "title": "Payment Received",
      "message": "We received your payment of $50.00",
      "priority": "high",
      "category": "payment",
      "is_read": true,
      "is_archived": false,
      "created_at": "2026-02-04T15:45:00Z",
      "read_at": "2026-02-04T16:00:00Z",
      "notification_type_display": "Payment Received",
      "notification_type_icon": "💰",
      "notification_type_color": "#28a745",
      "action_url": "/receipts/RCP-123456/",
      "action_text": "View Receipt"
    }
  ]
}
13.2 Get Single Notification
Request:

curl -X GET \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  "http://api.dandelionz.com.ng/user/notifications/550e8400-e29b-41d4-a716-446655440000/"
Response (200 OK):

{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user": "550e8400-e29b-41d4-a716-446655440099",
  "user_email": "john.doe@example.com",
  "notification_type": {
    "id": "550e8400-e29b-41d4-a716-446655440100",
    "name": "order_update",
    "display_name": "Order Updated",
    "description": "Notification for order status changes",
    "icon": "📦",
    "color": "#FF5733",
    "is_active": true
  },
  "title": "Order Confirmed",
  "message": "Your order #ORD-123456 has been confirmed",
  "description": "Your order containing 3 items has been confirmed and is being prepared for shipment.",
  "priority": "normal",
  "category": "order",
  "action_url": "https://yoursite.com/orders/ORD-123456/",
  "action_text": "View Order",
  "is_read": false,
  "is_archived": false,
  "is_deleted": false,
  "metadata": {
    "order_id": "ORD-123456",
    "order_total": "150.00",
    "items_count": 3,
    "estimated_delivery": "2026-02-10"
  },
  "related_object_type": "order",
  "related_object_id": "ORD-123456",
  "was_sent_websocket": true,
  "was_sent_email": true,
  "was_sent_push": false,
  "created_at": "2026-02-05T10:30:00Z",
  "read_at": null,
  "expires_at": "2026-05-05T10:30:00Z",
  "updated_at": "2026-02-05T10:30:00Z"
}
13.3 Get Unread Count
Request:

curl -X GET \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  "http://api.dandelionz.com.ng/user/notifications/unread_count/"
Response (200 OK):

{
  "unread_count": 5,
  "status": "success"
}
13.4 Mark Single Notification as Read
Request:

curl -X POST \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "notification_id": "550e8400-e29b-41d4-a716-446655440000"
  }' \
  "http://api.dandelionz.com.ng/user/notifications/mark_as_read/"
Response (200 OK):

{
  "status": "success",
  "message": "Notification marked as read"
}
Response (404 Not Found):

{
  "error": "Notification not found"
}
13.5 Mark All Notifications as Read
Request:

curl -X POST \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  "http://api.dandelionz.com.ng/user/notifications/mark_all_as_read/"
Response (200 OK):

{
  "status": "success",
  "message": "5 notifications marked as read",
  "count": 5
}
13.6 Get Notification Statistics
Request:

curl -X GET \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  "http://api.dandelionz.com.ng/user/notifications/stats/"
Response (200 OK):

{
  "total_notifications": 45,
  "unread_count": 5,
  "read_count": 40,
  "archived_count": 8,
  "by_category": {
    "order": 25,
    "payment": 12,
    "vendor_approval": 5,
    "promotion": 3
  },
  "by_priority": {
    "urgent": 2,
    "high": 8,
    "normal": 30,
    "low": 5
  },
  "last_notification_time": "2026-02-05T10:30:00Z"
}
13.7 Archive Notification
Request:

curl -X POST \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  "http://api.dandelionz.com.ng/user/notifications/550e8400-e29b-41d4-a716-446655440000/archive/"
Response (200 OK):

{
  "status": "success",
  "message": "Notification archived"
}
13.8 Unarchive Notification
Request:

curl -X POST \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  "http://api.dandelionz.com.ng/user/notifications/550e8400-e29b-41d4-a716-446655440000/unarchive/"
Response (200 OK):

{
  "status": "success",
  "message": "Notification unarchived"
}
13.9 Delete Single Notification
Request:

curl -X DELETE \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  "http://api.dandelionz.com.ng/user/notifications/550e8400-e29b-41d4-a716-446655440000/"
Response (204 No Content):

(Empty response body)
13.10 Bulk Delete Notifications
Request:

curl -X POST \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "notification_ids": [
      "550e8400-e29b-41d4-a716-446655440000",
      "550e8400-e29b-41d4-a716-446655440001",
      "550e8400-e29b-41d4-a716-446655440002"
    ]
  }' \
  "http://api.dandelionz.com.ng/user/notifications/bulk_delete/"
Response (200 OK):

{
  "status": "success",
  "message": "3 notifications deleted",
  "count": 3
}
13.11 Get Notification Types
Request:

curl -X GET \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  "http://api.dandelionz.com.ng/user/notifications/types/"
Response (200 OK):

{
  "count": 6,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440100",
      "name": "order_update",
      "display_name": "Order Updated",
      "description": "Notification for order status changes",
      "icon": "📦",
      "color": "#FF5733",
      "is_active": true
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440101",
      "name": "payment_received",
      "display_name": "Payment Received",
      "description": "Notification for payment transactions",
      "icon": "💰",
      "color": "#28a745",
      "is_active": true
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440102",
      "name": "vendor_approval",
      "display_name": "Vendor Approval",
      "description": "Notification for vendor account approvals",
      "icon": "✅",
      "color": "#007bff",
      "is_active": true
    }
  ]
}
13.12 Get User Notification Preferences
Request:

curl -X GET \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  "http://api.dandelionz.com.ng/user/notifications/preferences/"
Response (200 OK):

{
  "id": "550e8400-e29b-41d4-a716-446655440150",
  "user": "550e8400-e29b-41d4-a716-446655440099",
  "websocket_enabled": true,
  "email_enabled": true,
  "push_enabled": false,
  "email_frequency": "daily",
  "push_frequency": "instant",
  "enabled_categories": ["order", "payment", "vendor_approval"],
  "disabled_categories": ["promotion", "announcement"],
  "quiet_hours_enabled": true,
  "quiet_hours_start": "22:00:00",
  "quiet_hours_end": "08:00:00",
  "do_not_disturb_enabled": false,
  "do_not_disturb_until": null
}
13.13 Update User Notification Preferences
Request:

curl -X PUT \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "email_enabled": false,
    "push_enabled": true,
    "email_frequency": "weekly",
    "enabled_categories": ["order", "payment"],
    "disabled_categories": ["promotion", "announcement", "vendor_approval"]
  }' \
  "http://api.dandelionz.com.ng/user/notifications/preferences/"
Response (200 OK):

{
  "status": "success",
  "message": "Preferences updated",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440150",
    "user": "550e8400-e29b-41d4-a716-446655440099",
    "websocket_enabled": true,
    "email_enabled": false,
    "push_enabled": true,
    "email_frequency": "weekly",
    "push_frequency": "instant",
    "enabled_categories": ["order", "payment"],
    "disabled_categories": ["promotion", "announcement", "vendor_approval"],
    "quiet_hours_enabled": true,
    "quiet_hours_start": "22:00:00",
    "quiet_hours_end": "08:00:00",
    "do_not_disturb_enabled": false,
    "do_not_disturb_until": null
  }
}
13.14 Enable Quiet Hours
Request:

curl -X POST \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "start_time": "22:00:00",
    "end_time": "08:00:00"
  }' \
  "http://api.dandelionz.com.ng/user/notifications/preferences/enable-quiet-hours/"
Response (200 OK):

{
  "status": "success",
  "message": "Quiet hours enabled"
}
Response (400 Bad Request):

{
  "error": "start_time and end_time are required"
}
13.15 Disable Quiet Hours
Request:

curl -X POST \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  "http://api.dandelionz.com.ng/user/notifications/preferences/disable-quiet-hours/"
Response (200 OK):

{
  "status": "success",
  "message": "Quiet hours disabled"
}
13.16 Enable Do Not Disturb
Request:

curl -X POST \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "duration_minutes": 120
  }' \
  "http://api.dandelionz.com.ng/user/notifications/preferences/enable-dnd/"
Response (200 OK):

{
  "status": "success",
  "message": "Do not disturb enabled",
  "until": "2026-02-05T12:30:00Z"
}
13.17 Disable Do Not Disturb
Request:

curl -X POST \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  "http://api.dandelionz.com.ng/user/notifications/preferences/disable-dnd/"
Response (200 OK):

{
  "status": "success",
  "message": "Do not disturb disabled"
}
13.18 WebSocket Connection Example
Connection (JavaScript):

const ws = new WebSocket('ws://localhost:8000/ws/notifications/');

ws.onopen = (event) => {
  console.log('Connected to notification service');
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};

// Send ping to test connection
ws.send(JSON.stringify({ type: 'ping' }));

// Mark notification as read
ws.send(JSON.stringify({
  type: 'mark_as_read',
  notification_id: '550e8400-e29b-41d4-a716-446655440000'
}));

// Fetch unread notifications
ws.send(JSON.stringify({
  type: 'fetch_unread',
  limit: 20
}));
WebSocket Response (Real-time notification):

{
  "type": "notification",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Order Confirmed",
    "message": "Your order #ORD-123456 has been confirmed",
    "priority": "normal",
    "category": "order",
    "action_url": "/orders/ORD-123456/",
    "action_text": "View Order",
    "is_read": false,
    "metadata": {
      "order_id": "ORD-123456",
      "order_total": "150.00"
    },
    "created_at": "2026-02-05T10:30:00Z",
    "notification_type": {
      "name": "order_update",
      "display_name": "Order Updated",
      "icon": "📦",
      "color": "#FF5733"
    }
  },
  "timestamp": "2026-02-05T10:30:00.123456Z"
}
WebSocket Response (Unread notifications fetch):

{
  "type": "unread_notifications",
  "count": 5,
  "notifications": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Order Confirmed",
      "message": "Your order #ORD-123456 has been confirmed",
      "priority": "normal",
      "category": "order",
      "created_at": "2026-02-05T10:30:00Z",
      "action_url": "/orders/ORD-123456/",
      "action_text": "View Order"
    }
  ]
}
13.19 Error Response Examples
401 Unauthorized (Missing auth token):

{
  "detail": "Authentication credentials were not provided."
}
403 Forbidden (Accessing other user's notification):

{
  "detail": "You do not have permission to perform this action."
}
400 Bad Request (Validation error):

{
  "error": "notification_id is required"
}
500 Internal Server Error:

{
  "error": "Failed to get preferences"
}