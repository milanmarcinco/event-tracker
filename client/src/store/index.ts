import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./authSlice";
import eventsReducer from "./eventsSlice";

const store = configureStore({
  reducer: {
    authSlice: authReducer,
    eventsSlice: eventsReducer,
  },
});

export type GetState = typeof store.getState;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
