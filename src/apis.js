import axios from "axios";
import {
  signInFailure,
  signInRequest,
  signInSuccess,
  signUpFailure,
  signUpRequest,
  signUpSuccess,
  statusChange,
} from "./store/authSlice"; //actions

// sign in call
const signInUrl = `${import.meta.env.VITE_API_BASE_URL}/api/v1/login`;

const signIn = (signInCredentials) => async (dispatch) => {
  dispatch(signInRequest());
  try {
    const response = await axios.post(signInUrl, signInCredentials, {
      withCredentials: true,
    });
    if (response.status === 200) {
      dispatch(signInSuccess());
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      if (error.response.data.error === "FIELDS_REQUIRED") {
        dispatch(signInFailure("All fieds are required"));
      } else if (error.response.data.error === "INVALID_CREDENTIALS") {
        dispatch(signInFailure("Invalid email or password"));
      }
    } else if (error.response && error.response.status === 500) {
      dispatch(signInFailure("Internal server error"));
    } else {
      dispatch(signInFailure("Network error or unexpected issue"));
    }
  }
};

//sign up call
const signUpUrl = `${import.meta.env.VITE_API_BASE_URL}/api/v1/signup`;
const signUp = (signUpCredentials) => async (dispatch) => {
  dispatch(signUpRequest());
  try {
    const response = await axios.post(signUpUrl, signUpCredentials);
    if (response.status === 200) {
      dispatch(signUpSuccess());
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      if (error.response.data.error === "FIELDS_REQUIRED") {
        dispatch(signUpFailure("All fieds are required"));
      } else if (error.response.data.error === "NAME_LIMIT_EXCEEDED") {
        dispatch(signInFailure("Username cannot exceed 20 characters"));
      }
    } else if (error.response && error.response.status === 409) {
      if (error.response.data.error === "USER_EXISTS") {
        dispatch(signUpFailure("User with this email already exists"));
      } else if (error.response.data.error === "USER_EXISTS_IN_PENDING_USER") {
        dispatch(statusChange("USER_EXISTS_IN_PENDING_USER"));
      }
    } else if (error.response && error.response.status === 500) {
      dispatch(signUpFailure("Internal server error"));
    } else {
      dispatch(signUpFailure("Network error or unexpected issue"));
    }
  }
};

export { signIn, signUp };
