# Gemini Added Memories

- Figma MCP URL: https://mcp.figma.com/mcp
- The project uses Next.js 16+. Params in page components are Promises and must be unwrapped using `React.use()` or `await`.
- The user always wants explanations first before any code changes are applied.
- For every new task, error fix, or feature request, I must first read the relevant files, then ask any necessary clarifying questions, and finally present a plan before taking any actions.
- Always generate commit messages at the end of a task.
- Always create a todo list for tasks after formulating a plan and keep it updated when adjustments are made.
- For tasks involving complex refactoring, codebase exploration, or system-wide analysis, the `codebase_investigator` tool should be the first and primary tool used to build a comprehensive understanding.

## April 8, 2026 - Checkout Flow Alignment (Web & Mobile)
- Synchronized checkout flow across web and mobile: Cart -> Frequency -> Shipping -> Payment/Installment.
- Fixed an issue where the shipping address step was skipped in the installment flow.
- Added address validation to the Shipping step to ensure users provide a delivery address before proceeding.
- Aligned progress indicator steps, button labels, and frequency options with the updated flow.

## June 22, 2026 - Remove Bank Account Editing from Vendor Profile
- Removed the bank name and account number fields from the Vendor Profile page to prevent editing of bank details from the profile section.

## June 25, 2026 - Remove Misleading Eye Icon from Profile Pages
- Removed the `showPassword` state and the eye icon button (`visibility` / `visibility-off`) from the "fake" disabled password fields in `app/(customer)/account/profile/page.tsx` and `app/admin/account/profile/page.tsx`.
- This ensures users are not misled into thinking they can view their current password, since the field's value is securely hardcoded to "••••••••".
- Always generate commit messages at the end of a task and append this instruction to the project's GEMINI.md file.

## June 26, 2026 - Notification & Admin Order Fixes
- Fixed a navigation error where clicking system notifications resulted in a 404 page by adding an \isSystemNotification\ utility and removing the anchor tags/links for them.
- Disabled manual processing/completing of orders for admins if the payment status is still 'pending' to avoid manual force overrides.
- Verified that 'Save as Draft' for Admin Notifications works end-to-end (backend stores \is_draft=True\, frontend correctly sends it).

## June 26, 2026 - Customer Order Cancellation & Refund Flow
- Added 'Cancel Order' button to order tracking UI for both Mobile and Web.
- Connected cancellation requests to the backend cancel-order endpoint, which cancels pending/paid orders and generates Refund records for paid orders.
- Created disputes.tsx and efunds/page.tsx for Admins in Mobile and Web to list, approve, and reject refund requests.
- Added useGetAdminRefundsQuery and useProcessAdminRefundMutation in dminApi.ts for Admin platforms.
- Linked the 'Manage Refund Request' button on the Admin Order Details page when a cancelled order requires a refund.
- Configured notifications via send_user_notification to alert customers and vendors on cancellation, and customers upon refund approval/rejection.

## June 27, 2026 - Fix Build Errors
- Exported missing hooks useGetAdminRefundsQuery and useProcessAdminRefundMutation from dminApi.ts.
- Added missing efund_request property to Order interface in dminApi.ts.
- Fixed possibly undefined order.order_id in pp/admin/orders/[id]/page.tsx.
- Added missing Refunds tag type to aseApi.ts to fix RTK Query type error.

## July 10, 2026 - Admin Product Status Formatting Fix
- Updated backend AdminProductListSerializer and AdminProductDetailSerializer to compute and return a dedicated `status` field mapped to 'APPROVED', 'REJECTED', 'PENDING', or 'DRAFT' based on approval and publish status.
- Standardized web app admin products dashboard to filter count badges by uppercase status strings instead of Title Case.

## July 10, 2026 - Admin Drafts Management
- Fixed a backend permission issue in VendorDraftProductsView, UpdateDraftProductView, and DeleteDraftProductView to allow Admins to manage drafts using IsAdminOrVendor.
- Added Draft Products section to the Web Admin products page for viewing, editing, submitting, and deleting drafts.
- Integrated Drafts tab and rendering logic into Mobile Admin products page.

## July 12, 2026 - Admin Order Processing Restriction
- Updated the condition for processing and completing orders in the Admin panel to strictly require the payment status to be 'PAID', replacing the previous 'not pending' check to prevent failed payments from being processed.

## July 12, 2026 - Admin Dynamic Order Actions
- Updated the 'Process Order' action to set the order status to 'SHIPPED' instead of 'PROCESSING'.
- Conditionally filtered available admin actions based on the order's current status (e.g., hiding all actions for 'DELIVERED' or 'CANCELED' orders, and hiding 'Process Order' for 'SHIPPED' orders).

## July 12, 2026 - Admin Product Search Implementation
- Integrated the existing 'SearchBar' component into the web Admin Products page.
- Implemented fast, client-side filtering for Categories, Products, and Drafts without modifying any backend queries, ensuring parity with the mobile app.
