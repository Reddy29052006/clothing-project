import { baseApi } from './baseApi';

// ── Products API ───────────────────────────────────────────────────────────
// Backend: GET /products, GET /products/:id
// Note: POST /products and PUT /products/:id are admin-only backend routes
// managed directly by admins — no frontend component uses them, removed.

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // Public — browse all products (supports query params: category, featured, limit, page, search)
    getProducts: builder.query({
      query: (params = {}) => ({ url: '/products', params }),
      providesTags: ['Products'],
    }),

    // Public — get single product by ID
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Product', id }],
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
} = productsApi;
