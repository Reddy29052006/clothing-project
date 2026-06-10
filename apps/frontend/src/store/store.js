import { configureStore, combineReducers } from '@reduxjs/toolkit';

import { baseApi } from '../services/baseApi';

// ── Import all injected endpoint files so their reducers register ──────────
import '../services/authApi';
import '../services/productsApi';
import '../services/measurementsApi';
import '../services/ordersApi';
import '../services/feedbackApi';
import '../services/adminApi';

import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

