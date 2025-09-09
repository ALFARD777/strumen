import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
	isLoggedIn: boolean;
	user: any | null;
	token: string | null;
	login: (token: string, user: any) => void;
	logout: () => void;
	setUser: (user: any) => void;
	setToken: (token: string) => void;
};

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			isLoggedIn: false,
			user: null,
			token: null,
			login: (token: string, user: any) =>
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
			setUser: (user: any) =>
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
