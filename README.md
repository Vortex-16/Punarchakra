# ♻️ Punarchakra - Intelligent E-Waste Management & Recycling Platform

![Punarchakra Banner](https://via.placeholder.com/1200x600/059669/ffffff?text=Punarchakra+|+E-Waste+Revolution)

> **"Turning Old Tech Into New Possibilities"**  
> An AI-powered, gamified, and offline-first ecosystem designed to modernize e-waste collection and recycling.

---

## 📖 Overview

**Punarchakra** is a comprehensive full-stack solution bridging the gap between consumers and e-waste recycling facilities. By leveraging **Groq AI Vision** for waste classification, **IoT simulation** for smart bins, and a **gamified rewards system**, functionality meets sustainability.

The platform relies on a "Human-Centric AI" philosophy, ensuring accessibility through **Voice Commands**, **Multi-language Support** (English, Hindi, Spanish), and a robust **Offline-First** architecture.

## ✨ Key Features

### 🧠 **AI & Smart Automation**
- **AI Vision Scanner**: Instantly detects and classifies e-waste (Laptops, Phones, PCBs, Batteries) using **Llama Vision (via Groq)**.
- **Auto-Pricing Engine**: dynamically estimates scrap value and credit points based on item type and condition.
- **Voice Assistant**: Hands-free navigation and interaction using the Web Speech API ("Find Bins", "Scan QR", "Dark Mode").

### 🚮 **Smart Bin Kiosk Interface**
- **Industrial Design**: A dedicated, high-contrast interface for physical kiosk terminals.
- **Interactive States**: Real-time feedback for "Processing", "Accepted", "Rejected", and "Maintenance" states.
- **Fault Tolerance**: Fully functional **Light & Dark modes** for various lighting conditions.

### 🌍 **Map & Logistics**
- **Interactive Bin Locator**: Leaflet-based maps with custom 3D markers indicating bin fill levels.
- **Optimized Routing**: (Planned) Route suggestions for collectors based on high-priority full bins.

### 🎮 **Gamification & user Dashboard**
- **Impact Charts**: Visual analytics of CO2 saved and total waste recycled.
- **Leaderboards & Challenges**: Community-driven goals to encourage sustainable habits.
- **Rewards Store**: Redeem "Green Credits" for vouchers and products.

### 🛡️ **Admin & Security**
- **Role-Based Access Control (RBAC)**: Secure admin portal for managing bins, users, and logistics.
- **Secure Auth**: Powered by **NextAuth.js v5** with JWT and encrypted sessions.

### 📶 **Resilience**
- **Offline-First Architecture**: Changes are queued locally when offline and synced automatically when connectivity returns.
- **Progressive Enhancement**: Critical features work across varying network speeds.

---

## 🛠️ Technology Stack

### **Frontend (Client)**
| Category | Technologies |
|----------|-------------|
| **Core** | [Next.js 15 (App Router)](https://nextjs.org), [React 19](https://react.dev), TypeScript |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com), [Shadcn UI](https://ui.shadcn.com), CSS Variables |
| **Animation** | [Framer Motion](https://www.framer.com/motion), [GSAP](https://gsap.com) |
| **Maps** | [Leaflet](https://leafletjs.com), React-Leaflet |
| **State** | React Context, Custom Hooks |
| **AI Integration** | Groq SDK (LLM Vision) |

### **Backend (Server)**
| Category | Technologies |
|----------|-------------|
| **Runtime** | [Node.js](https://nodejs.org), [Express](https://expressjs.com) |
| **Database** | [MongoDB](https://www.mongodb.com), Mongoose ODM |
| **Auth** | JWT (JSON Web Tokens), NextAuth.js Integration |
| **Security** | CORS, Helmet, Rate Limiting |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/Vortex-16/punarchakra.git
cd punarchakra
```

### 2. Backend Setup
Navigate to the server directory and install dependencies:
```bash
cd Server
npm install
```
Create a `.env` file in `Server/` with the following:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/punarchakra
JWT_SECRET=your_super_secret_jwt_key
```
Start the backend server:
```bash
npm run dev
# Server running on http://localhost:5000
```

### 3. Frontend Setup
Open a new terminal, navigate to the client directory:
```bash
cd Client
npm install --legacy-peer-deps
```
Create a `.env` file in `Client/` with the following:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key_here
NEXTAUTH_SECRET=your_nextauth_secret_hash
NEXTAUTH_URL=http://localhost:3000
```
Start the frontend development server:
```bash
npm run dev
# Client running on http://localhost:3000
```

---

## 🔑 Default Credentials

**Admin Account:**
- **Email:** `admin@ewaste.com`
- **Password:** `admin123`

**User Account:**
- **Email:** `user@demo.com`
- **Password:** `user123`

*(Note: You can register new users directly from the login page)*

---

## 📚 Documentation

For a deeper dive into the architecture, design choices, and user stories, please refer to:

- **[Design & Technical Documentation](DESIGN_DOC.md)**: Detailed breakdown of the architecture, tech stack decisions, and core user flows.
- **[Design Thinking & Philosophy](DESIGN_THINKING.md)**: Q&A on how we handle trust, accessibility, and scalability.
- **[User Scenarios](USER_SCENARIOS.md)**: Real-world use cases (Student, Elderly, Admin) and edge-case handling.

---

## 📂 Project Structure

```bash
Punarchakra/
├── Client/                 # Next.js Frontend
│   ├── src/
│   │   ├── app/            # App Router Pages (Dashboard, Scan, Map)
│   │   ├── components/     # Reusable UI (SmartBin, VoiceAssistant)
│   │   ├── hooks/          # Custom Logic (useSession, useOffline)
│   │   ├── lib/            # Utilities & Constants
│   │   └── contexts/       # Global State Providers
│   └── public/             # Static Assets (Images, 3D Models)
│
├── Server/                 # Express Backend
│   ├── src/
│   │   ├── controllers/    # Route Logic (Auth, Bins, User)
│   │   ├── models/         # Mongoose Schemas
│   │   ├── routes/         # API Endpoint Definitions
│   │   └── middleware/     # Auth & Error Handling
│   └── config/             # DB Connection
│
└── README.md               # Project Documentation
```

---

## 🤝 Contribution

Contributions are welcome! Please fork the repository and create a pull request for any feature enhancements or bug fixes.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<center>
  <p>Made with 💚 to protect our 🌍</p>
  <p><b>Punarchakra Team © 2026</b></p>
</center>