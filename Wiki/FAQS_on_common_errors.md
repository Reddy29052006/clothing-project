# ❓ 8. FAQs & Troubleshooting

A deep dive into 20 real-world scenarios you might encounter while developing for FitCraft.

---

## 📋 Table of Contents

1. [Tailors creates product but it does not appear](#1-tailors-creates-product-but-it-does-not-appear)
2. [Order status updates but customer sees old status](#2-order-status-updates-but-customer-sees-old-status)
3. [Measurements saved but not attached to order](#3-measurements-saved-but-not-attached-to-order)
4. [Tailors dashboard showing stale data](#4-tailors-dashboard-showing-stale-data)
5. [Image upload succeeds but image not visible](#5-image-upload-succeeds-but-image-not-visible)
6. [Redux auth state lost after refresh](#6-redux-auth-state-lost-after-refresh)
7. [Customer can access tailors page](#7-customer-can-access-tailors-page)
8. [Admin dashboard statistics incorrect](#8-admin-dashboard-statistics-incorrect)
9. [Product update succeeds but UI shows old data](#9-product-update-succeeds-but-ui-shows-old-data)
10. [JWT stored but API returns 401](#10-jwt-stored-but-api-returns-401)
11. [Duplicate products appearing](#11-duplicate-products-appearing)
12. [Order timeline not updating](#12-order-timeline-not-updating)
13. [Measurement form submissions missing fields](#13-measurement-form-submissions-missing-fields)
14. [Deployment failure: Missing environment variables](#14-deployment-failure-missing-environment-variables)
15. [Frontend and backend URL mismatch (CORS)](#15-frontend-and-backend-url-mismatch-cors)
16. [RTK Query cache confusion](#16-rtk-query-cache-confusion)
17. [Vite HMR issues](#17-vite-hmr-issues)
18. [Multer upload failures](#18-multer-upload-failures)
19. [Mongoose validation errors](#19-mongoose-validation-errors)
20. [Port already in use](#20-port-already-in-use)

---

### 1. Tailors creates product but it does not appear

- **Problem:** New products are not visible in the tailors collection after creation.
- **Symptoms:** API returns 201 Success, but the product list remains unchanged until manual refresh.
- **Root Cause:** RTK Query cache invalidation failure. The `createProduct` mutation is missing `invalidatesTags: ['Products']`.
- **Solution:** Add the missing `invalidatesTags` to the mutation in `productsApi.js`.
- **Prevention:** Always pair `providesTags` in queries with `invalidatesTags` in mutations.

---

### 2. Order status updates but customer sees old status

- **Problem:** Order status updates are not reflected in the customer dashboard.
- **Symptoms:** Tailors changes status to "Shipped," but customer dashboard still says "Processing."
- **Root Cause:** The customer's `getOrder` query tag is not being invalidated by the tailors's `updateOrderStatus` mutation.
- **Solution:** Ensure both `tailorsApi` and `ordersApi` use the same tag names (e.g., `'Order'`).
- **Prevention:** Use a shared constant for RTK Query tags across different API slices.

---

### 3. Measurements saved but not attached to order

- **Problem:** Order created successfully, but measurements field is empty.
- **Symptoms:** Customer orders are processed without specific body measurements attached.
- **Root Cause:** Frontend failed to pass `measurementId` in the checkout payload.
- **Solution:** Verify the `createOrder` payload in the network tab. Ensure measurement selection is mandatory.
- **Prevention:** Implement frontend form validation to require measurement selection before checkout.

---

### 4. Tailors dashboard showing stale data

- **Problem:** Tailors dashboard displays stale order data.
- **Symptoms:** New orders don't show up without a refresh.
- **Root Cause:** RTK Query `refetchOnMountOrArgChange` is disabled, and no tags are being invalidated.
- **Solution:** Use tags or set `refetchOnMountOrArgChange: true` for dashboard queries.
- **Prevention:** Enable automatic refetching or tag invalidation for critical dashboard metrics.

---

### 5. Image upload succeeds but image not visible

- **Problem:** 404 error on image URL.
- **Symptoms:** Product images appear as broken icons in the browser.
- **Root Cause:** `VITE_BASE_URL` mismatch or Express static route not defined.
- **Solution:** Ensure `app.use('/uploads', express.static(...))` is in `server.js`.
- **Prevention:** Verify static asset middleware and frontend URL prefixes during environment setup.

---

### 6. Redux auth state lost after refresh

- **Problem:** Automatic logout on page refresh.
- **Symptoms:** User is redirected to login page after refreshing an authenticated view.
- **Root Cause:** Redux not initialized from `localStorage`.
- **Solution:** Check `localStorage` in `initialState` of `authSlice`.
- **Prevention:** Persist the auth token in localStorage and initialize Redux state from it.

---

### 7. Customer can access tailors page

- **Problem:** Improper role-based access.
- **Symptoms:** Customer accounts can access URLs reserved for tailors or admins.
- **Root Cause:** `ProtectedRoute` missing role-check logic.
- **Solution:** Add `roles={['tailors']}` to the route definition.
- **Prevention:** Always use the `roles` prop in `ProtectedRoute` for restricted pages.

---

### 8. Admin dashboard statistics incorrect

- **Problem:** Total sales calculation is wrong.
- **Symptoms:** Admin dashboard shows inaccurate revenue metrics.
- **Root Cause:** Price stored as String in DB instead of Number.
- **Solution:** Use `Number` type in Mongoose schema and cast existing data.
- **Prevention:** Enforce strict Number types for all financial fields in Mongoose models.

---

### 9. Product update succeeds but UI shows old data

- **Problem:** Product update succeeds but UI shows old data.
- **Symptoms:** Changes to product details are not visible immediately after saving.
- **Root Cause:** RTK Query cache tag `{ type: 'Product', id: req.params.id }` not invalidated.
- **Solution:** Add granular tag invalidation to `updateProduct` mutation.
- **Prevention:** Use specific IDs in RTK Query tags to ensure targeted cache updates.

---

### 10. JWT stored but API returns 401

- **Problem:** JWT stored but API returns 401.
- **Symptoms:** User is logged in but all API requests are rejected with Unauthorized.
- **Root Cause:** Missing "Bearer " prefix in Authorization header.
- **Solution:** Fix `prepareHeaders` in `baseApi.js`.
- **Prevention:** Verify that the `Authorization` header follows the Bearer token standard.

---

### 11. Duplicate products appearing

- **Problem:** Duplicate products appearing.
- **Symptoms:** The same item is listed multiple times in the UI.
- **Root Cause:** Missing `key` prop in React map or backend `.find()` returning duplicates.
- **Solution:** Use `product._id` as key. Verify backend aggregation.
- **Prevention:** Always use unique database IDs for React keys and check for query uniqueness.

---

### 12. Order timeline not updating

- **Problem:** Order timeline not updating.
- **Symptoms:** Order status changes but visual bar stays same.
- **Root Cause:** Timeline component using local state instead of props.
- **Solution:** Pass API `status` directly to timeline component.
- **Prevention:** Ensure visual status indicators are driven by server-provided props.

---

### 13. Measurement form submissions missing fields

- **Problem:** Measurement form submissions missing fields.
- **Symptoms:** Only partial body measurement data is saved to the database.
- **Root Cause:** Controller destructuring only specific fields.
- **Solution:** Update `measurementController.js` to handle all incoming fields.
- **Prevention:** Align backend controller destructuring with frontend form data structures.

---

### 14. Deployment failure: Missing environment variables

- **Problem:** Deployment failure: Missing environment variables.
- **Symptoms:** App crashes on Vercel/Render with "MONGO_URI required."
- **Root Cause:** Environment variables are not configured in the production hosting environment.
- **Solution:** Add production secrets to the hosting provider's dashboard.
- **Prevention:** Verify environment variables before deployment via the hosting dashboard.

---

### 15. Frontend and backend URL mismatch (CORS)

- **Problem:** Frontend and backend URL mismatch (CORS).
- **Symptoms:** "Failed to fetch" in browser console.
- **Root Cause:** Port mismatch between `.env` files.
- **Solution:** Ensure both use port 5001/5173 consistently.
- **Prevention:** Standardize development ports in a shared project configuration.

---

### 16. RTK Query cache confusion

- **Problem:** Seeing data from User A while logged in as User B.
- **Symptoms:** RTK Query returns cached data from a previous user session.
- **Root Cause:** RTK Query cache not reset on user logout.
- **Solution:** Clear cache on logout using `api.util.resetApiState()`.
- **Prevention:** Always trigger `resetApiState` during the logout sequence.

---

### 17. Vite HMR issues

- **Problem:** Vite HMR issues.
- **Symptoms:** Code saves but browser doesn't update.
- **Root Cause:** Case-sensitive file naming mismatch in imports.
- **Solution:** Ensure import casing matches file system exactly.
- **Prevention:** Maintain strict casing consistency for all file and directory names.

---

### 18. Multer upload failures

- **Problem:** Multer upload failures.
- **Symptoms:** "Unexpected field" error during file upload.
- **Root Cause:** Form-data key doesn't match Multer `.single('key')`.
- **Solution:** Ensure frontend field name matches backend config.
- **Prevention:** Sync Multer field names between frontend FormData and backend middleware.

---

### 19. Mongoose validation errors

- **Problem:** Mongoose validation errors.
- **Symptoms:** API returns 500 error when saving documents with missing fields.
- **Root Cause:** Required fields missing from frontend payload.
- **Solution:** Add `express-validator` to catch these before Mongoose.
- **Prevention:** Implement robust request validation layers before database interaction.

---

### 20. Port already in use

- **Problem:** Port already in use.
- **Symptoms:** Backend or frontend dev server fails to start with EADDRINUSE.
- **Root Cause:** A previous process is still bound to the required port.
- **Solution:** Kill the process using `lsof` or `netstat`.
- **Prevention:** Ensure clean process termination or use dynamic port assignment.
