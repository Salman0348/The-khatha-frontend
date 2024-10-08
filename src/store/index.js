import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import groupsReducer from "./groupsSlice";
import currencyReducer from "./CurrencySlice";

const store = configureStore({
  reducer: {
    authentication: authReducer,
    user: userReducer,
    groups: groupsReducer,
    currency: currencyReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default store;
