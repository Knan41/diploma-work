import { apiSlice } from './apiSlice';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  User,
} from '../../types';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
    }),

    getMe: builder.query<User, void>({
      query: () => '/auth/me',
    }),

    deleteAccount: builder.mutation<{ message: string }, { password: string }>({
      query: (body) => ({
        url: '/auth/me',
        method: 'DELETE',
        body,
      }),
    }),

    updateProfile: builder.mutation<User, UpdateProfileRequest>({
      query: (data) => ({
        url: '/auth/profile',
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useUpdateProfileMutation,
  useDeleteAccountMutation,
} = authApi;
