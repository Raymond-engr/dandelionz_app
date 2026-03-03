# Vendor Order Page Design Context

## Source
- **Figma Node**: [Vendor Order (297:408)](https://www.figma.com/design/k6auG1yAuTBSf43CRCx9tF/Dandelionz--Copy-node-id=297-408&m=dev)

## Visual Standards
### Typography
- **Page Title**: `Inter`, Semi-Bold, 24px, `#000011`.
- **Page Subtitle**: `Inter`, Regular, 16px, `#000011`.
- **Section Headers** (e.g., "All Orders"): `Inter`, Semi-Bold, 16px, `#000011`.
- **Card Titles**: `Inter`, Regular, 16px, `#000011`.
- **Card Values**: `Inter`, Semi-Bold, 20px, `#000011`.

### Colors & Grid Layout
The Stats section is displayed over a light gray background (`#F5F7FA`) with `bg-white` cards `rounded-[12px]`. Each card has a specific 29x29px rounded square icon/accent color:
- **Total Orders**: Accent `bg-[rgba(3,4,130,0.25)]` (Blue)
- **Pending**: Accent `bg-[rgba(255,212,59,0.25)]` (Yellow)
- **Completed**: Accent `bg-[rgba(77,255,151,0.25)]` (Green)
- **Revenue**: Accent `bg-[rgba(151,71,255,0.25)]` (Purple)

### List Items (All Orders)
- **Avatar**: `41x41px` circular image.
- **Customer Info**: Name (`16px Regular`), Email (`13px Regular`).
- **Order ID/Date**: "Order ID" is `16px Semi-Bold text-system-blue-light`, while the Date/ID is `16px Regular`.
- **Status Pills**:
  - *Shipped*: `bg-[rgba(3,4,130,0.25)] text-system-blue-light`
  - *New*: `bg-[rgba(255,212,59,0.25)] text-[#5d4a07]`

---

## 🛠️ Required Alignment Fixes
Apply these changes to `app/vendor/orders/page.tsx` to achieve pixel-perfection:

1.  **Header**:
    *   Update Title to `text-[24px] font-semibold text-system-blue-dark`.
    *   Update Subtitle to `text-[16px] font-normal text-system-blue-dark`.
    *   Remove bottom borders.
2.  **Stats Grid**:
    *   Wrap the grid in a full-width background container colored `#F5F7FA`.
    *   Change the cards to white backgrounds (`bg-white rounded-[12px] h-[95px]`).
    *   Implement the specific accent squares (`29x29px rounded-[6px]`) with the rgba colors listed above.
    *   Ensure the stats use `text-[16px]` for titles and `text-[20px]` for values.
3.  **Order List Items**:
    *   Update "All Orders" title to `text-[16px] font-semibold`.
    *   Match the Figma layout for the list items: Place the Avatar on the left, Name/Email stacked next to it.
    *   Place the Status Pill and the Amount stacked on the right side.
    *   Below the main row, place "Order ID" in blue and the Order Date/ID aligned right.
