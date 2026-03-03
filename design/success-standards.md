# Success Page Standard Design Context

*Note: This standard applies to all success/confirmation screens across all roles, including Registration Success, Checkout Success, and PIN Change Success.*

## Source
- **Figma Node**: [Successful Pin Change (307:1646)](https://www.figma.com/design/k6auG1yAuTBSf43CRCx9tF/Dandelionz--Copy-?node-id=307-1646&m=dev)

## Visual Standards
### Colors
- **Icon/Title/Button**: `#030482` (system-blue-light)
- **Message Text**: `#030482` (system-blue-light)
- **Divider**: `#F5F7FA`

### Typography
- **Page Title**: `Inter`, Semi-Bold, 24px, Centered, `#030482` (e.g., "Confirmation").
- **Success Message**: `Inter`, Semi-Bold, 24px, Centered, `#030482`. (Note: Figma specifically uses 24px for the main confirmation message text).

### Layout & Components
- **Success Icon**:
  - Centered circular container: `size-[197px] rounded-full bg-[#030482]`.
  - Inner checkmark: `size-[126px]` centered inside.
- **Divider**: A standard 11px `#F5F7FA` divider positioned above the action button at `top: 682px`.
- **Action Button**: Standard Global Primary Button (55px, rounded-12, bg-system-blue-light), e.g., "Go Home".

---

## 🛠️ Required Alignment Fixes
The following pages **MUST** be updated to adhere to this global standard:

### Auth & Customer Pages
- `app/(auth)/registration-success/page.tsx`
- `app/(customer)/checkout/success/page.tsx`

### Admin & Vendor Pages
- `app/admin/account/withdrawal/success/page.tsx`
- `app/vendor/wallet/success/page.tsx`

**Key Fixes**:
1.  **Header**: Standardize title to `text-[24px] font-semibold text-center text-system-blue-light`.
2.  **Icon**: Implement the large blue circle (`size-[197px]`) with white checkmark.
3.  **Message**: Update main message to `text-[24px] font-semibold text-center text-system-blue-light`.
4.  **Divider**: Add the `<div className="h-[11px] bg-[#F5F7FA] w-full" />` strip above the button.
5.  **Button**: Update to the standard `h-[55px] rounded-[12px]` style.
