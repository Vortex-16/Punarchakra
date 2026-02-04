# 🌱 Punarchakra - Smart E-Waste Management System

**Punarchakra (E-BIN)** is an intelligent web-based platform that transforms e-waste into value using AI-assisted classification, IoT bin monitoring, and reward-driven recycling. Built with Next.js, Express, MongoDB, and Groq AI Vision.

---

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Implementation Status](#-implementation-status)
- [Environment Configuration](#-environment-configuration)
- [API Documentation](#-api-documentation)
- [What's Next](#-whats-next)

---

## ✨ Features

### ✅ **Implemented Features**

#### 🔐 **Authentication & Authorization**
- **NextAuth.js v5** integration with custom backend
- **Role-based access control**: Admin, User, Developer roles
- **Protected routes** with middleware
- **Session management** with JWT tokens
- **Dynamic UI** adapting to user roles
- Login/Register pages with secure authentication

#### 📊 **Admin Dashboard**
- **Real-time bin statistics** with loading states
- **Interactive charts** (Collection trends, Waste composition)
- **Live bin status map** with dynamic markers
- **Route optimization** for collection trucks
- **System alerts** for maintenance and full bins
- **Dark mode support** with theme toggle
- **Personalized greetings** based on authenticated user

#### 🤖 **AI-Powered Features**
- **Groq AI Vision** integration for waste detection
- **Smart waste classification** using `meta-llama/llama-4-scout-17b-16e-instruct`
- **Product identification** and pricing estimation
- **Multi-modal input**: Camera capture or image upload
- Server-side actions with secure API key handling

#### 🗺️ **Interactive Bin Map**
- **Leaflet.js** integration for map display
- **Real-time bin markers** with status indicators
- **Clustering** for multiple bins in proximity
- **Click-to-view** bin details and fill levels

#### 🎁 **Rewards System**
- Rewards page structure (ready for backend integration)
- Points and achievements tracking UI
- Gamification elements for user engagement

#### 🎨 **UI/UX Excellence**
- **Glassmorphism** and modern design aesthetic
- **Smooth animations** with Framer Motion and GSAP
- **Lenis smooth scroll** for enhanced navigation
- **Responsive design** for all screen sizes
- **Professional color scheme** (Forest Green theme)
- **Accessibility features** and semantic HTML

---

## 🛠️ Tech Stack

### **Frontend (Client)**
- **Framework**: Next.js 16.1.6 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion, GSAP, Anime.js
- **Auth**: NextAuth.js v5
- **UI Components**: Lucide React icons, Recharts
- **Maps**: Leaflet, React Leaflet with clustering
- **AI**: Groq SDK for vision API
- **State Management**: React Context API
- **Theme**: next-themes for dark mode

### **Backend (Server)**
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcryptjs
- **Security**: CORS enabled
- **Logging**: Morgan
- **Development**: Nodemon for hot reload

---

## 📁 Project Structure

```
Punarchakra/
├── Client/                      # Next.js Frontend
│   ├── src/
│   │   ├── app/                 # App Router pages
│   │   │   ├── dashboard/       # Admin dashboard
│   │   │   ├── smartBin/        # AI waste scanner kiosk
│   │   │   ├── scan/            # Mobile scanner
│   │   │   ├── map/             # Bin location map
│   │   │   ├── rewards/         # Rewards & achievements
│   │   │   ├── login/           # Login page
│   │   │   ├── register/        # Registration page
│   │   │   └── home/            # Landing page
│   │   ├── components/          # Reusable components
│   │   │   ├── dashboard/       # Dashboard-specific components
│   │   │   ├── landing/         # Landing page components
│   │   │   └── ui/              # UI primitives
│   │   ├── hooks/               # Custom React hooks
│   │   │   ├── useBins.ts       # Bin data fetching
│   │   │   └── useSession.ts    # Auth session management
│   │   ├── lib/                 # Utilities
│   │   │   └── api.ts           # API client
│   │   ├── types/               # TypeScript definitions
│   │   ├── contexts/            # React contexts
│   │   ├── proxy.ts             # Route protection (Next.js 16)
│   │   └── auth.ts              # NextAuth config
│   └── package.json
│
├── Server/                      # Express.js Backend
│   ├── src/
│   │   ├── config/              # Database config
│   │   ├── controllers/         # Route handlers
│   │   ├── middleware/          # Auth middleware
│   │   ├── models/              # MongoDB schemas
│   │   ├── routes/              # API routes
│   │   └── index.js             # Server entry point
│   ├── seed.js                  # Sample bin data seeder
│   ├── seed-admin.js            # Admin user seeder
│   └── package.json
│
└── README.md                    # This file
```

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ and npm
- MongoDB Atlas account or local MongoDB
- Groq API key (get free from [console.groq.com](https://console.groq.com))

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Punarchakra
   ```

2. **Setup Server**
   ```bash
   cd Server
   npm install
   
   # Create .env file (see Environment Configuration below)
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   
   # Seed admin user (optional)
   npm run seed-admin
   
   # Seed sample bin data (optional)
   npm run seed
   
   # Start server
   npm run dev
   ```
   Server runs on: `http://localhost:5000`

3. **Setup Client**
   ```bash
   cd ../Client
   npm install
   
   # Create .env file (see Environment Configuration below)
   cp .env.example .env
   # Edit .env with your Groq API key and backend URL
   
   # Start development server
   npm run dev
   ```
   Client runs on: `http://localhost:3000`

---

## 📈 Implementation Status

### ✅ **Completed**
- [x] Authentication system with NextAuth.js
- [x] Role-based access control (Admin/User/Developer)
- [x] Route protection middleware
- [x] Admin dashboard with real-time stats
- [x] Bin CRUD APIs (Create, Read, Update, Delete)
- [x] User management APIs
- [x] MongoDB integration with Mongoose
- [x] AI waste detection with Groq Vision
- [x] Interactive bin map with Leaflet
- [x] Dark mode theme toggle
- [x] Responsive UI design
- [x] Smart Bin kiosk interface
- [x] Dynamic user display in sidebar
- [x] Session management with typed hooks
- [x] Loading states and error handling

### 🚧 **In Progress**
- [ ] QR code login for Smart Bin kiosk
- [ ] Rewards backend integration
- [ ] Points calculation system
- [ ] Achievement unlock logic
- [ ] Collection route optimization algorithm

### 📝 **Planned Features**
- [ ] Real-time IoT bin sensors integration
- [ ] WebSocket for live updates
- [ ] Email notifications for full bins
- [ ] Admin user management interface
- [ ] Data export (CSV/PDF reports)
- [ ] Analytics dashboard with trends
- [ ] Mobile app version
- [ ] Multi-language support
- [ ] Payment integration for rewards redemption

---

## 🔧 Environment Configuration

### **Server (.env)**
```env
# MongoDB
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/punarchakra

# JWT
JWT_SECRET=your-super-secret-key-minimum-32-characters-long

# Server
PORT=5000
NODE_ENV=development
```

### **Client (.env)**
```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Groq AI
GROQ_API_KEY=gsk_your_groq_api_key_here

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here
```

---

## 📡 API Documentation

### **Base URL**: `http://localhost:5000/api`

### **Authentication Endpoints**
```
POST /auth/register          # Register new user
POST /auth/login             # Login user
GET  /auth/me                # Get current user (requires auth)
```

### **Bin Management Endpoints**
```
GET    /bins                 # Get all bins
GET    /bins/stats           # Get bin statistics
GET    /bins/:id             # Get single bin
POST   /bins                 # Create new bin (admin only)
PUT    /bins/:id             # Update bin (admin only)
DELETE /bins/:id             # Delete bin (admin only)
```

### **Request/Response Examples**

**Register User**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "user"  // optional, defaults to "user"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Get Bin Stats**
```bash
GET /api/bins/stats
Authorization: Bearer <token>

Response:
{
  "totalBins": 15,
  "activeBins": 12,
  "fullBins": 2,
  "maintenanceBins": 1,
  "avgFillLevel": 58,
  "criticalBins": [
    {
      "_id": "507f...",
      "location": {...},
      "fillLevel": 95,
      "status": "full"
    }
  ]
}
```

---

## 🎯 What's Next

### **Immediate Priorities**
1. **QR Code Authentication**: Implement QR code scanning for smart bin kiosk access
2. **Rewards Backend**: Connect rewards UI to backend points system
3. **Real-time Updates**: WebSocket integration for live bin status
4. **Route Optimization**: Algorithm to optimize collection truck routes

### **Future Enhancements**
- IoT sensor integration (ESP32/Arduino)
- Mobile app (React Native)
- Advanced analytics and predictions
- Community features (leaderboards, challenges)
- Integration with local recycling centers

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👥 Team

**Developed by**: Punarchakra Development Team  
**Contact**: [Add contact information]

---

## 🙏 Acknowledgments

- **Groq** for providing fast AI inference
- **Next.js** team for the amazing framework
- **MongoDB** for the flexible database
- **Leaflet** for the mapping library
- Open source community for all the amazing tools

---

**Made with 💚 for a sustainable future**