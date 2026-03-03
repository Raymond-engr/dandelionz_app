# PIN Input Standard Design Context

*Note: This standard applies to all PIN-related screens across all roles (Vendor, Admin, Customer), including Change PIN, Set PIN, Forgot PIN, and Withdrawal Confirmation.*

## Source
- **Figma Node**: [Change Payment Pin (307:1461)](https://www.figma.com/design/k6auG1yAuTBSf43CRCx9tF/Dandelionz--Copy-node-id=307-1461&m=dev)

## Visual Standards
### Typography
- **Page Title**: `Inter`, Semi-Bold, 24px, Centered, `#030482`.
- **Field Labels**: `Inter`, Regular, 14px, `#000011`.

### PIN Input Component
- **Structure**: A row of 4 individual boxes.
- **Box Dimensions**: `55px` x `55px`.
- **Styling**: `rounded-[8px]`, `border border-[#030482]`.
- **Spacing**: `20px` gap between boxes.
- **Alignment**: Left-aligned labels with 20px gaps between input boxes.

### Layout
- **Vertical Spacing**: ~16px gap between label and PIN boxes.
- **Button**: Use Global Primary Button (55px, rounded-12, bg-system-blue-light).

---

## 🛠️ Required Alignment Fixes
The following pages **MUST** be updated to adhere to this global standard:

### Admin Pages
- `app/admin/account/payment-settings/change-pin/page.tsx`
- `app/admin/account/payment-settings/forgot-pin/page.tsx`
- `app/admin/account/withdrawal/pin/page.tsx`

### Vendor Pages
- `app/vendor/account/payment-settings/change-pin/page.tsx`
- `app/vendor/account/payment-settings/forgot-pin/page.tsx`
- `app/vendor/wallet/withdraw/confirm-pin/page.tsx`

**Key Fixes**:
1.  **Title**: Set to `text-[24px] font-semibold text-center text-system-blue-light`.
2.  **Input Boxes**: Ensure each box is exactly `55x55px` with a `rounded-[8px]` border.
3.  **Spacing**: Set gaps between input boxes to `20px`.
4.  **Button**: Standardize to `h-[55px] rounded-[12px]`.
