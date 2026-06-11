# 💻 7. Development Workflow & Coding Standards

Welcome to the development guide for FitCraft. This page outlines our internal standards, onboarding procedures, and best practices to ensure a consistent and secure codebase.

---

## 📋 Table of Contents

- [7.1.1 New Developer Onboarding Guide](#7-1-1-new-developer-onboarding-guide)
- [7.2.1 Monorepo Development Rules](#7-2-1-monorepo-development-rules)
- [7.3.1 Pull Request Requirements](#7-3-1-pull-request-requirements)
- [7.4 Frontend Standards (React 19)](#7-4-frontend-standards-react-19)
- [7.5 Backend Standards (Express)](#7-5-backend-standards-express)
- [7.6.1 Extended Code Review Checklist](#7-6-1-extended-code-review-checklist)
- [7.7.1 Environment Variable Management](#7-7-1-environment-variable-management)
- [7.8.1 RTK Query Best Practices](#7-8-1-rtk-query-best-practices)
- [7.8.2 Redux Best Practices](#7-8-2-redux-best-practices)
- [7.8.3 Security Best Practices](#7-8-3-security-best-practices)

---

## 🚀 7.1.1 New Developer Onboarding Guide

> **Note:** Your primary goal is to understand how our monorepo facilitates seamless communication between the tailors (vendors) and customers.

### ✅ First Day Checklist

- [ ] **Clone the repo:** `git clone <repo-url>`
- [ ] **Install dependencies from root:** `npm install`
- [ ] **Setup Environment:** Run `node scripts/setup.js` to generate `.env` files.
- [ ] **Database:** Ensure you have a local MongoDB or an Atlas URI ready.
- [ ] **Verify:** Run `npm run dev` and log in with the test credentials in `seedData.js`.

### 🔍 Recommended Exploration Order

1.  **Data Layer:** Read `apps/backend/models/` to understand the entity relationships.
2.  **API Bridge:** Explore `apps/frontend/src/services/baseApi.js`.
3.  **Business Logic:** Deep dive into `apps/backend/controllers/user/orderController.js`.
4.  **UI Components:** Examine the `MeasurementFlow.jsx` in the frontend.

---

## 🏗️ 7.2.1 Monorepo Development Rules

We use **NPM Workspaces** to keep the frontend and backend in sync. This prevents "version drift" and allows us to share code/types if needed.

- **Root Responsibility:** The root `package.json` orchestrates the entire system. Do not add UI dependencies here.
- **Isolation:** Each app in `apps/` is a standalone workspace.

```bash
# Commands to run from ROOT:
npm install             # Installs everything
npm run dev             # Starts both apps via concurrently
npm run dev -w frontend # Starts ONLY the frontend
npm run build -w backend # Builds ONLY the backend
```

---

## 📝 7.3.1 Pull Request Requirements

To keep `main` stable, every PR must follow this template:

**Template:**

```markdown
## Description

Short summary of the changes. Link the ticket.

## Impact

- [ ] Database Schema Change?
- [ ] New Environment Variables?
- [ ] Frontend UI Changes? (Screenshots required)

## Testing

How did you verify this? (e.g. "Ran local build", "Verified 5MB upload limit")
```

---

## ⚛️ 7.4 Frontend Standards (React 19)

- **Hooks:** Strictly follow the rules of hooks. No conditional hooks.
- **Components:** Prefer small, focused components. Extract logic to custom hooks.
- **State:** Use `useState` for local UI, `Redux` for global auth/session, and `RTK Query` for all server data.

---

## 🛠️ 7.5 Backend Standards (Express)

- **asyncHandler:** Every controller function **MUST** be wrapped in our `asyncHandler` utility to prevent uncaught promise rejections.
- **Validation:** Use `express-validator` in the route definition to fail early.
- **RBAC:** Always use `protect` before `authorize`.

---

## 📊 7.6.1 Extended Code Review Checklist

| Category               | Verification Points                                                                                 |
| :--------------------- | :-------------------------------------------------------------------------------------------------- |
| **Frontend Review**    | No manual `fetch`? Key props present in maps? Loading/Error states handled? Proper hook usage?      |
| **Backend Review**     | `req.body` validated? `asyncHandler` used? Proper HTTP status codes? No logic in routes?            |
| **Security Review**    | No secrets committed? `JWT_SECRET` used? Role validation (RBAC) correct? Inputs sanitized?          |
| **Performance Review** | No N+1 queries? Unnecessary re-renders avoided? Large lists paginated? Caching tags used correctly? |
| **Database Review**    | Indexes used where appropriate? `.select('-password')` applied? Model relationships respected?      |
| **API Review**         | Consistent JSON response format? Proper error messages? RESTful URI naming followed?                |
| **User Experience**    | Responsive layout? Form validation feedback? Interactive elements provide feedback?                 |
| **Documentation**      | JSDoc for complex logic? `.env.example` updated? README/Wiki updated if needed?                     |

---

## 🔐 7.7.1 Environment Variable Management

- **Local:** Use `.env` for local development. **Never commit this file.**
- **Templates:** Always update `.env.example` when adding a new variable.
- **Frontend:** All variables accessible to the React app **MUST** be prefixed with `VITE_`.
- **Secrets:** Sensitive keys like `JWT_SECRET` and `MONGO_URI` must be kept out of frontend code.
- **Production:** Managed through the CI/CD dashboard (Render/Vercel).

---

## 🔄 7.8.1 RTK Query Best Practices

- **Tags:** Use `providesTags` for queries and `invalidatesTags` for mutations to ensure the UI is always fresh.
- **Optimistic Updates:** Implement `onQueryStarted` for high-frequency actions like "Adding to Cart."
- **No Fetch:** Manual `fetch()` or `axios` calls are prohibited in UI components. Use RTK Query hooks.

---

## 📦 7.8.2 Redux Best Practices

- **Stored:** Auth tokens, current user role, global UI toggles (sidebar).
- **Not Stored:** Large datasets, forms state (use local state), or server results (use RTK Query cache).

---

## 🛡️ 7.8.3 Security Best Practices

- **JWT Handling:** Store authentication tokens in `localStorage`. Ensure tokens are cleared from the client on logout or 401 response.
- **Validation:** Validate every field in `req.body` using `express-validator`. Never trust frontend data.
- **Authorization:** Check roles on every protected route using the `authorize` middleware.
- **Uploads:** Multer must limit file sizes and strictly check file extensions (JPEG, PNG, WEBP).
