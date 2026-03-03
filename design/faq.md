# FAQ Page Design Context

## Source
- **Figma Node**: [FAQ (63:90)](https://www.figma.com/design/k6auG1yAuTBSf43CRCx9tF/Dandelionz--Copy-?node-id=63-90&m=dev)

## Visual Standards
### Colors
- **Page Title**: `#030482` (system-blue-light)
- **Text (Questions)**: `#000011` (system-blue-dark)
- **Dividers**: `#F5F7FA`
- **Icon Background**: `#F5F7FA` (approximate)

### Typography
- **Page Title**: `Inter`, Semi-Bold, 24px, Centered, `#030482`.
- **Questions**: `Inter`, Semi-Bold, 16px, `#000011`.
- **Answers**: `Inter`, Regular, 16px, `#000011`.

### Layout & Components
- **Accordion Style**: The Figma design **does not use borders** around the FAQ items. Instead, it relies on the 11px `#F5F7FA` horizontal dividers between each question to separate them.
- **Toggle Icon**: A prominent 40x40px circular button containing a plus (+) icon when collapsed, and presumably a cross (x) when expanded.

## Project-Specific Implementation Notes
- **State Logic**: Retain the existing `useState` and `openIndex` logic for toggling the FAQ answers.

---

## 🛠️ Required Alignment Fixes
Apply these changes to `app/(customer)/faqs/page.tsx` to achieve pixel-perfection:

1.  **Header**:
    *   Center the "FAQ" title.
    *   Change the title font to `text-[24px] font-semibold text-system-blue-light`.
2.  **Accordion Structure (Remove Borders)**:
    *   Remove `border border-gray-200 rounded-lg mb-4` from the FAQ item container.
    *   Instead, place `<div className="h-[11px] bg-[#F5F7FA] w-full" />` at the bottom of each mapped item (or between them) to act as the separator.
3.  **Typography & Spacing**:
    *   Change Question text to `text-[16px] font-semibold text-system-blue-dark`.
    *   Change Answer text to `text-[16px] font-normal text-system-blue-dark`.
4.  **Toggle Icon (The 40px Circle)**:
    *   Replace the standard chevron SVG with a circular element: `w-[40px] h-[40px] rounded-full bg-[#F5F7FA] flex items-center justify-center flex-shrink-0`.
    *   Inside the circle, render a Plus (+) icon if closed, and a Cross (x) icon if open.
