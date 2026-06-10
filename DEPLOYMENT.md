# 🚀 Deployment Guide

This project is structured as a monorepo and is ready to be deployed to **Render** (Backend) and **Vercel** (Frontend).

## 1. Backend: Render (Express API)

Render is excellent for hosting the Node.js API.

### Step-by-Step Deployment:
1. **New Web Service**: Connect your GitHub repository.
2. **Root Directory**: `apps/backend`
3. **Runtime**: `Node`
4. **Build Command**: `npm install`
5. **Start Command**: `npm start`
6. **Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `5001`
   - `MONGO_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: A secure random string.
   - `CLIENT_URL`: Your production frontend URL (e.g., `https://your-app.vercel.app`).
   - `GOOGLE_Client_ID`: Google OAuth Client ID.
   - `GOOGLE_Client_secret`: Google OAuth Client Secret.

---

## 2. Frontend: Vercel (React + Vite)

Vercel is the preferred choice for the React frontend.

### Step-by-Step Deployment:
1. **New Project**: Connect your GitHub repository.
2. **Root Directory**: `apps/frontend`
3. **Framework Preset**: `Vite`
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. **Environment Variables**:
   - `VITE_API_URL`: Your Render API URL (e.g., `https://your-api.onrender.com/api`).
   - `VITE_BASE_URL`: Your Render API Base URL (e.g., `https://your-api.onrender.com`).

---

## 3. Production Checklist
- [ ] **CORS**: Ensure `CLIENT_URL` in the API matches the Vercel domain.
- [ ] **JWT**: Use a secure `JWT_SECRET`.
- [ ] **Database**: Use a production-grade MongoDB Atlas cluster.
- [ ] **Testing**: Run `npm run build` locally to ensure no compilation errors.
- [ ] **HTTPS**: Both Render and Vercel provide SSL by default.
