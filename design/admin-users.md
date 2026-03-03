# Admin User Management Design Context

## Source
- **Figma Node**: [Manage Users (361:1076)](https://www.figma.com/design/k6auG1yAuTBSf43CRCx9tF/Dandelionz--Copy-?node-id=361-1076&m=dev)

## Visual Standards
### Dashboard Components
- **Total Users Card**: `bg-white h-[101px] rounded-[12px]`. (Note: Unlike Vendor/Product, this card is white with `#030482` text in node 361:1094).
- **Status Cards**: 
  - Active: `bg-[rgba(77,255,151,0.25)] text-[#207d47]`.
  - Suspended: `bg-[rgba(255,77,77,0.25)] text-[#760303]`.
- **Grid Background**: The area behind the "Total Users" card uses an 11px `#F5F7FA` divider/background block.

### Typography
- **Page Title**: `Inter`, Semi-Bold, 24px, `#000011`.
- **List Labels**: `Inter`, Regular, 16px (Name), 13px (Email).

---

## 🛠️ Required Alignment Fixes
Apply these changes to `app/admin/users/page.tsx` to achieve pixel-perfection:

1.  **Dashboard Layout**:
    *   Center the "Users" title at `text-[24px]`.
    *   Update "Total Users" card to be white with blue text: `bg-white text-system-blue-light border-0`.
    *   Update "Active" and "Suspended" cards to use the 95px height and exact rgba colors.
2.  **List Items**:
    *   Add 11px `#F5F7FA` dividers between each user in the list.
    *   Position the "Status" pill on the far right, matching the 29px height spec.
