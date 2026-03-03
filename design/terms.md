# Terms & Conditions Design Context

*Note: The typography, list styling, and "Note" framing defined in this document serve as the archetype for all Terms and Conditions pages across the application, including those specific to Vendors and Admins.*

## Source
- **Figma Node**: [Terms and Conditions (83:42)](https://www.figma.com/design/k6auG1yAuTBSf43CRCx9tF/Dandelionz--Copy-?node-id=83-42&m=dev)

## Visual Standards

### Colors
- **Page Title**: `#030482` (system-blue-light)
- **Text (Body)**: `#000011` (system-blue-dark)
- **Dividers**: `#F5F7FA`

### Typography
- **Page Title**: `Inter`, Semi-Bold, 24px, Centered, `#030482`.
- **Body Text (List Items & Note)**: `Inter`, Regular, 16px, `#000011`, Line Height ~18.1px.
- **Note Heading**: `Inter`, Semi-Bold, 16px, `#000011`.

### Layout & Components
- **List Layout**: Numbered list with standard left indent.
- **"Note" Highlight**: The Note section is visually boxed in by placing an 11px `#F5F7FA` divider *above* it and another 11px divider *below* it.

---

## 🛠️ Required Alignment Fixes
Apply these changes to `app/(customer)/terms/page.tsx` to achieve pixel-perfection:

1.  **Header**:
    *   Center the "Terms & Conditions" title.
    *   Change the title font to `text-[24px] font-semibold text-system-blue-light`.
    *   Ensure the back button is a simple chevron.
2.  **List Items**:
    *   Update the text size for all list items from `text-sm` to `text-[16px]`.
    *   Change the text color from `text-gray-700` to `text-system-blue-dark`.
    *   Ensure consistent paragraph spacing between list items.
3.  **The "Note" Section Framework**:
    *   Add an 11px divider *before* the Note section: `<div className="h-[11px] bg-[#F5F7FA] w-full" />`.
    *   Update the "Note" heading to `text-[16px] font-semibold text-system-blue-dark`.
    *   Update the note body text to `text-[16px] font-normal text-system-blue-dark`.
    *   Add an 11px divider *after* the Note section: `<div className="h-[11px] bg-[#F5F7FA] w-full" />`.
