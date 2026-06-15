import { baseApi } from './baseApi';

export const customOrdersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTailors: builder.query({
      query: () => '/custom-orders/tailors',
      providesTags: ['Tailors'],
    }),
    createCustomOrder: builder.mutation({
      query: (orderData) => ({
        url: '/custom-orders',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['MyOrders'],
    }),
    getClientCustomOrders: builder.query({
      query: () => '/custom-orders/my',
      providesTags: ['MyOrders'],
    }),
    getTailorCustomOrders: builder.query({
      query: () => '/custom-orders/tailor',
      providesTags: ['TailorsOrders'],
    }),
    updateCustomOrderStatus: builder.mutation({
      query: ({ id, status, note }) => ({
        url: `/custom-orders/${id}/status`,
        method: 'PUT',
        body: { status, note },
      }),
      invalidatesTags: ['TailorsOrders', 'MyOrders'],
    }),
    acceptCustomOrder: builder.mutation({
      query: (id) => ({
        url: `/custom-orders/${id}/accept`,
        method: 'PUT',
      }),
      invalidatesTags: ['TailorsOrders', 'MyOrders', 'OpenOrders'],
    }),
    getOpenCustomOrders: builder.query({
      query: () => '/custom-orders/open',
      providesTags: ['OpenOrders'],
    }),
  }),
});

export const {
  useGetTailorsQuery,
  useCreateCustomOrderMutation,
  useGetClientCustomOrdersQuery,
  useGetTailorCustomOrdersQuery,
  useUpdateCustomOrderStatusMutation,
  useAcceptCustomOrderMutation,
  useGetOpenCustomOrdersQuery,
} = customOrdersApi;
