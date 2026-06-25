# FitCraft - Custom-Fit Clothing Platform

This is a modern custom-fit clothing platform organized as a monorepo workspace.

## 🚀 How to Run the Project

### 1. Prerequisites
- **Node.js**: v18 or higher

### 2. Environment Setup

#### Backend (apps/backend)
A `.env` file should exist in `apps/backend/` with the following variables:
```env
# Server Configuration
PORT=5001
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Authentication
JWT_SECRET=fitcraft_jwt
JWT_EXPIRES_IN=7d

# Database Configuration
MONGO_URI=mongodb+srv://...

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Cloud Image Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Service (SMTP)
FROM_EMAIL=your_verified_email@domain.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_gmail_username@gmail.com
SMTP_PASS=your_gmail_app_password

# Optional: Local Dev Tunneling (Ngrok)
NGROK_AUTHTOKEN=your_ngrok_auth_token
```

##### 🔗 Where to get these API credentials:
* **MongoDB Atlas URI**: Sign up/login at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) to create a free cluster and get your connection string.
* **Razorpay Keys**: Sign up/login at [Razorpay Dashboard](https://dashboard.razorpay.com/), go to **Account & Settings > API Keys** to generate test/live keys.
* **Cloudinary Credentials**: Sign up/login at [Cloudinary Console](https://cloudinary.com/) to find your Cloud Name, API Key, and API Secret on the main dashboard.
* **Gmail SMTP App Password**: Go to your [Google Account Security Settings](https://myaccount.google.com/), enable 2-Step Verification, and generate an [App Password](https://myaccount.google.com/apppasswords) under the "App passwords" section.
* **Ngrok Auth Token**: Sign up/login at [Ngrok Dashboard](https://dashboard.ngrok.com/) and go to the **Your Authtoken** section.

---

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

> [!NOTE]
> Running `npm install` automatically triggers the **interactive environment setup utility** under the hood. It will configure the environment variables (`.env`) for both the frontend and backend with default/custom values automatically.

### 4. Running the Application
Launch both the frontend and backend in development mode concurrently:
```bash
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5001](http://localhost:5001)

### 5. Database Image Migration
If you need to migrate any existing local image entries in the database to the cloud:
```bash
node scripts/migrateImagesToCloud.js
```

## 🛠️ Project Structure
- `apps/backend`: Express.js backend with MongoDB.
- `apps/frontend`: React (Vite) frontend with Redux Toolkit.
