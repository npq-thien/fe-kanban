import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  role: null,
};

const authSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    clearAuth: (state) => {
      state.role = null;
      state.userId = null;
    },
  },
});

export const { setRole, setUserId, clearAuth } = authSlice.actions;
export default authSlice.reducer;
