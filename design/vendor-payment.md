# Vendor Payment Settings Design Context

## Source
- **Figma Node**: [Vendor Payment Settings (307:1410)](https://www.figma.com/design/k6auG1yAuTBSf43CRCx9tF/Dandelionz--Copy-node-id=307-1410&m=dev)

## Visual Standards
### Colors
- **Page Title**: `#030482` (system-blue-light)
- **Text (Labels)**: `#000011` (system-blue-dark)
- **Dividers**: `#F5F7FA` (11px height strips)
- **Background**: `#FFFFFF`

### Typography
- **Page Title**: `Inter`, Semi-Bold, 24px, Centered, `#030482`.
- **Section Titles**: `Inter`, Semi-Bold, 20px, `#000011`.
- **List Item Labels**: `Inter`, Regular, 16px, `#000011`.

### Layout & Components
- **Dividers**: 11px height blocks of `#F5F7FA` are used to separate:
  - Header from the first section title.
  - Individual links within a section.
  - One section from another.
- **List Items**:
  - Horizontal padding: `px-[20px]`.
  - Simple right-pointing chevron.

---

## 🛠️ Required Alignment Fixes
Apply these changes to `app/vendor/account/payment-settings/page.tsx` to achieve pixel-perfection:

1.  **Header**:
    *   Center the title and set font size to `text-[24px] font-semibold text-system-blue-light`.
    *   Remove `border-b border-gray-200`.
2.  **Dividers (New Pattern)**:
    *   Add `<div className="h-[11px] bg-[#F5F7FA] w-full" />` after the header and between every single list item and section title as seen in Figma.
3.  **Section Titles**:
    *   Update "Payment PIN" and "Withdrawal Details" to `text-[20px] font-semibold text-system-blue-dark ml-[21px] mt-4`.
4.  **List Items**:
    *   Update labels to `text-[16px] font-normal text-system-blue-dark`.
    *   Ensure horizontal padding is `px-[20px]`.
5.  **Navigation**:
    *   Ensure the back button is the simple 10x16px chevron.
