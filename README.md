# 🧵 FitCraft — Custom-Fit Clothing Platform

FitCraft is a modern, premium web application designed to solve the fashion industry's "fixed size" problem by enabling direct customer-to-tailor garment personalization through precise body measurements.

This repository is organized as a high-performance **Turborepo monorepo** architecture.

---

## ✨ Features

- **Custom-Tailored Fit**: Enter individual body measurements to ensure a perfect garment fit.
- **Product Customization**: Select fabrics, colors, styles, and fits dynamically.
- **Interactive Dashboards**: Tailored dashboards for customers, vendors, and platform administrators.
- **Order Tracking & Feedback**: Track your custom garment from selection to tailoring to delivery.
- **Automated CLI Setup**: Interactive CLI automatically configures local environment variables.

---

## 🛠️ Architecture & Tech Stack

The workspace is structured into standalone, reusable applications using **NPM Workspaces** and **Turborepo**:

```
clothing-project/
├── apps/
│   ├── frontend/     # React (Vite) client application
│   └── backend/      # Express.js API server
├── scripts/
│   └── setup.js      # Interactive environment configurator
├── package.json      # Workspace definitions
└── turbo.json        # Pipeline execution instructions
```

### Stack Details
- **Monorepo Engine**: [Turborepo](https://turbo.build/)
- **Frontend**: React 19, Redux Toolkit, Vite, React Router
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JSON Web Tokens (JWT)

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **NPM**: v10.0.0 or higher

### 2. Setup & Installation
Clone the repository and run `npm install` at the root folder:
```bash
npm install
```
During the installation, a **custom interactive setup CLI** will run. It will guide you through setting up environment variables (`.env`) for both the frontend and backend. You can accept default values by simply pressing **Enter**.

### 3. Run the Application
Start both the API server and the frontend client concurrently:
```bash
npm run dev
```
- **Frontend URL**: [http://localhost:5173](http://localhost:5173)
- **Backend API URL**: [http://localhost:5001](http://localhost:5001)

*(Note: If you run into environment-specific file locking issues due to Windows mapped drives, run `npm run dev:fallback` instead).*

---

## 📖 Documentation

- **Development Guide**: See [HOW_TO_RUN.md](file:///r:/programs/training/clothing-project/HOW_TO_RUN.md) for detailed configuration, local running steps, and parameters.
- **Deployment Guide**: See [DEPLOYMENT.md](file:///r:/programs/training/clothing-project/DEPLOYMENT.md) for hosting the apps on Vercel and Render.
