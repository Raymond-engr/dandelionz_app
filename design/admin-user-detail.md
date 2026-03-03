# Admin User Detail Design Context

## Source
- **Figma Node**: [User Details (365:1134)](https://www.figma.com/design/k6auG1yAuTBSf43CRCx9tF/Dandelionz--Copy-?node-id=365-1134&m=dev)

## Visual Standards
### Colors & Layout
- **Page Title**: `#030482` (system-blue-light).
- **Top Stats**: 
  - Total Spend: `bg-[rgba(77,255,151,0.25)] text-[#207d47]`.
  - Total Order: `bg-[rgba(3,4,130,0.25)] text-[#030482]`.
- **Dividers**: 11px `#F5F7FA` strip below the top profile info and above the bottom action section.

### Typography
- **Page Title**: `Inter`, Semi-Bold, 24px, Centered, `#030482`.
- **Labels**: `Inter`, Regular, 14px, `rgba(0,0,0,0.5)`.
- **Data**: `Inter`, Medium, 16px, `#000011`.

### Action Section (Bottom)
- **Suspend Dropdown**: A unique rounded red-bordered container (`border-[#ff4d4d] h-[55px] rounded-[12px]`) containing the text "Suspend User".
- **Reason Area**: `bg-[#F5F7FA] h-[179px] rounded-[12px]` with placeholder "Reason for action...".
- **Send Button**: Small pill button (`h-[41px] w-[120px] rounded-[50px] bg-[#030482]`) with a send icon.
- **Confirm Button**: Large Primary Button (`h-[55px] rounded-[12px] bg-[#030482]`) with text "Confirm Action".

---

## 🛠️ Required Alignment Fixes
Apply these changes to `app/admin/users/[id]/page.tsx` to achieve pixel-perfection:

1.  **Header & Avatar**:
    *   Center the "User Details" title at `text-[24px]`.
    *   Increase Avatar size to `w-[91px] h-[91px]`.
    *   Place Name and Email to the right of the avatar.
2.  **Stats Cards**:
    *   Update colors to the specific rgba values for "Total Spend" and "Total Order".
3.  **Field Layout**:
    *   *Remove* the currently used standard grid labels.
    *   Style each field (Full Name, Email, etc.) with a 14px gray label and 16px black data text below it.
4.  **Action Section (Major Overhaul)**:
    *   Implement the "Suspend User" red-bordered selector.
    *   Style the Reason textarea as a light gray box (`bg-[#F5F7FA] h-[179px]`).
    *   Add the "Send" pill button below the reason box.
    *   Add the "Confirm Action" button at the very bottom using the Global Primary standard.
