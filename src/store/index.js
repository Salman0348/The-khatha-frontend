import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import groupsReducer from "./groupsSlice";
import currencyReducer from "./CurrencySlice";
import { chatApiSlice } from "./chatApiSlice";

const store = configureStore({
  reducer: {
    authentication: authReducer,
    user: userReducer,
    groups: groupsReducer,
    currency: currencyReducer,

    [chatApiSlice.reducerPath]: chatApiSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(chatApiSlice.middleware),
});
export default store;
