# Document: Dandelionz React Native (Expo) Migration & Setup Guide

This guide is specifically tailored for the **Dandelionz E-commerce** project. It ensures parity with your current Next.js stack while addressing mobile-specific requirements like Secure Storage and Native Layouts.

---

## Part 1: Initializing the Dandelionz Mobile App

### Step 1: Create the App
```bash
npx create-expo-app@latest dandelionz-mobile
cd dandelionz-mobile
```

### Step 2: Install Dandelionz-Specific Dependencies
NativeWind requires specific setup to bridge Tailwind into mobile.
```bash
npm install nativewind
npm install --save-dev tailwindcss@3.4.1 # Match current Next.js Tailwind logic
npx tailwindcss init

# Install mobile-native storage for RTK
npm install @react-native-async-storage/async-storage expo-secure-store react-native-svg
```

### Step 3: Configure Tailwind (NativeWind)
Update `tailwind.config.js` to include the **Dandelionz Design Tokens**:
```javascript
// tailwind.config.js
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'system-blue-light': '#030482',
        'system-blue-dark': '#000011',
        'system-red': '#FF4D4D',
        'system-yellow': '#FFD43B',
        'system-bg': '#F9FAFB',
        'system-divider': '#F5F7FA',
      },
      borderRadius: {
        'dandelion': '10px', // --radius in design system
      }
    },
  },
  plugins: [],
}
```

### Step 4: Port State Management & API
1. Copy `lib/store.ts`, `lib/features/`, and `lib/api/` folders.
2. **Critical Change in `baseApi.ts`**: Replace `document.cookie` logic with `expo-secure-store`.
3. **Critical Change in `Providers.tsx`**: Replace `localStorage` with `@react-native-async-storage/async-storage`.

### Step 5: Mobile Notification Strategy
Your project uses a Django Channels WebSocket system for real-time notifications. On mobile, this requires:
1. **WebSocket Persistence**: Use `useEffect` in your root `_layout.tsx` to maintain the `wss://` connection.
2. **Push Notifications**: Integrate `expo-notifications`. When the app is in the background, the WebSocket will close; the Django backend must then trigger an FCM (Android) or APNs (iOS) push via the `send_push_notification` task identified in `DJANGO_CHANNELS_NOTIFICATION_SYSTEM (1).md`.
3. **Auth Token**: Pass the JWT token to the WebSocket via query params: `wss://api.dandelionz.com.ng/ws/notifications/?token=${accessToken}`.

---

## Part 2: The Dandelionz AI Conversion Prompt
*Use this prompt when asking an AI to port a specific page from `app/(customer)/...` or `components/...` to Mobile.*

---

### [COPY EVERYTHING BELOW THIS LINE]

Act as an expert mobile developer migrating the **Dandelionz E-commerce** platform from Next.js to React Native (Expo).

**Project Context:**
- **Stack:** Expo Router, NativeWind (Tailwind), Redux Toolkit (RTK).
- **Design System:** Mobile-first, centered layout, primary color `#030482` (`system-blue-light`).
- **Icons:** We use custom SVG icons. Convert raw SVGs or Lucide imports to `react-native-svg` equivalents.

**Conversion Rules:**

1. **Strict Dandelionz Design Standards:**
   - **Buttons:** All primary buttons MUST be `h-[55px] rounded-[12px] bg-system-blue-light`.
   - **Dividers:** Replace standard borders between sections with a `<View className="h-[11px] bg-system-divider" />`.
   - **PIN Inputs:** Screens requiring a PIN (Set, Change, Confirm) must use a row of four `55x55px` boxes with `rounded-[8px]` borders and a `20px` gap between them.
   - **Typography:** Titles are `text-[24px] font-semibold`. Body/Labels are `text-[16px]`.
   - **Colors:** Use the mapped tokens: `system-blue-light`, `system-blue-dark`, `system-divider`.

2. **Component Mapping:**
   - `<div>`, `<section>`, `<main>` -> `<View>` or `<SafeAreaView>`.
   - `<p>`, `<span>`, `<h1>...<h6>` -> `<Text>`. **CRITICAL:** All strings must be in `<Text>`.
   - `<button>` -> `<Pressable className="active:opacity-70">`.
   - `<img>` -> `<Image source={{ uri: ... }}` (handle local vs remote).
   - `<input>` -> `<TextInput className="border-b border-gray-300 py-2" />`.

3. **Layout & Grid:**
   - **Grid to Flex:** Next.js `grid-cols-2` MUST be converted to `<FlatList numColumns={2} />` or a Flexbox container with `flex-row flex-wrap`.
   - **Scrolling:** Use `ScrollView` for forms/static pages and `FlatList` for product/order lists.

4. **Logic & Routing:**
   - Keep RTK Hooks (`useGetProductsQuery`, etc.) exactly as they are.
   - Replace `useRouter` from `next/navigation` with `useRouter` from `expo-router`.
   - Replace `onClick` with `onPress`.
   - Replace `onChange` for inputs with `onChangeText={(text) => ...}`.

**Input Code to Convert:**
[INSERT NEXT.JS CODE HERE]

---
