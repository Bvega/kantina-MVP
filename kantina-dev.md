# Kantina MVP - Development Handover & Project Status

> [!IMPORTANT]
> ### 🤖 Prompt for Incoming AI Assistant (Copy & Paste to Start)
> *"I have just loaded the Kantina MVP codebase. Please begin by opening and reading [kantina-dev.md](file:///c:/Users/boliv/Desktop/Kantina/kantina-mvp/kantina-dev.md) in full. This will walk you through the React+Vite+Tailwind file structure, the dual-mode Firebase/localStorage mock synchronization engine, and the development commands. After reading, look at the 'Next Steps' backlog at the bottom of the file to see what to build next. Make sure to preserve the mock fallbacks so the app remains testable without active Firebase keys."*

---

This document serves as a complete catch-up guide for any developer or AI assistant resuming development of the Kantina MVP.

---

## 📌 Project Overview
Kantina is a real-time, mobile-first ordering platform designed specifically for street food vendors (*vendedores ambulantes*) and night-market food stalls.
*   **Customer Flow**: Customers scan a table-specific QR code, browse a mobile-optimized menu, add items to a cart, input their name/table, and confirm.
*   **Vendor Flow**: Vendors receive incoming orders in real-time on a 3-column Kanban board, hear synthesised audio alerts, flash tab notifications, and manage dish lists/prices.

---

## 🛠️ Technology Stack
*   **Frontend**: React (v18.2) + React Router DOM (v7.9) + Vite (v4.5)
*   **Styling**: Tailwind CSS (v3.3) + PostCSS (v8.4) + Lucide Icons (v0.453)
*   **Backend**: Firebase (v10.14) (Authentication + Firestore Database)
*   **QR Rendering**: `qrcode.react` (renders canvas and SVG formats)

---

## 🔌 Dual-Mode Architecture (Mock / Production)
To support local development and quick testing without active Firebase credentials, the application implements a **Dual-Mode System** in the services layer:

1.  **Firebase Production Mode**: Activated when environment variables (`VITE_FIREBASE_API_KEY`, etc.) are configured. It routes authentication through Firebase Auth and streams updates using real-time Firestore listeners (`onSnapshot`).
2.  **Mock Fallback Mode**: Activated when keys are missing. It runs entirely on client side:
    *   **Data Store**: Synchronizes orders and menu items inside `localStorage` (prepopulated with demo tacos/beverages).
    *   **Reactivity**: Simulates database listeners using custom browser events (`kantina_mock_auth_change` and `kantina_mock_orders_change`). When a tab places an order or updates status, a window event triggers, causing other open tabs to re-render in real-time.

### Key Service Locations:
*   [firebase.js](file:///c:/Users/boliv/Desktop/Kantina/kantina-mvp/src/services/firebase.js): Handles key configuration validation and exports `auth` and `db` instances.
*   [AuthContext.jsx](file:///c:/Users/boliv/Desktop/Kantina/kantina-mvp/src/context/AuthContext.jsx): Tracks session state, redirecting and syncing mocks.
*   [orders.js](file:///c:/Users/boliv/Desktop/Kantina/kantina-mvp/src/services/orders.js): Encapsulates Firestore listeners and local storage mocks for active orders, completed history, and single order details.
*   [audio.js](file:///c:/Users/boliv/Desktop/Kantina/kantina-mvp/src/utils/audio.js): Synthesizes a premium double-tone notification chime natively using the browser's **Web Audio API** (requires 0 bytes of external file downloads).

---

## 🚀 Implemented Features (Phases 1-5)

### 1. Build Config & Cleanups
*   Added `@vitejs/plugin-react` and compiled configurations for Vite, Tailwind, and PostCSS.
*   Deleted empty redundant files inside `src/utils` and established clean file imports.

### 2. Guarded Route Layouts
*   Established standard routing in `main.jsx` mapping:
    *   `/` (Landing Page)
    *   `/login` (Sleek glassmorphic login screen)
    *   `/dashboard` (Protected Vendor Panel)
    *   `/menu/:vendorId` (Mobile customer ordering menu catalog)
    *   `/order-status/:orderId` (Real-time customer progress tracker timeline)
*   Created `ProtectedRoute.jsx` preventing unauthorized access to the dashboard.

### 3. Vendor Control Panel
*   **Kanban Board**: Active orders divided into scrollable columns (*Por Confirmar*, *En Cocina*, *Listo para Entrega*). Column scroll containers automatically scale to short height viewports.
*   **Oldest vs Newest Sorting**:
    *   *Por Confirmar (Pending)*: Sorted newest-first so new arrivals stay at the top.
    *   *En Cocina / Listo*: Sorted oldest-first (FIFO) so vendors prepare orders that have been waiting the longest.
*   **Audio Alerts & Flashing Tabs**: Synthesizes a notification chime on new order arrivals and flashes the browser window tab title `🔔 (Count) ¡Nuevo Pedido!` to grab attention when the vendor is in another tab.
*   **Navbar Controls**: Volume check button to test speakers, plus a secure logout action.
*   **Menu Editor**: Form panels to add, modify price/description, delete, or toggle availability of dishes.
*   **QR Generator**: Computes, displays, and triggers high-resolution downloads of the customer menu QR Code.

### 4. Client Ordering Catalog
*   Mobile responsive layout with category filters.
*   Floating bag tally summarizing items and costs.
*   Checkout drawer overlay collecting customer name, special notes, and submitting order.

---

## 🖥️ Commands & Testing

### Local Environment
Run the local Vite development server:
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser.

### Verification Build
Test compiling for production release:
```bash
npm run build
```

### Hosting Deployment
Deploy the React bundle directly to Firebase Hosting:
```bash
firebase deploy
```
Live URL: **`https://kantina-f4b66.web.app`**

---

## 🛣️ Next Steps / Backlog
When resuming work, here is what needs to be implemented next:

1.  **Firestore Rules Setup**: Configure `firestore.rules` to allow public read/write to the `/orders` collection (so customers can order and track status), but restrict `/menus` writes and dashboard reading only to authenticated vendors.
2.  **Sound Customization Options**: Allow the vendor to choose different chime alerts (e.g. synth bell, cash register sound, soft ding) from the settings tab.
3.  **PWA Integration**: Configure a Service Worker using Workbox (in Vite) to enable offline caching of the customer menu, allowing the page to load even on poor mobile networks.
4.  **Multi-Vendor Support**: Shift database routes from `/menus/mock-vendor-123` to dynamic entries mapped to the vendor's actual Firebase UID, enabling multiple street vendors to sign up and configure separate menus.
