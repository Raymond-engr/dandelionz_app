# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Tasks

*   **Start development server**: `npm run dev`
*   **Build for production**: `npm run build`
*   **Start production server**: `npm run start`
*   **Run linter**: `npm run lint`

## High-Level Code Architecture

This project is a Next.js application utilizing the App Router for routing and UI. It follows a role-based architecture with distinct sections for customer, vendor, and admin functionalities.

### Directory Structure

*   `app/`: Contains the main application routes and UI components, organized by user roles (`(customer)`, `vendor`, `admin`).
*   `components/`: Houses reusable React components.
*   `lib/`: Contains core application logic, including:
    *   `lib/store.ts`: Redux Toolkit store configuration.
    *   `lib/features/auth/authSlice.ts`: Redux slice for authentication state management.
    *   `lib/api/`: Defines API services using Redux Toolkit Query, separated by purpose:
        *   `baseApi.ts`: Base API configuration.
        *   `authApi.ts`: Authentication-related endpoints.
        *   `publicApi.ts`: Publicly accessible endpoints.
        *   `customerApi.ts`, `vendorApi.ts`, `adminApi.ts`: Role-specific API endpoints.
    *   `lib/hooks.ts`: Custom React hooks for shared logic.
    *   `lib/utils.ts`: General utility functions.

### Data Flow

Data fetching and state management are primarily handled using Redux Toolkit and Redux Toolkit Query. API interactions are compartmentalized by user role within the `lib/api` directory.