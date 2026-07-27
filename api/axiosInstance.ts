import axios, { InternalAxiosRequestConfig } from "axios";
import { useUserStore } from "@/stores/user/useUserStore";

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "";

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 3000,
    withCredentials: true,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    try {
        const token = useUserStore.getState().token;

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (error) {
        console.error("Interceptor error:", error);
    }

    return config;
});

export default api;