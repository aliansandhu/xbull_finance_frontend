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
        const originalRequest = error.config;

        // if (error.response?.status === 401 && !originalRequest._retry) {
        //     originalRequest._retry = true;

        //     try {
        //         const refreshToken = localStorage.getItem("refresh_token");
        //         if (!refreshToken) {
        //             throw new Error("No refresh token available");
        //         }

        //         const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refresh_token: refreshToken });

        //         localStorage.setItem("app_key", data.access_token);
        //         localStorage.setItem("refresh_token", data.refresh_token);

        //         axiosInstance.defaults.headers["Authorization"] = `Bearer ${data.access_token}`;
        //         originalRequest.headers["Authorization"] = `Bearer ${data.access_token}`;

        //         return await axiosInstance(originalRequest); // Ensure promise resolves correctly
        //     } catch (err) {
        //         console.error("Token refresh failed, redirecting to login.");
        //         if(error.response.data.error){
        //             return {err: error.response.data.error}
        //         }
        //         localStorage.clear();
        //         window.location.href = "/login"; // This route uses the /academy path
        //         return Promise.reject(err);
        //     }
        // }

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
