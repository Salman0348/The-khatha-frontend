import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "authentication",
  initialState: {
    user: null,
    status: "idle",
    error: null,
  },
  reducers: {
    statusChange: (state, action) => {
      state.status = action.payload;
    },
    signUpRequest: (state) => {
      state.status = "loading";
    },
    signUpSuccess: (state) => {
      state.status = "signupSucceeded";
    },
    signUpFailure: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    signInRequest: (state) => {
      state.status = "loading";
    },
    signInSuccess: (state) => {
      state.status = "signinSucceeded";
      state.error = null; //if there is error
    },
    signInFailure: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    logOutSuccess: (state) => {
      state.status = "logOutSucceeded";
    },
  },
});

export const {
  statusChange,
  signUpRequest,
  signUpSuccess,
  signUpFailure,
  signInRequest,
  signInSuccess,
  signInFailure,
  logOutSuccess,
} = authSlice.actions;

export default authSlice.reducer;
