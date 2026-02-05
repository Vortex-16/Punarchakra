# 🌱 Punarchakra - Smart E-Waste Management System

**Punarchakra (E-BIN)** is a next-generation, AI-powered e-waste management platform designed to revolutionize recycling. By combining **Groq AI Vision** for instant waste classification, **IoT-ready smart bins**, and a **gamified rewards system**, we turn old tech into new possibilities.

Built with a **Premium "God-Level" UI/UX** philosophy using **Next.js 15**, **Tailwind CSS 4**, and **Framer Motion**.

---

## ✨ Key Features

### 🚀 **Core Functionality**
- **AI-Powered Waste Scanner**: Instantly identifies e-waste items (phones, cables, batteries) using the **Groq Llama Vision API**.
- **Smart Bin Locator**: Interactive map with **3D custom markers** showing real-time bin status (Normal/Full/Critical).
- **Dashboard & Analytics**: Dynamic charts visualizing personal **CO2 impact** and recycling history using `Recharts`.
- **Gamified Rewards**: Earn points for every item recycled and redeem them for real-world benefits.

### 💎 **Premium UI/UX**
- **Immersive Landing Page**: High-fidelity **3D assets**, glassmorphism effects, and scroll-triggered storytelling (GSAP).
- **Smooth Animations**: "Buttery smooth" transitions and micro-interactions powered by **Framer Motion**.
- **Dark Mode First**: A sleek, modern aesthetic with a system-aware theme toggle (Sun/Moon/Stars animation).

### 🛠️ **Advanced Capabilities (Bonus Features)**
- **Offline Mode**: A robust **Offline-First** architecture with a non-intrusive global banner when connectivity is lost.
- **Voice Assistance**: Hands-free navigation with a floating **AI Voice Assistant** ("Go to Dashboard", "Scan Item").
- **Role-Based Access**: Secure Admin, User, and Developer portals via **NextAuth v5**.

---

## 🛠️ Tech Stack

### **Frontend (Client)**
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4, Glassmorphism
- **Animations**: GSAP, Framer Motion
- **Maps**: Leaflet.js with Custom 3D DivIcons
- **State**: React Context + Custom Hooks
- **AI**: Groq SDK (Vision)

### **Backend (Server)**
- **Runtime**: Node.js & Express
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT & NextAuth Integration

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/punarchakra.git
cd punarchakra

# Install Server Dependencies
cd Server
npm install

# Install Client Dependencies
cd ../Client
npm install --legacy-peer-deps
```

### 2. Environment Setup
Create `.env` files in both directories:

**Server/.env**
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

**Client/.env**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### 🔑 Admin Credentials
Use these to log in and access the Admin Dashboard:

Email: [admin@ewaste.com]
Password: [admin123]


### 3. Run the App
Open two terminals:

**Terminal 1 (Server)**
```bash
cd Server
npm run dev
```

**Terminal 2 (Client)**
```bash
cd Client
npm run dev
```

Visit `http://localhost:3000` to experience the future of recycling!

---

## 📸 Screenshots

| Landing Page | Dashboard | Smart Scan |
|:---:|:---:|:---:|
| *(Add img)* | *(Add img)* | *(Add img)* |

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

---

**Made with 💚 for a sustainable future.**