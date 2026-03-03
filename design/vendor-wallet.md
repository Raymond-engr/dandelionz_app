# Vendor Wallet Page Design Context

## Source
- **Figma Node**: [Wallet (300:504)](https://www.figma.com/design/k6auG1yAuTBSf43CRCx9tF/Dandelionz--Copy-node-id=300-504&m=dev)

## Visual Standards
### Typography
- **Page Title**: `Inter`, Semi-Bold, 24px, `#000011`.
- **Page Subtitle**: `Inter`, Regular, 16px, `#000011`.
- **Main Balance**: `Inter`, Semi-Bold, 32px, White.
- **Withdraw Button Text**: `Inter`, Regular, 20px, `#030482`.

### Layout & Colors
- **Withdrawable Amount Card**:
  - `bg-[#030482] rounded-[12px] h-[101px]`.
  - The label is `16px Regular White`, and the value is `32px Semi-Bold White`.
  - *Note*: The "Withdraw Earnings" button is **NOT** inside this blue card in the Figma design.
- **Withdraw Earnings Button**:
  - This is a separate block below the blue card.
  - `bg-[#F5F7FA] rounded-[12px] h-[58px]`.
  - Content: A purple icon and `20px Regular text-system-blue-light`.
- **Overview Grid Background**:
  - The grid is placed over a full-width `#F5F7FA` background spanning `242px` height.
- **Overview Cards** (`h-[95px] rounded-[12px]`):
  - **Available Balance**: `bg-[rgba(77,255,151,0.5)]` (Light Green). Text is `#000011`.
  - **Total Earnings**: `bg-[rgba(3,4,130,0.5)]` (Semi-transparent Blue). Text is White.
  - **Total Withdrawals**: `bg-white`. Text is `#000011`.
  - **This Month**: `bg-[rgba(151,71,255,0.5)]` (Light Purple). Text is White.

---

## 🛠️ Required Alignment Fixes
Apply these changes to `app/vendor/wallet/page.tsx` to achieve pixel-perfection:

1.  **Header**:
    *   Update Title to `text-[24px] font-semibold text-system-blue-dark`.
    *   Update Subtitle to `text-[16px] font-normal text-system-blue-dark`.
2.  **Top Balance Card**:
    *   Change dimensions to `h-[101px] rounded-[12px]`.
    *   Update balance text to `text-[32px] font-semibold`.
    *   **Remove the Withdraw button from inside this card.**
3.  **Withdraw Button (New Structure)**:
    *   Create a new block below the blue card for the withdrawal action.
    *   Style it as `bg-[#F5F7FA] h-[58px] rounded-[12px] flex items-center justify-center gap-[27px]`.
    *   Text should be `text-[20px] font-normal text-system-blue-light`.
4.  **Overview Grid**:
    *   Wrap the grid section in a full-width `#F5F7FA` background container.
    *   Update the card colors to match the exact rgba values specified in the Visual Standards.
    *   Ensure "Total Earnings" and "This Month" use white text, while the others use `#000011`.
    *   Update labels to `text-[16px] font-normal` and values to `text-[20px] font-semibold`.
