import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserData = {
  id: number;
  email: string;
  phone: string;
  createdAt: string;
  isAdmin?: boolean;
};

type AuthState = {
  isLoggedIn: boolean;
  user: UserData | null;
  token: string | null;
  login: (token: string, user: UserData) => void;
  logout: () => void;
  setUser: (user: UserData) => void;
  setToken: (token: string) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      token: null,
      login: (token: string, user: UserData) =>
        set({
          isLoggedIn: true,
          token,
          user,
        }),
      logout: () =>
        set({
          isLoggedIn: false,
          token: null,
          user: null,
        }),
      setUser: (user: UserData) =>
        set({
          user,
        }),
      setToken: (token: string) =>
        set({
          token,
        }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
        token: state.token,
      }),
    },
  ),
);
