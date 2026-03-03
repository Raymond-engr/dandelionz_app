# Register Page Design Context

## Source
- **Figma Node**: [Customer Register Page (15:316)](https://www.figma.com/design/k6auG1yAuTBSf43CRCx9tF/Dandelionz--Copy-?node-id=15-316&m=dev)

## Visual Standards
### Colors
- **Primary Brand**: `#030482` (system-blue-light)
- **Text (Heading)**: `#000011` (system-blue-dark)
- **Input Background (Selects)**: `#F5F7FA`
- **Input Labels/Placeholders**: `rgba(0,0,0,0.5)`
- **Background**: `#FFFFFF`

### Typography
- **Page Title**: `Inter`, Regular, 24px, Centered, `#000011`. Structured as:
  ```text
  Create your Dandelionz
  Account
  ```
- **Input Labels**: `Inter`, Regular, 14px, `rgba(0,0,0,0.5)`.
- **Button Text**: `Inter`, Semi-Bold, 16px, White.
- **Footer Text**: `Inter`, Regular, 16px, Black. "Sign in" link: Semi-Bold, `#030482`.

### Layout & Components
- **Inputs**:
  - Text/Email/Phone: Underlined style (Line 8).
  - Selects (Role, State): Rounded containers (`rounded-[12px]`), background `#F5F7FA`, height `55px`.
  - Optional Fields: Rounded container (`rounded-[12px]`), background `#F5F7FA`.
- **Button**: 55px height, `rounded-[12px]`, background `#030482`.
- **Checkbox**: 22px size, label text 16px.
- **Back Button**: 10x16px chevron at the top-left (left: 21px, top: 47px).

## Project-Specific Implementation Notes
- **Password Criteria**: The project includes a `PasswordCriteria` component. **Retain this component** as it is functionally important, but ensure it is styled to match the page's spacing.
- **Validation**: Retain all existing form validation logic and error message display.
- **Responsiveness**: Maintain the `max-width: 600px` centered layout via `AppLayout`.

## Reference Snippet (Figma Extraction)
```tsx
<div className="bg-white relative size-full">
  {/* Title */}
  <h1 className="text-[24px] font-normal text-center text-[#001]">
    Create your Dandelionz<br/>Account
  </h1>

  {/* Underlined Input Pattern */}
  <div className="flex flex-col gap-[36px]">
    <label className="text-[14px] text-[rgba(0,0,0,0.5)]">Full Name</label>
    <div className="border-b border-gray-300" />
  </div>

  {/* Select/Rounded Input Pattern */}
  <div className="bg-[#f5f7fa] h-[55px] rounded-[12px] flex items-center px-[19px]">
    <span className="text-[16px] text-[rgba(0,0,17,0.5)]">Customer</span>
    <ChevronDown />
  </div>
</div>
```

---

## 🛠️ Required Alignment Fixes
Apply these changes to `app/(auth)/register/RegisterClientPage.tsx` to achieve pixel-perfection:

1.  **Header**:
    *   Update back button to be a simple chevron at `top-[47px] left-[21px]`.
    *   Center the title and set font size to 24px. Use `<br/>` or flex-col to match the multi-line layout.
2.  **Input Fields**:
    *   **Role & State**: Change from standard selects to custom rounded containers (`h-[55px] bg-[#F5F7FA] rounded-[12px]`).
    *   **Text Inputs**: Ensure they are simple underlined fields with 14px labels. Use `rgba(0,0,0,0.5)` for labels.
    *   **Optional (Referral)**: Style as a rounded container matching the Role selector.
3.  **Checkbox**:
    *   Increase checkbox size to `size-[22px]` and label text to `text-[16px]`.
4.  **Register Button**:
    *   Change height to `h-[55px]` and border radius to `rounded-[12px]`.
5.  **Footer Link**:
    *   Update text to 16px and ensure "Sign in" is `font-semibold text-[#030482]`.
