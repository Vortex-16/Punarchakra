# Punarchakra Deployment Guide 🚀

This guide provides instructions for deploying the Punarchakra Smart E-Waste Management System.

## 1. Client Deployment (Vercel)

The frontend is a Next.js application.

1. **Connect to Vercel**: Import your repository into Vercel.
2. **Environment Variables**: Add the following in Vercel Project Settings:
   - `NEXT_PUBLIC_API_URL`: `https://punarchakra.onrender.com/api`
   - `NEXT_PUBLIC_GROQ_API_KEY`: Your Groq API Key
   - `AUTH_SECRET`: `Dozhl/1wYieU06duL60SSNDODBB9Pgaghp6EsbJ8g9Ps=` (This is the NEW name for `NEXTAUTH_SECRET`)
   - `AUTH_TRUST_HOST`: `true` (Crucial for Vercel/proxies)
   - `GOOGLE_CLIENT_ID`: Your Google client ID
   - `GOOGLE_CLIENT_SECRET`: Your Google client secret

> [!WARNING]
> **Important**: Go to Vercel **Settings** > **Deployment Protection** and ensure **"Vercel Authentication"** is **Disabled**. If enabled, it will block your login API with a `401 Unauthorized` error.
3. **Build Settings**:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Install Command: `npm install --legacy-peer-deps`

## 2. Server Deployment (Render / Railway)

The backend is an Express server.

### Recommended: Render.com (Web Service)
1. **New Web Service**: Connect your repo.
2. **Root Directory**: `Server`
3. **Build Command**: `npm install`
4. **Start Command**: `node index.js` (or `npm start`)
5. **Environment Variables**:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure secret string
   - `PORT`: 5000 (Render assigns this automatically, but good to keep)
   - `CLIENT_URL`: Your deployed frontend URL (for CORS)

## 3. Database (MongoDB Atlas)
- Ensure you have a cluster running on MongoDB Atlas.
- **IMPORTANT**: Whitelist `0.0.0.0/0` in Network Access so the deployed server can connect.

## 4. Troubleshooting
- **CORS Errors**: Ensure `CLIENT_URL` in the Server matches your Vercel URL.
- **API Connection**: Ensure `NEXT_PUBLIC_API_URL` in Vercel includes the `/api` suffix.
