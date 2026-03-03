# Profile Page Design Context

## Source
- **Figma Node**: [Profile (260:357)](https://www.figma.com/design/k6auG1yAuTBSf43CRCx9tF/Dandelionz--Copy-node-id=260-357&m=dev)

## Visual Standards
### Colors
- **Page Title**: `#030482` (system-blue-light)
- **Text (Data)**: `#000011` (system-blue-dark)
- **Labels**: `rgba(0,0,0,0.5)`
- **Background Containers**: `#F5F7FA`

### Typography
- **Page Title**: `Inter`, Semi-Bold, 24px, Centered, `#030482`.
- **Top Profile Name**: `Inter`, Regular, 20px, `#000011`.
- **Top Profile Email**: `Inter`, Regular, 16px, `#000011`.
- **Field Labels**: `Inter`, Regular, 14px, `rgba(0,0,0,0.5)`.
- **Field Data**: `Inter`, Medium (for Name/Email) or Regular (for Address/Phone), 16px, `#000011` or `rgba(0,0,17,0.5)`.

### Layout & Components
- **Avatar**: 91x91px circular image. Contains a small camera icon overlaid on the bottom right.
- **Header Section**: Avatar is aligned left, with Name and Email stacked vertically to its right.
- **Data Display Formatting**:
  - *Full Name & Email Address*: Displayed as clean text (no background box), stacked vertically with a 12px gap below the label.
  - *Phone Number & Address*: Displayed inside a prominent light gray box (`bg-[#F5F7FA] h-[55px] rounded-[12px]`), giving them a "read-only input" appearance.
- **Password Section**: Uses large asterisks (`text-[24px]`) and includes an eye icon for visibility toggle. Below it is a simple "Change Password" text link (`text-[16px] text-[#030482]`).
- **Buttons**:
  - "Save Changes": Primary Button (55px height, `rounded-[12px]`, `bg-[#030482]`, white text).
  - "Discard": Secondary Button (55px height, `rounded-[12px]`, `border border-[#030482]`, `#030482` text).

---

## 🛠️ Required Alignment Fixes
Apply these changes to `app/(customer)/account/profile/page.tsx` to achieve pixel-perfection:

1.  **Header & Avatar**:
    *   Center the "Profile" title at `text-[24px]`.
    *   Increase Avatar size to `w-[91px] h-[91px]`.
    *   Update the camera icon overlay to match the specific Figma vector (or use an appropriate SVG icon positioned precisely at the bottom right).
2.  **Top Profile Info**:
    *   Position Name (`text-[20px]`) and Email (`text-[16px]`) to the right of the Avatar, rather than centered below it.
3.  **Field Layouts (Critical Change)**:
    *   *Remove* the currently implemented underlined input approach.
    *   **Name/Email**: Style as plain text below `14px` labels (`text-[rgba(0,0,0,0.5)]`).
    *   **Phone/Address**: Wrap the text data in a div: `<div className="bg-[#F5F7FA] h-[55px] rounded-[12px] flex items-center px-[19px]">`.
4.  **Password Section**:
    *   Increase asterisk size to `text-[24px] font-medium`.
    *   Update "Change Password" link to `text-[16px] font-normal text-system-blue-light`.
5.  **Action Buttons**:
    *   Update "Save Changes" to `h-[55px] rounded-[12px] text-[16px] font-semibold`.
    *   Update "Discard" to match the global secondary button standard (`border border-[#030482] text-[#030482] h-[55px] rounded-[12px]`). Remove the standard gray border it currently uses.
