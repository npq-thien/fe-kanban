import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  role: null,
};

const authSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload;
    },
    clearRole: (state) => {
      state.role = null;
    },
  },
});

export const { setRole, clearRole } = authSlice.actions;
export default authSlice.reducer;
