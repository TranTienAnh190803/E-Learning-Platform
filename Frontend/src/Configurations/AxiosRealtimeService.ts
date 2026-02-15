import axios from "axios";

const axiosRealtimeService = axios.create({
    baseURL: import.meta.env.VITE_REALTIME_SERVICE
});

axiosRealtimeService.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (!config.url?.includes("/public/") && token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosRealtimeService.interceptors.response.use(
    (response) => response,
    (error) => error.response
    
)

export default axiosRealtimeService;