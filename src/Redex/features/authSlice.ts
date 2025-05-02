/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store/store";
import { User, AuthState } from "@/types";

const storage = {
  getItem: (key: string) => {
    if (typeof window === "undefined") return null;
    try {
      const item = localStorage.getItem(key);
      if (!item || item === "undefined") {
        return null;
      }
      return JSON.parse(item);
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return null;
    }
  },
  setItem: (key: string, value: any) => {
    if (typeof window === "undefined") return;
    if (value === undefined || value === null) {
      storage.removeItem(key);
      return;
    }
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  },
  removeItem: (key: string) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing from localStorage:", error);
    }
  },
};

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {

    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      if (action.payload.token) {
        storage.setItem("token", action.payload.token);
      }

      if (action.payload.user) {
        storage.setItem("user", action.payload.user);
      }
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      storage.removeItem("token");
      storage.removeItem("user");
    },

    loadFromStorage: (state) => {
      try {
        const user = storage.getItem("user");
        const token = storage.getItem("token");

        state.user = user;
        state.token = token;
        state.isAuthenticated = Boolean(token);
      } catch (error) {
        console.error("Error loading auth state from storage:", error);
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      }
    },
  },
});

export const { setCredentials, logout, loadFromStorage } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;

export default authSlice.reducer;
