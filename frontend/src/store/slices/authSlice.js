import { createSlice } from '@reduxjs/toolkit';

const getInitialState = () => {
  let user = null;
  let token = null;
  try {
    const userStr = localStorage.getItem('fitcraft_auth_user');
    const tokenStr = localStorage.getItem('fitcraft_auth_token');
    if (userStr) user = JSON.parse(userStr);
    if (tokenStr) token = tokenStr;
  } catch (err) {
    console.error('Failed to parse auth from localStorage', err);
  }
  return {
    user,
    token,
    loading: false,
    error: null,
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
      localStorage.setItem('fitcraft_auth_user', JSON.stringify(action.payload.user));
      localStorage.setItem('fitcraft_auth_token', action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem('fitcraft_auth_user');
      localStorage.removeItem('fitcraft_auth_token');
    },
    setAuthLoading: (state, action) => {
      state.loading = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setCredentials, logout, setAuthLoading, clearError } = authSlice.actions;

// ── Selectors 
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => !!state.auth.token;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectIsAdmin = (state) => state.auth.user?.role === 'admin';
export const selectIsVendor = (state) => state.auth.user?.role === 'vendor';
export const selectIsUser = (state) => state.auth.user?.role === 'user';

export default authSlice.reducer;
