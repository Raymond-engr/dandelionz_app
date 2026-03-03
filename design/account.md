# Account Page Design Context

## Source
- **Figma Node**: [Account (13:245)](https://www.figma.com/design/k6auG1yAuTBSf43CRCx9tF/Dandelionz--Copy-node-id=13-245&m=dev)

## Visual Standards
### Colors
- **Primary Brand**: `#030482` (system-blue-light)
- **Text (Heading)**: `#000011` (system-blue-dark)
- **Dividers/Section Separators**: `#F5F7FA` (11px height strips)
- **Background**: `#FFFFFF`

### Typography
- **Page Title**: `Inter`, Semi-Bold, 24px, Centered, `#000011`.
- **List Item Labels**: `Inter`, Regular, 16px, `#000011`.
- **Sign In Link**: `Inter`, Regular/Semi-Bold, 20px, `#030482`.

### Layout & Components
- **Dividers**: Distinct 11px height blocks of `#F5F7FA` are used to separate logical groups (e.g., between User Info and Account Links, and between Account Links and Logout).
- **List Items**:
  - Horizontal padding: ~21px.
  - vertical spacing: consistent between items.
  - Chevrons: Simple right-pointing arrows.
- **Header**: The word "Account" is centered at the top.
- **Avatar**: Large circular placeholder (91px).

## Project-Specific Implementation Notes
- **Icons**: The current implementation includes icons in the list items which are NOT in the Figma design. **Retain these icons** as they are functional additions, but ensure they are styled consistently with the text.
- **Extra Fields**: The project includes "Notifications" and "Track Order" which are not in this specific Figma node. **Retain these fields**.
- **Responsiveness**: Maintain the `max-width: 600px` centered layout via `AppLayout`.

## Reference Snippet (Figma Extraction)
```tsx
<div className="bg-white relative size-full">
  <p className="font-semibold text-[#001] text-[24px] text-center">Account</p>
  <div className="bg-[#f5f7fa] h-[11px] w-full" /> {/* Group Divider */}
  {/* List Item Pattern */}
  <a className="flex items-center justify-between px-[21px] py-4">
    <p className="text-[#001] text-[16px]">Profile</p>
    <ChevronRight />
  </a>
</div>
```

---

## 🛠️ Required Alignment Fixes
Apply these changes to `app/(customer)/account/page.tsx` to achieve pixel-perfection:

1.  **Header**:
    *   Change `p-4 border-b border-gray-200` to `pt-10 pb-4`.
    *   Change title classes to `text-[24px] font-semibold text-center text-system-blue-dark`.
2.  **User Info Section**:
    *   Increase Avatar container to `w-[91px] h-[91px]`.
    *   Change "Sign In" link (when logged out) to `text-[20px] font-normal text-system-blue-light`.
3.  **Dividers**:
    *   Replace all `border-b border-gray-200` and `border-t` with a div: `<div className="h-[11px] bg-[#F5F7FA] w-full" />`.
4.  **List Items**:
    *   Update horizontal padding to `px-[21px]`.
    *   Update label text to `text-[16px] font-normal text-system-blue-dark`.
    *   Remove `border-b border-gray-100` from individual items; use the thick 11px dividers only between major logical groups.
5.  **Bottom Sign In**:
    *   If not logged in, the bottom "Sign In" should be a simple text link: `text-[20px] font-semibold text-system-blue-light text-center`.

