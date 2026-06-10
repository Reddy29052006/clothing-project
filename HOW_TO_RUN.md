# FitCraft - Custom-Fit Clothing Platform

This is a modern custom-fit clothing platform powered by Turborepo.

## 🚀 How to Run the Project

### 1. Prerequisites
- **Node.js**: v18 or higher

### 2. Environment Setup

#### Backend (apps/backend)
A `.env` file should exist in `apps/backend/` with the following variables:
```env
JWT_SECRET=fitcraft_jwt
JWT_EXPIRES_IN=7d
PORT=5001
CLIENT_URL=http://localhost:5173
GOOGLE_Client_ID=your_google_client_id
GOOGLE_Client_secret=your_google_client_secret
MONGO_URI=mongodb+srv://... or mongodb://localhost:27017/fitcraft
```

#### Frontend (apps/frontend)
A `.env` file should exist in `apps/frontend/` with the following variables:
```env
VITE_API_URL=http://localhost:5001/api
VITE_BASE_URL=http://localhost:5001
```

### 3. Installation
From the root directory, install all dependencies for the entire monorepo:
```bash
npm install
```

### 4. Running the Application
Launch both the frontend and backend in development mode using Turborepo:
```bash
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5001](http://localhost:5001)

## 🛠️ Project Structure
- `apps/backend`: Express.js backend with MongoDB.
- `apps/frontend`: React (Vite) frontend with Redux Toolkit.
