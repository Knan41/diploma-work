import { apiSlice } from './apiSlice';
import type { ContactMessage, SendMessageRequest } from '../../types';

export const messagesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation<ContactMessage, SendMessageRequest>({
      query: (body) => ({ url: '/messages', method: 'POST', body }),
      invalidatesTags: [{ type: 'Message', id: 'LIST' }],
    }),
    getMessages: builder.query<ContactMessage[], void>({
      query: () => '/messages',
      providesTags: [{ type: 'Message', id: 'LIST' }],
    }),
    deleteMessage: builder.mutation<{ message: string }, number>({
      query: (id) => ({ url: `/messages/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Message', id: 'LIST' }],
    }),
  }),
});

export const { useSendMessageMutation, useGetMessagesQuery, useDeleteMessageMutation } = messagesApi;
