import { baseApi } from './baseApi';

// ── Tailors API ─────────────────────────────────────────────────────────────
// Covers all endpoints under /api/tailors/*
// Token is injected automatically by baseApi prepareHeaders.
// addProduct uses FormData (multipart) for image upload — RTK Query handles
// the Content-Type boundary automatically when body is a FormData instance.

export const tailorsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ── Products ──────────────────────────────────────────────────────────

    getTailorsProducts: builder.query({
      query: () => '/tailors/products',
      providesTags: ['TailorsProducts'],
    }),

    addProduct: builder.mutation({
      query: (formData) => ({
        url: '/tailors/products',
        method: 'POST',
        body: formData,
        formData: true,
      }),
    }),

    updateProduct: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/tailors/products/${id}`,
        method: 'PUT',
        body,
      }),
    }),

    // Orders 

    getTailorsOrders: builder.query({
      query: () => '/tailors/orders',
      providesTags: ['TailorsOrders'],
    }),

    updateTailorsOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/tailors/orders/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['TailorsOrders'],
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetTailorsProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useGetTailorsOrdersQuery,
  useUpdateTailorsOrderStatusMutation,
} = tailorsApi;
