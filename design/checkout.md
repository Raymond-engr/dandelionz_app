# Checkout Flow Design Context

## Source
- **Step 1: Payment Frequency**: [Node 150:171](https://www.figma.com/design/k6auG1yAuTBSf43CRCx9tF/Dandelionz--Copy-node-id=150-171&m=dev)
- **Step 2: Weekly Installments**: [Node 150:249](https://www.figma.com/design/k6auG1yAuTBSf43CRCx9tF/Dandelionz--Copy-node-id=150-249&m=dev)
- **Step 3: Monthly Installments**: [Node 150:349](https://www.figma.com/design/k6auG1yAuTBSf43CRCx9tF/Dandelionz--Copy-node-id=150-349&m=dev)
- **Step 4: Shipping Details**: [Node 150:493](https://www.figma.com/design/k6auG1yAuTBSf43CRCx9tF/Dandelionz--Copy-node-id=150-493&m=dev)

## Visual Standards
### Colors
- **Primary Brand**: `#030482` (system-blue-light)
- **Text (Heading)**: `#000011` (system-blue-dark)
- **Dividers/Backgrounds**: `#F5F7FA`

### Typography
- **Main Title**: `Inter`, Semi-Bold, 24px, Centered, `#030482`.
- **Section Heading**: `Inter`, Medium, 20px, `#000011`.
- **Labels/Items**: `Inter`, Regular, 16px, `#000011`.
- **Progress Labels**: `Inter`, Regular, 14px, `#030482`.

### Layout & Components
- **Progress Bar**:
  - Thin 2px line (`#030482`).
  - Small 16.5px circles for steps.
  - Labels underneath at 14px.
- **Installment Grid**:
  - 6-column grid for numbers.
  - Selected state: `bg-[#030482]` with white text.
  - Unselected state: `bg-[#F5F7FA]` with `#000011` text.
  - Each box: ~41px wide, `rounded-[12px]`.
- **Radio Buttons**:
  - Large circular style with inner dot for selection.
- **Buttons**:
  - 55px height, `rounded-[12px]`, background `#030482`, text 16px Semi-Bold.

---

## 🛠️ Required Alignment Fixes

### 1. Progress Indicator (`components/CheckoutProgress.tsx`)
- Reduce line height to `h-[2px]`.
- Reduce step circles to `size-[16.5px]`.
- Remove step numbers inside circles.
- Update labels to `text-[14px] font-normal text-system-blue-light`.

### 2. Checkout Step 1: Frequency (`app/(customer)/checkout/page.tsx`)
- Center the "Checkout" title and set to 24px.
- Change "Select Payment Frequency" to `text-[20px] font-medium`.
- Implement the installment selection grid (Step 2/3 design) when "Weekly" or "Monthly" is selected.
- Update radio buttons and Proceed button to match the 12px border radius and specific height.

### 3. Checkout Step 4: Shipping (`app/(customer)/checkout/shipping/page.tsx`)
- Update typography to match Step 1.
- Use the 11px `#F5F7FA` divider between "Home" and "Pickup" options.
- Style the Address field as a rounded box (`bg-[#F5F7FA] rounded-[12px] h-[55px]`).

### 4. Checkout Step 5: Payment (Inferred from System Rules)
- Align "Select Payment Mode" heading to 20px Medium.
- Use 11px dividers between payment options.
- Update buttons and radio icons to maintain consistency with the rest of the flow.
