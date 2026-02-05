# 📐 Design & Technical Documentation: Punarchakra

**Version:** 1.0  
**Date:** February 5, 2026  
**Project:** Smart E-Waste Management Ecosystem

---

## 1. Design Decisions & Philosophy

### 🎨 Visual Identity: "Industrial Futurism meets Organic Sustainability"
The design language of Punarchakra is built on a duality between high-tech efficiency and environmental care.
- **Color Strategy:**
    - **Primary:** `Emerald Green (#10B981)` - Represents nature, recycling, and positive action.
    - **Industrial Accent:** `Safety Yellow (#FFD700)` - Used specifically for the "Smart Bin" interface to mimic industrial machinery caution tape and high-visibility zones.
    - **Neutral:** `Slate/Zinc` - Deep dark backgrounds for "Dark Mode" (energy saving aesthetics) and clean whites for readability in "Light Mode".
- **Glassmorphism & Depth:** We utilize semi-transparent layers (`backdrop-blur`) to create hierarchy without clutter. Dashboard cards float above the background, separating content from context.

### 📱 Human-Centric Interface
- **Mobile-First Navigation:** Recognizing that recycling happens "on the go," the primary navigation bar is bottom-fixed on mobile devices, ensuring thumb-reachability for all core actions (Scan, Map, Rewards).
- **Voice-First Accessibility:** Waste disposal often occupies hands. The **Voice Assistant ("Eco-Bot")** allows users to navigate ("Go to Dashboard") or initiate actions ("Scan this") hands-free, improving accessibility for all demographics.
- **Adaptive Kiosk Mode:** The **Smart Bin** page is designed to function as both a mobile web page and a dedicated **Kiosk Interface**. It features large, touch-friendly buttons and clear status indicators (Processing, Accepted, Rejected) readable from a distance.

---

## 2. Core User Flows

### 🔄 The "Recycle-to-Reward" Loop (Primary Journey)
This is the critical path for the application's success:
1.  **Identification:** User opens **AI Scanner** -> Captures image of waste.
2.  **Analysis:** System uses **Groq Vision API** to identify item (e.g., "Lithium Battery") and assess condition.
3.  **Appraisal:** User receives instant feedback: "Acceptable Item (+50 Credits)" or "Rejected (Non E-waste)".
4.  **Disposal:**
    - *Remote:* User finds nearest bin via **Bin Map**.
    - *On-Site:* User interacts with the physical bin (simulated via `/smartBin` route).
5.  **Confirmation:** Kiosk confirms deposit -> Animation interacts with "physical" gate.
6.  **Reward:** Points are instantly credited to User Dashboard -> Impact Chart updates.

### 📶 The Resilient Offline Journey
To ensure reliability in basements or remote bin locations:
1.  **Network Loss:** App detects offline status via `navigator.onLine`.
2.  **Feedback:** Non-intrusive "Offline Mode" banner appears.
3.  **Optimistic UI:** User scans an item -> Data is saved to **LocalStorage Queue**.
4.  **Sync:** Connection restored -> Queue automatically syncs with Backend -> Success notification displayed.

---

## 3. Technical Approach & Architecture

### 🏗️ Full-Stack Architecture
The system follows a decoupled Monorepo structure for clear separation of concerns:
- **Client (Frontend):** **Next.js 15 (App Router)**. Chosen for its Server Components (RSC) capabilities, allowing fast initial loads (critical for maps/dashboards) while maintaining rich client-side interactivity (Framer Motion animations).
- **Server (Backend):** **Node.js + Express**. A robust, stateless REST API handling complex business logic (points calculation, location geospatial queries) and database interactions.

### 🧠 AI & Intelligence Layer
- **Engine:** **Groq SDK** utilizing high-performance LLM Vision models (Llama).
- **Why Groq?** Speed is the priority. Users at a kiosk will not wait 5+ seconds for analysis. Groq provides near-instant inference, making the interaction feel "magical" rather than sluggish.

### 💾 Data Strategy (MongoDB)
- **Users:** Stores Auth profiles, Points balance, and deeply nested "Recycling History" arrays.
- **Bins:** Geospatial indexes (`2dsphere`) allow for efficient "Find nearest bin" queries based on user longitude/latitude.
- **Security:**
    - **JWT (JSON Web Tokens):** Stateless authentication passed via Headers.
    - **Role-Based Access Control (RBAC):** Middleware intercepts requests; only `role: admin` can access `/api/admin/*` routes or see the Admin Dashboard.

### ⚡ Performance Optimizations
- **SSR (Server-Side Rendering):** Dashboard stats are pre-fetched on the server for instant First Contentful Paint (FCP).
- **Code Splitting:** Heavy components like `Leaflet Maps` and `Voice Recognition` are lazily loaded.
- **Asset Optimization:** Next.js Image component prevents layout drift; SVGs are used for icons (`Lucide-React`) to minimize bundle size.
