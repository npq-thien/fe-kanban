import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  role: null,
  displayName: null,
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
    setDisplayName: (state, action) => {
      state.displayName = action.payload;
    },
    clearAuth: (state) => {
      state.role = null;
      state.userId = null;
      state.displayName = null;
    },
  },
});

export const { setRole, setUserId, setDisplayName, clearAuth } =
  authSlice.actions;
export default authSlice.reducer;
