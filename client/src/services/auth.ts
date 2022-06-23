import axios from "axios";
import { errorHandler } from "./utils";

const ax = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  timeout: 30 * 1000,
  headers: { "Content-Type": "application/json" },
});

export const register = async (formData: any) => {
  try {
    const res = await ax.post("/auth/register", {
      user: formData,
    });
    return res.data;
  } catch (err) {
    errorHandler(err);
  }
};

export const logIn = async (formData: any) => {
  try {
    const res = await ax.post("/auth/login", {
      user: formData,
    });
    return res.data;
  } catch (err) {
    errorHandler(err);
  }
};

export const renewToken = async (refreshToken: string) => {
  try {
    const res = await ax.post("/auth/renew-token", {
      refreshToken,
    });
    const data = res.data;
    data.statusCode = res.status;
    return data;
  } catch (err) {
    errorHandler(err);
  }
};

export const changePassword = async (formData: any, refreshToken: string) => {
  try {
    const res = await ax.patch("/auth/change-password", {
      user: formData,
      refreshToken,
    });
    return res.data;
  } catch (err) {
    errorHandler(err);
  }
};

export const updateProfile = async (formData: any, refreshToken: string) => {
  try {
    const res = await ax.put("/auth/update-profile", {
      user: formData,
      refreshToken,
    });
    return res.data;
  } catch (err) {
    errorHandler(err);
  }
};

export const logOut = async (refreshToken: string) => {
  try {
    const res = await ax.delete("/auth/logout", {
      data: {
        refreshToken,
      },
    });
    return res.data;
  } catch (err) {
    errorHandler(err);
  }
};

export const logOutAll = async (refreshToken: string) => {
  try {
    const res = await ax.delete("/auth/logout-all", {
      data: {
        refreshToken,
      },
    });
    return res.data;
  } catch (err) {
    errorHandler(err);
  }
};

export const deleteProfile = async (formData: any, refreshToken: string) => {
  try {
    const res = await ax.delete("/auth/delete-profile", {
      data: {
        user: formData,
        refreshToken,
      },
    });
    return res.data;
  } catch (err) {
    errorHandler(err);
  }
};
