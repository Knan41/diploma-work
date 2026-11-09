import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types';
import type { RootState } from '../store';
import { isTokenExpired } from '../../utils/token';

interface AuthState {
  user: User | null;
  token: string | null;
}

// Sayt açılanda token müddəti bitibsə, giriş avtomatik silinir
const storedToken = localStorage.getItem('token');
const tokenExpired = !!storedToken && isTokenExpired(storedToken);
if (tokenExpired) {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

const initialState: AuthState = {
  user: tokenExpired
    ? null
    : (() => {
        try {
          const stored = localStorage.getItem('user');
          return stored ? (JSON.parse(stored) as User) : null;
        } catch {
          return null;
        }
      })(),
  token: tokenExpired ? null : storedToken,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => !!state.auth.token;
export const selectIsAdmin = (state: RootState) =>
  state.auth.user?.role === 'admin';

export default authSlice.reducer;
