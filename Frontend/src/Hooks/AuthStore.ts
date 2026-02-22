import { create } from "zustand";
import type { AuthState } from "../Types/Common.type";
import type { LoginForm } from "../Types/User.type";
import { getProfile, login } from "../Services/CoreService/UserApi.ts";
import { socketConnect, socketDisconnect } from "../Configurations/Socket.ts";
import { isInstructor, isStudent } from "../Helper/CheckRole.ts";
import { getOwnedCourseId } from "../Services/CoreService/CourseApi.ts";
import { getEnrolledCourseId } from "../Services/CoreService/EnrollmentApi.ts";

interface AuthStore {
    auth: AuthState,
    course: number[],
    login: (loginForm: LoginForm) => Promise<void>,
    logout: () => void,
    initializeAuth: () => Promise<void>
}

const getInitialAuthState = (): AuthState => {
    const token = localStorage.getItem("token");
    if (token) {
        return { status: "loading" };
    }
    return { status: "guest" };
};

export const useAuthStore = create<AuthStore>((set) => ({
    auth: getInitialAuthState(),

    course: [],

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

                // CONNECT SOCKET
                socketConnect(response.data.token);

                // Add courseId (INSTRUCTOR: Owned Course, STUDENT: Enrolled Course)
                if (isInstructor(profile.data.role)) {
                    const courseResponse = await getOwnedCourseId();
                    if (courseResponse.success) set({course: courseResponse.data})
                }
                if (isStudent(profile.data.role)) {
                    const courseResponse = await getEnrolledCourseId();
                    if (courseResponse.success) set({course: courseResponse.data})
                }
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
        socketDisconnect(); // DISCONNECT SOCKET
        set({auth: {status: "guest"}});
        set({course: []});
        window.location.href = "/login";
    },

    initializeAuth: async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            set({auth: {status: "guest"}});
            return;
        }

        set({auth: {status: "loading"}});
        try {
            const profile = await getProfile();
            if (profile.success && profile.data) {
                set({auth: {status: "authenticated", user: profile.data}});

                // RECONNECT SOCKET if web reload
                socketConnect(token);

                // Add courseId (INSTRUCTOR: Owned Course, STUDENT: Enrolled Course)
                if (isInstructor(profile.data.role)) {
                    const courseResponse = await getOwnedCourseId();
                    if (courseResponse.success) set({course: courseResponse.data})
                }
                if (isStudent(profile.data.role)) {
                    const courseResponse = await getEnrolledCourseId();
                    if (courseResponse.success) set({course: courseResponse.data})
                }
            } else {
                localStorage.removeItem("token");
                set({auth: {status: "guest"}});
            }
        } catch (error) {
            localStorage.removeItem("token");
            set({auth: {status: "guest"}});
            alert("Login session has expired");
            window.location.href = "/login";
        }
    }
}))