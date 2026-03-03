# Figma Alignment Prompt (Reusable)

Use this prompt with any AI model to align the current project codebase with Figma designs pixel-perfectly while preserving functional additions.

---

## 🚀 Objective
Align the code in [TARGET_FILE_PATH] with the design specifications found in the `design/` folder, specifically [DESIGN_DOC_PATH]. The goal is **pixel-perfection** regarding colors, typography, and spacing, while maintaining all existing functional fields, icons, and responsiveness.

## 🛠️ Context Files
- **Global Rules**: `design/DESIGN_SYSTEM.md`
- **Page Context**: `design/[PAGE_NAME].md`
- **Current Styling**: `app/globals.css` and `tailwind.config.ts`

## 📋 Instructions

### 1. Research & Compare
- Read the target file and the corresponding design documentation in the `design/` folder.
- Identify discrepancies in:
  - **Colors**: Exact hex codes vs Tailwind standard classes.
  - **Typography**: Font sizes, weights (Semi-Bold vs Medium), and alignment (Centered vs Left-aligned).
  - **Spacing**: Vertical/Horizontal padding and specific height elements (e.g., 11px group dividers).
  - **Layout**: Centering of headers or specific pill styles for active navigation items.

### 2. Strategic Implementation
- **DO NOT Remove**: 
  - Extra fields added later (e.g., Notifications, Track Order).
  - Functional icons (if present in code but not in Figma).
  - Business logic (RTK Query hooks, authentication checks, role-based logic).
- **DO Update**:
  - CSS classes to use the custom variables defined in `globals.css` (e.g., `text-system-blue-light`).
  - Font sizes and weights to match Figma exactly.
  - Spacing and dividers to use the exact dimensions specified in the design context.
  - Ensure the header is centered if the design requires it.

### 3. Execution Pattern
- Use surgical `replace` calls to update only the styling and structure while leaving the logic intact.
- If a component is a "partial match" (e.g., a List Item that has an icon but needs specific padding), update only the container's classes and text styles.

### 4. Validation
- Ensure the page is still wrapped in `AppLayout`.
- Verify that dark mode support is maintained by using the correct CSS variables.
- Check that the UI remains responsive within the 600px centered container.

---

## 📝 Example Strategy
- "The Account Page currently uses `text-lg font-semibold` for the header. I will update it to `text-[24px] font-semibold text-center text-system-blue-dark` to match Figma while keeping the surrounding `AppLayout` wrapper."
