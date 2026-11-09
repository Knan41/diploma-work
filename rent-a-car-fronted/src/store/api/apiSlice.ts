import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import toast from 'react-hot-toast';
import i18n from '../../i18n';
import { logout } from '../slices/authSlice';

// Backend ünvanı: internetə qoyanda VITE_API_URL ilə verilir (məs. https://rentcar.onrender.com/api)
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Token etibarsızdırsa və ya vaxtı bitibsə (7 gün), istifadəçi avtomatik çıxış edir
const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  const data = result.error?.data as { code?: string } | undefined;
  if (result.error?.status === 401 && data?.code === 'AUTH' && localStorage.getItem('token')) {
    api.dispatch(logout());
    api.dispatch({ type: 'api/resetApiState' });
    toast.error(i18n.t('auth.sessionExpired'));
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Car', 'Booking', 'User', 'Stats', 'Message', 'Category'],
  endpoints: () => ({}),
});
