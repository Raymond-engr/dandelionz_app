# Vendor Homepage Design Context

## Source
- **Figma Node**: [Vendor Dashboard (290:95)](https://www.figma.com/design/k6auG1yAuTBSf43CRCx9tF/Dandelionz--Copy-node-id=290-95&m=dev)

## Visual Standards
### Typography
- **Header Greeting**: `Inter`, Medium, 20px, `rgba(0,0,17,0.5)`.
- **Header Username**: `Inter`, Semi-Bold, 24px, `#000011`.
- **Card Titles**: `Inter`, Regular, 16px, `#000011`.
- **Card Values**: `Inter`, Semi-Bold, 20px, `#000011`.
- **Section Titles (Recent Orders)**: `Inter`, Semi-Bold, 16px, `#000011`.

### Layout & Components
- **Header**: Avatar is 41x41px aligned to the right. The notification bell is standard.
- **Stats Grid**:
  - 2x2 Grid.
  - The cards themselves are `bg-white h-[95px] rounded-[12px]` and do **not** have borders in the primary design language.
  - Each card contains an accent icon container (`size-[29px] rounded-[6px]`).
  - Colors for percentage change vary (e.g., `text-[#4dff97]` for positive).
- **Recent Orders**: Follows the standard Order List Item formatting found in `design/vendor-order.md`.

---

## 🛠️ Required Alignment Fixes
Apply these changes to `app/vendor/page.tsx` to achieve pixel-perfection:

1.  **Header**:
    *   Update "Welcome back," to `text-[20px] font-medium text-[rgba(0,0,17,0.5)]`.
    *   Update the Vendor Name to `text-[24px] font-semibold text-system-blue-dark`.
    *   Ensure the Avatar is exactly `41x41px`.
    *   Remove `border-b border-gray-100` from the header container.
2.  **Stats Cards**:
    *   Remove `border border-gray-200` from the stat cards to match the flat design language.
    *   Set card height to `h-[95px] rounded-[12px]`.
    *   Update titles to `text-[16px] font-normal`.
    *   Update values to `text-[20px] font-semibold`.
    *   Integrate the specific 29x29px colored accent squares for the icons.
3.  **Recent Orders**:
    *   Update title to `text-[16px] font-semibold`.
