import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// ── RTK Query Base API ─────────────────────────────────────────────────────
// Single createApi instance; all endpoint files inject into this.
// prepareHeaders automatically attaches the JWT from Redux state.

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  // Global tag types used for cache invalidation across all injected endpoints
  tagTypes: [
    'Auth',
    'Products',
    'Product',
    'Measurements',
    'Orders',
    'MyOrders',
    'Feedback',
    'AdminStats',
    'AdminOrders',
    'Tailors',
    'TailorsProducts',
    'TailorsOrders',
  ],
  endpoints: () => ({}),
});
