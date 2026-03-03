# Admin Payments & Settlements Design Context

## Source
- **Figma Node**: [Payments & Settlements (375:460)](https://www.figma.com/design/k6auG1yAuTBSf43CRCx9tF/Dandelionz--Copy-node-id=375-460&m=dev)

## Visual Standards
### Colors
- **Page Title**: `#030482` (system-blue-light)
- **Text (Labels)**: `#000011` (system-blue-dark)
- **Dividers**: `#F5F7FA` (11px height strips)

### Typography
- **Page Title**: `Inter`, Semi-Bold, 24px, Centered, `#030482`.
- **Section Titles**: `Inter`, Semi-Bold, 20px, `#000011`.
- **List Item Labels**: `Inter`, Regular, 16px, `#000011`.

### Layout & Components
- **Architecture**: This page serves as a high-level navigation menu for all financial operations.
- **Dividers**: Uses the standard 11px `#F5F7FA` strips between the header, section titles, and individual links.
- **Grouping**:
  - **Overview**: Contains "Summary" and "Transaction History".
  - **Settlements & Payouts**: Contains "Vendor Settlements", "Payout", and "Disputes & Refunds".

## Project-Specific Implementation Notes
- **Routing**: This design represents the top-level index for Admin payments. It should link to existing detailed pages like `/admin/account/settlements/vendor`.
- **Consistency**: Retain all established logic while transforming the UI from standard Tailwind borders to the Figma "flat list + thick dividers" pattern.

---

## 🛠️ Required Alignment Fixes
Apply these changes to the top-level Admin Payment page to achieve pixel-perfection:

1.  **Header**:
    *   Center the title: `text-[24px] font-semibold text-system-blue-light`.
2.  **Sectioning**:
    *   Group "Summary" and "Transaction History" under an "Overview" heading (`text-[20px]`).
    *   Group the remaining links under "Settlements & Payouts" (`text-[20px]`).
3.  **Dividers**:
    *   Replace all thin borders with `<div className="h-[11px] bg-[#F5F7FA] w-full" />`.
4.  **Typography**:
    *   Standardize all links to `text-[16px] font-normal text-system-blue-dark`.
