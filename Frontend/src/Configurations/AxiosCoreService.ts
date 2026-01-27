import axios from "axios";
import { useAuthStore } from "../Hooks/AuthStore";

const axiosCoreService = axios.create({
    baseURL: import.meta.env.VITE_CORE_SERVICE
});

axiosCoreService.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (!config.url?.includes("/public/") && token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosCoreService.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            alert("Login session has expired.");
            useAuthStore.getState().logout();
            window.location.href = "/login";
        }

        return error.response
    }
)

export default axiosCoreService;