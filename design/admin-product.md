# Admin Product Management Design Context

## Source
- **Figma Node**: [Manage Products (361:926)](https://www.figma.com/design/k6auG1yAuTBSf43CRCx9tF/Dandelionz--Copy-?node-id=361-926&m=dev)

## Visual Standards
### Typography
- **Page Title**: `Inter`, Semi-Bold, 24px, `#000011`.
- **Tabs**: `Inter`, Medium, 20px. Active: `#030482` with a 5px underlined indicator. Inactive: `rgba(3,4,130,0.5)`.
- **Product Details**: Name (`16px Regular`), Vendor/Category (`13.7px Regular`).

### Dashboard Components
- **Total Products Card**: `bg-[#030482] h-[101px] rounded-[12px]`.
- **Status Grid**: 
  - Approved: `bg-[rgba(77,255,151,0.25)] text-[#207d47]`.
  - Rejected: `bg-[rgba(255,77,77,0.25)] text-[#760303]`.
  - Pending: Full-width card below others, `bg-[rgba(255,212,59,0.5)] text-[#5d4a07]`.

---

## 🛠️ Required Alignment Fixes
Apply these changes to `app/admin/product/page.tsx` to achieve pixel-perfection:

1.  **Tabs Styling**:
    *   Update tab text to `text-[20px] font-medium`.
    *   For the active tab, use a 5px thick blue line (`h-[5px] bg-system-blue-light`).
2.  **Stats Cards**:
    *   Match the specific 3-card layout: Total (Blue), then Approved/Rejected (Side-by-side), then Pending (Full-width below).
    *   Use the exact rgba colors specified above.
3.  **Product List**:
    *   Add 11px `#F5F7FA` dividers between items.
    *   Style the product image placeholder/container as `size-[79px] bg-[#F5F7FA] rounded-[8px]`.
    *   Ensure the Naira icon matches the 12x11px Figma spec.
