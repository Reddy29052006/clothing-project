import { baseApi } from './baseApi';

// ── Auth API ───────────────────────────────────────────────────────────────
// Backend: POST /auth/register, POST /auth/login, GET /auth/me

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),

    googleLogin: builder.mutation({
      query: (tokenObj) => ({
        url: '/auth/google',
        method: 'POST',
        body: tokenObj,
      }),
    }),

    completeOnboarding: builder.mutation({
      query: (onboardingData) => ({
        url: '/auth/complete-onboarding',
        method: 'POST',
        body: onboardingData,
      }),
    }),

    getMe: builder.query({
      query: () => '/auth/me',
      providesTags: ['Auth'],
    }),

  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGoogleLoginMutation,
  useCompleteOnboardingMutation,
  useGetMeQuery,
} = authApi;
