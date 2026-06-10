import { baseApi } from './baseApi';

// ── Measurements API ───────────────────────────────────────────────────────
// Backend: POST /measurements, GET /measurements/me
// Note: GET /measurements/history exists on backend but no component uses it.
// Note: POST /measurements/calculate exists but calculation is done client-side
// in utils/measurementCalc.js — server endpoint not needed.

export const measurementsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // Save user measurements (creates or updates)
    saveMeasurement: builder.mutation({
      query: (data) => ({ url: '/measurements', method: 'POST', body: data }),
      invalidatesTags: ['Measurements'],
    }),

    // Get the current user's saved measurements
    getMyMeasurement: builder.query({
      query: () => '/measurements/me',
      providesTags: ['Measurements'],
    }),

  }),
  overrideExisting: false,
});

export const {
  useSaveMeasurementMutation,
  useGetMyMeasurementQuery,
} = measurementsApi;
