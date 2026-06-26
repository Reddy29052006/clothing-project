import { createSlice } from '@reduxjs/toolkit';

const getInitialState = () => {
  let user = null;
  let token = null;
  try {
    const userStr = localStorage.getItem('fitcraft_auth_user');
    if (userStr) {
      user = JSON.parse(userStr);
      token = 'cookie_authenticated';
    }
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
      state.token = 'cookie_authenticated';
      state.loading = false;
      state.error = null;
      localStorage.setItem('fitcraft_auth_user', JSON.stringify(action.payload.user));
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem('fitcraft_auth_user');
    },
    setAuthLoading: (state, action) => {
      state.loading = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setCredentials, clearCredentials, setAuthLoading, clearError } = authSlice.actions;

export const logout = () => async (dispatch) => {
  try {
    await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch (err) {
    console.error('Failed to log out from backend', err);
  }
  dispatch(clearCredentials());
};

// ── Selectors 
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => !!state.auth.token;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectIsAdmin = (state) => state.auth.user?.role === 'admin';
export const selectIsTailors = (state) => state.auth.user?.role === 'tailors';
export const selectIsUser = (state) => state.auth.user?.role === 'user';
export const selectIsClient = (state) => state.auth.user?.role === 'client';

export default authSlice.reducer;
