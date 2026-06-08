import { baseApi } from './baseApi';

export const feedbackApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    submitFeedback: builder.mutation({
      query: (data) => ({ url: '/feedback', method: 'POST', body: data }),
      invalidatesTags: ['Feedback'],
    }),

    getMyFeedback: builder.query({
      query: () => '/feedback/my',
      providesTags: ['Feedback'],
    }),

  }),
  overrideExisting: false,
});

export const { useSubmitFeedbackMutation, useGetMyFeedbackQuery } = feedbackApi;
