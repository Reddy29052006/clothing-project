import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { clearCredentials } from '../store/slices/authSlice';

// ── RTK Query Base API ─────────────────────────────────────────────────────
// Single createApi instance; all endpoint files inject into this.

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token && token !== 'cookie_authenticated') {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    api.dispatch(clearCredentials());
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
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
