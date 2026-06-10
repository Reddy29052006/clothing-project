import { createSlice } from '@reduxjs/toolkit';

const getInitialState = () => {
  let items = [];
  try {
    const itemsStr = localStorage.getItem('fitcraft_cart_items');
    if (itemsStr)
      items = JSON.parse(itemsStr);
  } catch (err) {
    console.error('Failed to parse cart from localStorage', err);
  }
  return { items };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: getInitialState(),
  reducers: {
    addItem: (state, action) => {
      const item = action.payload;
      const idx = state.items.findIndex(
        (i) =>
          i.productId === item.productId &&
          i.selectedFabric === item.selectedFabric &&
          i.selectedColor === item.selectedColor
      );
      if (idx !== -1) {
        state.items[idx] = item;
      } else {
        state.items.push(item);
      }
      localStorage.setItem('fitcraft_cart_items', JSON.stringify(state.items));
    },

    removeItem: (state, action) => {
      state.items.splice(action.payload, 1);
      localStorage.setItem('fitcraft_cart_items', JSON.stringify(state.items));
    },

    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('fitcraft_cart_items');
    },
  },
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;

//  Selectors 
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) => state.cart.items.length;
export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

export default cartSlice.reducer;
