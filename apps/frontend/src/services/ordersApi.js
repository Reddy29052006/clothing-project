import { baseApi } from './baseApi';

// ── Orders API (User-facing) ───────────────────────────────────────────────
// Backend: POST /orders, GET /orders/my, GET /orders/:id,
//          PUT /orders/:id/status, PUT /orders/:id/accept
// Vendor order MANAGEMENT endpoints live in vendorApi.js (/vendor/orders/*)

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // User places a new order
    createOrder: builder.mutation({
      query: (data) => ({ url: '/orders', method: 'POST', body: data }),
      invalidatesTags: ['MyOrders'],
    }),

    // User views their own order list
    getMyOrders: builder.query({
      query: () => '/orders/my',
      providesTags: ['MyOrders'],
    }),

    // Get a single order by ID (user, vendor, admin)
    getOrderById: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Orders', id }],
    }),

    // Vendor/Admin updates production stage — PUT /orders/:id/status
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (_result, _err, { id }) => [
        'Orders', 'VendorOrders', 'MyOrders', { type: 'Orders', id },
      ],
    }),

    // Vendor accepts or rejects an order — PUT /orders/:id/accept
    acceptOrder: builder.mutation({
      query: ({ id, accepted }) => ({
        url: `/orders/${id}/accept`,
        method: 'PUT',
        body: { accepted },
      }),
      invalidatesTags: ['Orders', 'VendorOrders'],
    }),

  }),
  overrideExisting: false,
});

export const {
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useAcceptOrderMutation,
} = ordersApi;
