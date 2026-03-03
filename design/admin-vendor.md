# Admin Vendor Management Design Context

## Source
- **Figma Node**: [Manage Vendor (361:278)](https://www.figma.com/design/k6auG1yAuTBSf43CRCx9tF/Dandelionz--Copy-?node-id=361-278&m=dev)

## Visual Standards
### Colors & Components
- **Top Card**: `bg-[#030482] h-[101px] rounded-[12px]`. Contains white text and a 38px store icon.
- **Status Cards**: 
  - Active: `bg-[rgba(77,255,151,0.25)] text-[#207d47]`.
  - Suspended: `bg-[rgba(255,77,77,0.25)] text-[#760303]`.
- **List Dividers**: 11px `#F5F7FA` strips between items.

### Typography
- **Page Title**: `Inter`, Semi-Bold, 24px, `#000011`.
- **Subtitle**: `Inter`, Regular, 16px, `#000011`.
- **Section Heading**: `Inter`, Semi-Bold, 16px, `#000011`.

---

## 🛠️ Required Alignment Fixes
Apply these changes to `app/admin/vendor/page.tsx` to achieve pixel-perfection:

1.  **Header**:
    *   Change Title to `text-[24px] font-semibold text-system-blue-dark`.
    *   Change Subtitle to `text-[16px] font-normal text-system-blue-dark`.
2.  **Dashboard Layout**:
    *   Implement the full-width blue card for "Total Vendors" at `h-[101px]`.
    *   Update the "Active" and "Suspended" cards to use the exact specified rgba colors and text colors.
3.  **List Items**:
    *   Add an 11px divider after the "All Vendors" heading and between each vendor item.
    *   Ensure Vendor name is `text-[16px]` and email is `text-[13px]`.
    *   Update status pills to match the 29px height rounded style.
