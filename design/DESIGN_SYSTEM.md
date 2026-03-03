# Dandelionz Design System Rules

## 1. Token Definitions
Tokens are defined as CSS variables in `app/globals.css` and extended in `tailwind.config.ts`.
- **Primary Brand**: `--color-system-blue-light` (`#030482`). Use `text-system-blue-light` or `bg-system-blue-light`.
- **Secondary/Dark**: `--color-system-blue-dark` (`#000011`). Use for high-contrast text.
- **Accents**: 
  - Red: `--color-system-red` (`#FF4D4D`).
  - Yellow: `--color-system-yellow` (`#FFD43B`).
- **Surface/Dividers**: 
  - Dividers: `#F5F7FA` (Used as 11px height group separators).
  - Background: `#F9FAFB`.
- **Radius**: `--radius` (0.625rem / 10px).

## 2. Component Architecture
- **Location**: `components/` for custom business logic components, `components/ui/` for primitive UI components.
- **Critical Note**: There are two `Button` implementations. Use `components/Button.tsx` for custom brand buttons with loading states.
- **Icons**: SVG-based React components in `components/icons/`.

### 2.1 Global Button Standards
To maintain consistency across all flows (Checkout, Profile, Authentication, etc.), buttons must strictly adhere to these Figma specifications:
- **Primary Button** (e.g., "Start Shopping", "Save Changes", "Proceed"):
  - Height: `55px` (`h-[55px]`)
  - Border Radius: `12px` (`rounded-[12px]`)
  - Background: `--color-system-blue-light` (`bg-[#030482]`)
  - Text: `16px`, Semi-Bold, White (`text-[16px] font-semibold text-white`)
- **Secondary/Outline Button** (e.g., "Discard"):
  - Height: `55px` (`h-[55px]`)
  - Border Radius: `12px` (`rounded-[12px]`)
  - Background: Transparent (`bg-transparent` or `bg-white`)
  - Border: 1px solid `--color-system-blue-light` (`border border-[#030482]`)
  - Text: `16px`, Semi-Bold, System Blue Light (`text-[16px] font-semibold text-[#030482]`)

## 3. Styling Approach
- **Mobile First**: All pages are wrapped in `AppLayout` which enforces a centered `max-width: 600px` container.
- **Typography**: Primary font is **Inter**. Standardize on:
  - Titles: 24px, Semi-Bold.
  - Body/Labels: 16px, Regular/Medium.
- **Dividers**: Do not use standard 1px borders for logical group separation; use 11px blocks of `#F5F7FA` as seen in Figma.

## 4. Layout Patterns
- **Role-Based Navigation**: `AppLayout` automatically swaps `BottomNav` based on the `userRole` prop (customer, vendor, admin).
- **List Items**: Items in lists should have ~21px horizontal padding and a consistent height, ending with a right-aligned chevron.

## 5. Asset Management
- **Images**: Use `next/image` for all images stored in `public/`.
- **Icons**: Prefer using the existing components in `components/icons/` over raw SVGs or external libraries.

## 6. Mobile & Multi-Platform Strategy
The design system is optimized for both **Web (PWA)** and **Native Mobile (iOS/Android)**:
- **Touch Targets**: Base text (16px) and list item padding (py-4) ensure all interactive elements exceed the 44x44px accessibility standard for mobile devices.
- **Visual Separation**: The 11px thick dividers (`#F5F7FA`) provide clear logical grouping on narrow mobile screens where white space is limited.
- **Header Structure**: Centered headers (24px) align with standard mobile navigation patterns (e.g., Apple Human Interface Guidelines).
- **Navigation**: The 81px bottom navigation bar provides sufficient thumb reachability and accommodates large "Pill" style active states common in modern mobile apps.

## 7. Cross-Page Consistency Rules
To maintain a unified user experience across the app, certain design patterns serve as archetypes for related pages:
- **Authentication & Password Management**: The visual standards established in `design/login.md` and `design/register.md` (e.g., 24px centered titles, underlined text inputs, 55px tall `rounded-[12px]` buttons) **must be uniformly applied to all related flows**. This includes the **Forgot Password** and **Change Password** pages across *all* user roles (Customer, Vendor, Admin).
- **Policy & Informational Pages**: The typography and structural framing established in `design/terms.md` (e.g., 16px body text, 11px `#F5F7FA` dividers framing "Note" sections) **must be applied to all Terms and Conditions pages**, regardless of the user role they serve.

### 7.1 Global UI Archetypes
- **PIN Inputs**: All screens requiring a Payment PIN (Set, Change, Forgot, Confirm Withdrawal) must use the `55x55px` box grid with `20px` gaps and `8px` rounded borders as defined in `design/pin-standards.md`.
- **Success Pages**: Every completion or confirmation screen (Registration, Checkout, PIN Update, Withdrawal) must follow the layout in `design/success-standards.md`, featuring the `197x197px` checkmark icon and the `11px` section divider above the primary action button.
