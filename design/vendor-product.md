# Vendor Product Management Design Context

## Source
- **Figma Node**: [Vendor Product (293:305)](https://www.figma.com/design/k6auG1yAuTBSf43CRCx9tF/Dandelionz--Copy-node-id=293-305&m=dev)

## Visual Standards
### Typography
- **Page Title**: `Inter`, Semi-Bold, 24px, `#000011`.
- **Subtitle**: `Inter`, Regular, 16px, `#000011`.
- **Large Action Card**: `Inter`, Semi-Bold, 24px, `#030482`.

### Layout & Components
- **Add New Product Card**:
  - `bg-[#F5F7FA] h-[101px] rounded-[12px] flex items-center justify-center gap-[62px]`.
  - Icon: Large plus icon (`size-[45px]`).
  - Text: "Add New Product" in 24px Semi-Bold.
- **Navigation**: Uses the 81px bottom navigation bar with the "Product" active state.

---

## 🛠️ Required Alignment Fixes
Apply these changes to `app/vendor/product/page.tsx` to achieve pixel-perfection:

1.  **Header**:
    *   Change Title to `text-[24px] font-semibold text-system-blue-dark`.
    *   Change Subtitle to `text-[16px] font-normal text-system-blue-dark`.
    *   Remove `border-b border-gray-200`.
2.  **Add Product Action (Major UI Change)**:
    *   Transform the current `<Link>` button into a large action card.
    *   Classes: `bg-[#F5F7FA] h-[101px] rounded-[12px] flex items-center justify-center gap-[62px] mt-[156px]`.
    *   Icon: Increase plus icon size to `size-[45px]`.
    *   Text: Change to `text-[24px] font-semibold text-[#030482]`.
3.  **Page Flow**:
    *   Ensure the "Add New Product" card is positioned precisely as per the Figma `top-[156px]` spec relative to the layout.
