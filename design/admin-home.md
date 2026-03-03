# Admin Homepage Design Context

## Source
- **Figma Node**: [Admin Dashboard (359:98)](https://www.figma.com/design/k6auG1yAuTBSf43CRCx9tF/Dandelionz--Copy-node-id=359-98&m=dev)

## Visual Standards
### Typography
- **Header Greeting**: `Inter`, Medium, 20px, `rgba(0,0,17,0.5)`.
- **Header Username**: `Inter`, Semi-Bold, 24px, `#000011`.
- **Card Titles**: `Inter`, Regular, 16px, `#000011`.
- **Card Values**: `Inter`, Semi-Bold, 20px, `#000011`.

### Layout & Components
- **Background Framer**: A large `#F5F7FA` block (`h-[242px]`) sits behind the stats grid, creating visual separation from the white header.
- **Stats Grid**:
  - 4 Cards (`bg-white h-[95px] rounded-[12px]`). No borders.
  - Each card has a `size-[29px]` container for its icon.
  - Layout matches the Vendor Stats Grid pattern precisely.
- **Navigation**: Uses the standard 81px bottom nav bar.

---

## 🛠️ Required Alignment Fixes
Apply these changes to `app/admin/page.tsx` to achieve pixel-perfection:

1.  **Header**:
    *   Update "Welcome back," to `text-[20px] font-medium text-[rgba(0,0,17,0.5)]`.
    *   Update "Admin" to `text-[24px] font-semibold text-system-blue-dark`.
2.  **Dashboard Background**:
    *   Wrap the Stats Grid in a full-width background container colored `#F5F7FA` (similar to the Vendor Order page background structure).
3.  **Stats Cards (`StatCard` component)**:
    *   *Remove* the `border border-gray-200` to match the flat Figma style.
    *   Ensure the cards are exactly `h-[95px] rounded-[12px]`.
    *   Update titles to `text-[16px] font-normal text-system-blue-dark`.
    *   Update values to `text-[20px] font-semibold text-system-blue-dark`.
    *   Update the icon container size to exactly `size-[29px] rounded-[6px]`.
