import { RootState } from "./";

export const initLoadingSelector = (state: RootState) => state.authSlice.initLoading;

export const isLoggedInSelector = (state: RootState) => state.authSlice.isLoggedIn;

export const refreshTokenSelector = (state: RootState) => state.authSlice.refreshToken;

export const userSelector = (state: RootState) => state.authSlice.user;

export const userIdSelector = (state: RootState) => state.authSlice.user?._id;

export const eventsSliceSelector = (state: RootState) => state.eventsSlice;
