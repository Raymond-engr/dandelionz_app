# Contact Us Page Design Context

## Source
- **Figma Node**: [Contact Us (115:51)](https://www.figma.com/design/k6auG1yAuTBSf43CRCx9tF/Dandelionz--Copy-node-id=115-51&m=dev)

## Visual Standards
### Colors
- **Primary Brand**: `#030482` (system-blue-light)
- **Text (Body)**: `#000011` (system-blue-dark)
- **Dividers/Message Box**: `#F5F7FA`
- **Background**: `#FFFFFF`

### Typography
- **Page Title**: `Inter`, Semi-Bold, 24px, Centered, `#030482`.
- **Contact Info**: `Inter`, Regular, 16px, `#000011`.
- **Button Text**: `Inter`, Semi-Bold, 16px, White.

### Layout & Components
- **Buttons**: Both "Call Us" and "Send" are pill-shaped (`rounded-[50px]`), height `41px`, width `120px`, background `#030482`.
- **Dividers**: Uses the standard 11px `#F5F7FA` blocks to separate the Phone section, Address section, and Message section.
- **Message Area**: A large rounded rectangle (`rounded-[12px]`), height `179px`, background `#F5F7FA` with placeholder text "Leave a message...".

## Project-Specific Implementation Notes
- **Functionality**: The current `handleCall` (`tel:`) logic must be retained.
- **Form State**: State management for the new "Leave a message" text area will need to be added when implementing this design.

---

## 🛠️ Required Alignment Fixes
Apply these changes to `app/contact/ContactUsClientPage.tsx` or `app/contact/page.tsx` to achieve pixel-perfection:

1.  **Header**:
    *   Center the "Contact Us" title.
    *   Change the title font to `text-[24px] font-semibold text-system-blue-light`.
    *   Update back button to be a simple chevron.
2.  **Phone Section**:
    *   Change text size of phone numbers to `text-[16px]`.
    *   Update "Call Us" button to match the Figma spec: `h-[41px] w-[120px] rounded-[50px] text-[16px] font-semibold`.
3.  **Dividers**:
    *   Insert `<div className="h-[11px] bg-[#F5F7FA] w-full" />` between the Phone and Address sections.
4.  **Address Section**:
    *   Change text size to `text-[16px] leading-[18.1px]`.
5.  **New Section - Leave a Message**:
    *   Add another 11px divider after the Address section.
    *   Create a `<textarea>` with classes: `h-[179px] w-full bg-[#F5F7FA] rounded-[12px] p-[19px] px-[22px] text-[16px]`.
    *   Add the "Send" pill button (`h-[41px] w-[120px] rounded-[50px]`) aligned to the right below the text area, including the send icon.
