import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
};

const cartSlice = createSlice({
  name: "cartItem",
  initialState: initialState,
  reducers: {
      handleAddItemCart: (state, action) => {
          console.log("Updating Cart:", action.payload); 
      state.cart = [...action.payload];
    },
  },
});

export const { handleAddItemCart } = cartSlice.actions;
export default cartSlice.reducer;
