import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { renewToken } from "../services/auth";

import { RootState, AppDispatch } from "./index";

interface IAuthState {
  initLoading: boolean;

  accessToken: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    nickname: string;
    email: string;
    createdAt: string;
  } | null;
}

export const authInit = () => async (dispatch: AppDispatch) => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    const userString = localStorage.getItem("user");
    if (!refreshToken || !userString) {
      return dispatch(logOut());
    }

    const user: IAuthState["user"] = JSON.parse(userString);

    const data = await renewToken(refreshToken);
    const accessToken: string = data.accessToken;

    dispatch(logIn({ accessToken, refreshToken, user }));
  } catch (err) {
    dispatch(logOut());
  }
};

export const logIn = createAsyncThunk(
  "auth/logIn",
  async (
    logInPayload: {
      accessToken: string;
      refreshToken: string;
      user: IAuthState["user"];
    },
    thunkAPI
  ) => {
    const { accessToken, refreshToken, user } = logInPayload;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));

    thunkAPI.dispatch(autoRenewToken());

    return logInPayload;
  }
);

const autoRenewToken = () => (dispatch: AppDispatch, getState: any) => {
  // Access token auto-renew every 25 minutes
  const renew = async () => {
    const state = getState() as RootState;

    try {
      if (!state.authSlice.isLoggedIn) return;

      const data: {
        accessToken: string;
        error: string | null;
        statusCode: number;
      } = await renewToken(state.authSlice.refreshToken as string);

      if (data.statusCode === 401) return dispatch(logOut());

      if (data.error) throw new Error();

      dispatch(authSlice.actions.updateAccessToken(data.accessToken));

      setTimeout(renew, 25 * 60 * 1000);
    } catch (err) {
      if (!state.authSlice.isLoggedIn) return;
      setTimeout(renew, 30 * 1000);
    }
  };

  setTimeout(renew, 25 * 60 * 1000);
};

export const logOut = () => (dispatch: AppDispatch) => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");

  dispatch(authSlice.actions.resetAuthSlice());
};

export const setUserInfo = (user: IAuthState["user"]) => (dispatch: AppDispatch) => {
  localStorage.setItem("user", JSON.stringify(user));
  dispatch(authSlice.actions.updateUserInfo(user));
};

const initState: IAuthState = {
  initLoading: true,

  isLoggedIn: false,
  accessToken: null,
  refreshToken: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initState,
  reducers: {
    resetAuthSlice: (state) => {
      state.initLoading = false;

      state.isLoggedIn = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
    },

    updateAccessToken: (state, action) => {
      const accessToken: string = action.payload;
      state.accessToken = accessToken;
    },

    updateUserInfo: (state, action) => {
      const user: IAuthState["user"] = action.payload;
      state.user = user;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(logIn.fulfilled, (state, action) => {
      const { accessToken, refreshToken, user } = action.payload;

      state.initLoading = false;

      state.isLoggedIn = true;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.user = user;
    });

    builder.addCase(logIn.pending, (state) => {
      state.initLoading = true;
    });

    builder.addCase(logIn.rejected, (state) => {
      state.initLoading = false;

      state.isLoggedIn = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
    });
  },
});

export default authSlice.reducer;
