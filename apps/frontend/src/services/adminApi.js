import { baseApi } from './baseApi';

// ── Admin API ──────────────────────────────────────────────────────────────
// Backend: GET /admin/stats, GET /admin/orders, GET /admin/vendors,
//          PUT /admin/vendors/:vendorId/verify
// Note: assignVendor (PUT /admin/orders/:id/assign) removed — no backend route exists.

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // Platform-wide stats
    getAdminStats: builder.query({
      query: () => '/admin/stats',
      providesTags: ['AdminStats'],
    }),

    // All orders (supports ?status= filter)
    getAdminOrders: builder.query({
      query: (params) => ({ url: '/admin/orders', params }),
      providesTags: ['AdminOrders'],
    }),

    // All registered vendors
    getAdminVendors: builder.query({
      query: () => '/admin/vendors',
      providesTags: ['Vendors'],
    }),

    // Verify or unverify a vendor account
    verifyVendor: builder.mutation({
      query: ({ vendorId, isVerified }) => ({
        url: `/admin/vendors/${vendorId}/verify`,
        method: 'PUT',
        body: { isVerified },
      }),
      invalidatesTags: ['Vendors'],
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetAdminStatsQuery,
  useGetAdminOrdersQuery,
  useGetAdminVendorsQuery,
  useVerifyVendorMutation,
} = adminApi;
