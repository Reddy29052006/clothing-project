import { baseApi } from './baseApi';

// ── Orders API (User-facing) ───────────────────────────────────────────────
// Backend: POST /orders, GET /orders/my, GET /orders/:id,
//          PUT /orders/:id/status, PUT /orders/:id/accept
// Tailors order MANAGEMENT endpoints live in tailorsApi.js (/tailors/orders/*)

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

    // Get a single order by ID (user, tailors, admin)
    getOrderById: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Orders', id }],
    }),

    // Tailors/Admin updates production stage — PUT /orders/:id/status
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (_result, _err, { id }) => [
        'Orders', 'TailorsOrders', 'MyOrders', { type: 'Orders', id },
      ],
    }),

    // Tailors accepts or rejects an order — PUT /orders/:id/accept
    acceptOrder: builder.mutation({
      query: ({ id, accepted }) => ({
        url: `/orders/${id}/accept`,
        method: 'PUT',
        body: { accepted },
      }),
      invalidatesTags: ['Orders', 'TailorsOrders'],
    }),

    // Create Razorpay Order on backend
    createCheckoutSession: builder.mutation({
      query: (data) => ({
        url: '/payments/create-checkout-session',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['MyOrders'],
    }),

    // Verify Razorpay payment signature and confirm orders
    confirmPayment: builder.mutation({
      query: (data) => ({
        url: '/payments/confirm',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['MyOrders'],
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
  useCreateCheckoutSessionMutation,
  useConfirmPaymentMutation,
} = ordersApi;
