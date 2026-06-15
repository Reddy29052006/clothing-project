import { baseApi } from './baseApi';

// ── Admin API ──────────────────────────────────────────────────────────────
// Backend: GET /admin/stats, GET /admin/orders, GET /admin/tailors,
//          PUT /admin/tailors/:tailorsId/verify
// Note: assignTailors (PUT /admin/orders/:id/assign) removed — no backend route exists.

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

    // All registered tailors
    getAdminTailors: builder.query({
      query: () => '/admin/tailors',
      providesTags: ['Tailors'],
    }),

    // Verify or unverify a tailors account
    verifyTailors: builder.mutation({
      query: ({ tailorsId, isVerified }) => ({
        url: `/admin/tailors/${tailorsId}/verify`,
        method: 'PUT',
        body: { isVerified },
      }),
      invalidatesTags: ['Tailors'],
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetAdminStatsQuery,
  useGetAdminOrdersQuery,
  useGetAdminTailorsQuery,
  useVerifyTailorsMutation,
} = adminApi;
