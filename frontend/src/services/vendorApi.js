import { baseApi } from './baseApi';

// ── Vendor API ─────────────────────────────────────────────────────────────
// Covers all endpoints under /api/vendor/*
// Token is injected automatically by baseApi prepareHeaders.
// addProduct uses FormData (multipart) for image upload — RTK Query handles
// the Content-Type boundary automatically when body is a FormData instance.

export const vendorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ── Products ──────────────────────────────────────────────────────────

    getVendorProducts: builder.query({
      query: () => '/vendor/products',
      providesTags: ['VendorProducts'],
    }),

    addProduct: builder.mutation({
      query: (formData) => ({
        url: '/vendor/products',
        method: 'POST',
        body: formData,
        formData: true,
      }),
    }),

    updateProduct: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/vendor/products/${id}`,
        method: 'PUT',
        body,
      }),
    }),

    // Orders 

    getVendorOrders: builder.query({
      query: () => '/vendor/orders',
      providesTags: ['VendorOrders'],
    }),

    updateVendorOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/vendor/orders/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['VendorOrders'],
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetVendorProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useGetVendorOrdersQuery,
  useUpdateVendorOrderStatusMutation,
} = vendorApi;
