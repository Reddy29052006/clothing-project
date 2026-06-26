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
   - `CLIENT_URL`: Your production frontend URL (e.g., `https://your-app.vercel.app`).
   - `MONGO_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: A secure random string for JWT signatures.
   - `RAZORPAY_KEY_ID`: Razorpay public API Key.
   - `RAZORPAY_KEY_SECRET`: Razorpay private API Key.
   - `RAZORPAY_WEBHOOK_SECRET`: Razorpay Webhook Secret (optional, for signature verification).
   - `CLOUDINARY_CLOUD_NAME`: Cloudinary Cloud Name.
   - `CLOUDINARY_API_KEY`: Cloudinary API Key.
   - `CLOUDINARY_API_SECRET`: Cloudinary API Secret.
   - `FROM_EMAIL`: Sender address for notification emails.
   - `SMTP_HOST`: SMTP host (e.g., `smtp.gmail.com`).
   - `SMTP_PORT`: SMTP port (e.g., `587`).
   - `SMTP_USER`: SMTP authenticated user account.
   - `SMTP_PASS`: SMTP authenticated app-specific password.
   - `CLIENT_ID`: Your Google Cloud Console OAuth Client ID.
   - `CLIENT_SECRET`: Your Google Cloud Console OAuth Client Secret.

##### 🔗 Where to get these API credentials:
* **MongoDB Atlas URI**: Create/get your connection string from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
* **Razorpay Keys**: Obtain these keys from [Razorpay Dashboard Settings](https://dashboard.razorpay.com/).
* **Cloudinary Credentials**: Find Cloud Name, API Key, and Secret in the [Cloudinary Console](https://cloudinary.com/).
* **SMTP Auth Passwords**: If using Google Gmail, generate an App Password in [Google Account Security Settings](https://myaccount.google.com/apppasswords).
* **Google OAuth Credentials**: Obtain the Client ID and Client Secret from the [Google Cloud Console](https://console.cloud.google.com/apis/credentials). See the step-by-step setup instructions in [Wiki: How to Get APIs](file:///r:/programs/training/clothing-project/Wiki/GET_APIS.md).

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
   - `VITE_API_URL`: Your production API endpoint (e.g., `https://your-api.onrender.com/api`).
   - `VITE_BASE_URL`: Your production base API server endpoint (e.g., `https://your-api.onrender.com`).
   - `VITE_GOOGLE_CLIENT_ID`: Your Google Cloud Console OAuth Client ID.

---

## 3. Production Checklist
- [ ] **CORS**: Ensure `CLIENT_URL` in the Render environment variables matches the exact Vercel deployment domain.
- [ ] **Cloud-First Asset Management**: Verify Cloudinary credentials are set to ensure that tailors' image uploads are pushed directly to the CDN and no local files accumulate.
- [ ] **JWT**: Use a strong, secure, generated `JWT_SECRET`.
- [ ] **Testing**: Run `npm run build` locally to ensure no compilation errors before git pushing.
- [ ] **HTTPS**: Both Render and Vercel provide SSL/TLS encryption by default.
