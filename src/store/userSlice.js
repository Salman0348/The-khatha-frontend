import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: null,
  isUserProfileUpdated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    clearUserInfo: (state) => {
      state.userInfo = null;
    },
    setUserProfileUpdated: (state) => {
      state.isUserProfileUpdated = true;
    },
    setUserProfileUpdatedDefault: (state) => {
      state.isUserProfileUpdated = false;
    },
  },
});
export const {
  setUserInfo,
  clearUserInfo,
  setUserProfileUpdated,
  setUserProfileUpdatedDefault,
} = userSlice.actions;
export default userSlice.reducer;
