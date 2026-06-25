# **Tech Stack of the Project**

## **Frontend (React + Vite)**
1. **Framework:** React 19.2.5 with modern hooks support
2. **Build Tool:** Vite 8.0.10 (blazing-fast bundler)
3. **State Management:** Redux Toolkit 2.11.2 + React Redux 9.2.0
4. **Routing:** React Router DOM 7.14.2
5. **UI Icons:** Lucide React 1.14.0
6. **Linting:** ESLint with React plugin support

## **Backend (Node.js + Express)**
1. **Runtime:** Node.js with Express 4.19.2 framework
2. **Database:** MongoDB with Mongoose 8.4.0 ODM (Hosted on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
3. **Authentication:** JWT (jsonwebtoken 9.0.2) for secure token-based auth
4. **Password Security:** bcryptjs 2.4.3 for password hashing
5. **API Middleware:**
   * CORS for cross-origin requests
   * Morgan for HTTP request logging
   * Multer for file uploads (handles temporary files before cloud upload)
   * Express Validator for input validation
6. **Payment Integration:** Razorpay SDK (Configured via [Razorpay Dashboard](https://dashboard.razorpay.com/))
7. **Cloud Media Hosting:** Cloudinary SDK (Configured via [Cloudinary Console](https://cloudinary.com/))
8. **Email Notifications:** SMTP engine with Gmail app passwords (Configured via [Google Security Setting](https://myaccount.google.com/apppasswords))
9. **Development:** Nodemon for auto-restart during development
10. **Environment Management:** dotenv for configuration