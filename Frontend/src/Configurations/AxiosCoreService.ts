import axios from "axios";

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
    (error) => error.response
    
)

export default axiosCoreService;