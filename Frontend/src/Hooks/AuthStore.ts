import { create } from "zustand";
import type { AuthState } from "../Types/Common.type";
import type { LoginForm } from "../Types/User.type";
import { getProfile, login } from "../Services/CoreService/UserApi.ts";

interface AuthStore {
    auth: AuthState,
    login: (loginForm: LoginForm) => Promise<void>
    logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
    auth: {status: "guest"},

    login: async (loginForm) => {
        set({auth: {status: "loading"}})

        // Call Api Login
        const response = await login(loginForm);
        if (response.success && response.data?.token) {
            localStorage.setItem("token", response.data?.token);
            // Call Api getProfile
            const profile = await getProfile();
            if (profile.success && profile.data) {
                set({auth: {status: "authenticated", user: profile.data}})
            }
            else {
                localStorage.removeItem("token");
                set({auth: {status: "guest"}});
                alert(profile.message);
            }
        }
        else {
            set({auth: {status: "guest"}});
            alert(response.message);
        }
    },

    logout: () => {
        localStorage.removeItem("token");
        set({auth: {status: "guest"}})
    }
}))