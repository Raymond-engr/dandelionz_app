# Login & Password Management Design Context

*Note: The standards defined in this document serve as the archetype for all authentication-related forms, including the Login, Forgot Password, and Change Password pages across all user roles.*

## Source
- **Figma Node**: [Login Page (16:67)](https://www.figma.com/design/k6auG1yAuTBSf43CRCx9tF/Dandelionz--Copy-?node-id=16-67&m=dev)

## Visual Standards

### Colors
- **Primary Brand**: `#030482` (system-blue-light)
- **Text (Heading)**: `#000011` (system-blue-dark)
- **Input Labels/Placeholders**: `rgba(0,0,0,0.5)`
- **Background**: `#FFFFFF`

### Typography
- **Page Title**: `Inter`, Regular, 24px, Centered, `#000011`. Structured as:
  ```text
  Login to your Dandelionz
  Account
  ```
- **Input Labels**: `Inter`, Regular, 14px, `rgba(0,0,0,0.5)`.
- **Forgot Password**: `Inter`, Regular, 16px, `#030482`.
- **Button Text**: `Inter`, Semi-Bold, 16px, White.
- **Footer Text**: `Inter`, Regular, 16px, Black. "Sign up" link: Semi-Bold, `#030482`.

### Layout & Components
- **Inputs**:
  - Email/Password: Underlined style (Line 8).
- **Button**: 55px height, `rounded-[12px]`, background `#030482`.
- **Back Button**: 10x16px chevron at the top-left (left: 21px, top: 47px).
- **Password Input**: 23px wide eye icon (Vector) for visibility toggle.

## Project-Specific Implementation Notes
- **Go to Home**: The current code has a "Go to Home" link in the header. **Retain this link** as it's useful, but style it consistently with the 16px font weight.
- **Validation**: Retain all existing form validation logic and error message display.
- **Responsiveness**: Maintain the `max-width: 600px` centered layout via `AppLayout`.

## Reference Snippet (Figma Extraction)
```tsx
<div className="bg-white relative size-full">
  {/* Title */}
  <h1 className="text-[24px] font-normal text-center text-[#001]">
    Login to your Dandelionz<br/>Account
  </h1>

  {/* Underlined Input Pattern */}
  <div className="flex flex-col gap-[36px]">
    <label className="text-[14px] text-[rgba(0,0,0,0.5)]">Email Address</label>
    <div className="border-b border-gray-300" />
  </div>

  {/* Login Button Pattern */}
  <a className="bg-[#030482] h-[55px] rounded-[12px] flex items-center justify-center">
    <p className="text-white text-[16px] font-semibold">Log in</p>
  </a>
</div>
```

---

## 🛠️ Required Alignment Fixes
Apply these changes to `app/(auth)/login/LoginClientPage.tsx` to achieve pixel-perfection:

1.  **Header**:
    *   Update back button to be a simple chevron at `top-[47px] left-[21px]`.
    *   Center the title and set font size to 24px. Use `<br/>` or flex-col to match the multi-line layout.
2.  **Input Fields**:
    *   **Text Inputs**: Ensure they are simple underlined fields with 14px labels. Use `rgba(0,0,0,0.5)` for labels.
    *   Remove `bg-gray-50` or `px-4` if they deviate from the simple underlined look.
3.  **Forgot Password**:
    *   Ensure the link is `text-[16px] font-normal text-[#030482]`.
4.  **Login Button**:
    *   Change height to `h-[55px]` and border radius to `rounded-[12px]`.
5.  **Footer Link**:
    *   Update text to 16px and ensure "Sign up" is `font-semibold text-[#030482]`.
