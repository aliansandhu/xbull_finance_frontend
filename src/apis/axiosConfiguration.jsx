import axios from "axios";

const API_BASE_URL = 'https://api.xfinancebull.com';
// const API_BASE_URL = 'http://127.0.0.1:8000/';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000000000,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("app_key") || sessionStorage.getItem("app_key");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = "/";
            return Promise.reject(error);
        }

        console.error("API Error:", error.response?.data?.message || error.message);
        return Promise.reject(error);
    }
);

// Axios instance without token authentication
const axiosInstanceWithoutToken = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000000000,
});

axiosInstanceWithoutToken.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", error.response?.data?.message || error.message);
        return Promise.reject(error);
    }
);

export default axiosInstance;
export { axiosInstanceWithoutToken };
