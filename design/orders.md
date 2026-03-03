# Orders Page Design Context

## Source
- **Figma Node**: [Order Page (241:171)](https://www.figma.com/design/k6auG1yAuTBSf43CRCx9tF/Dandelionz--Copy-node-id=241-171&m=dev)

## Visual Standards
### Colors
- **Page Title**: `#000011` (system-blue-dark)
- **Active Tab Background**: `#030482` (system-blue-light)
- **Inactive Tab Background**: `#F5F7FA`
- **Background**: `#FFFFFF`

### Typography
- **Page Title**: `Inter`, Semi-Bold, 24px, Centered, `#000011`.
- **Tab Labels**: `Inter`, Semi-Bold, 16px.
- **Empty State Text**: `Inter`, Medium, 20px, Centered, `#000011`.

### Layout & Components
- **Tabs (Pill Navigation)**:
  - Height: `41px` (`h-[41px]`).
  - Width: `120px` (`w-[120px]`).
  - Border Radius: `50px` (`rounded-[50px]`).
  - Active: `bg-[#030482]` with white text.
  - Inactive: `bg-[#F5F7FA]` with `#030482` text. **No border.**
- **Empty State Button**:
  - Uses the Global Button Standard: `h-[55px] rounded-[12px] bg-[#030482] text-white text-[16px] font-semibold`.

---

## 🛠️ Required Alignment Fixes
Apply these changes to `app/(customer)/orders/page.tsx` to achieve pixel-perfection:

1.  **Header & Title**:
    *   Change the title font to `text-[24px] font-semibold text-system-blue-dark`.
    *   Remove the `border-b border-gray-200` from the header div to maintain a cleaner flat look.
2.  **Tabs Styling**:
    *   Update the tab buttons to match the exact specs: `h-[41px] w-[120px] rounded-[50px] px-[18px] py-[9px] text-[16px] font-semibold`.
    *   For inactive tabs, change `bg-white text-system-blue-light border border-system-blue-light` to `bg-[#F5F7FA] text-system-blue-light`. Remove the border entirely.
3.  **Empty State**:
    *   Change the "Nothing to see here" text to `text-[20px] font-medium text-system-blue-dark`.
    *   Update the "Start Shopping" button to `h-[55px] rounded-[12px] text-[16px] font-semibold`.
