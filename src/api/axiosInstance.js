import axios from "axios";

const BASE_URL = "https://backend.contentgraph.io";

const authApi = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
    async (config) => {
        let accessToken = localStorage.getItem("access_token");

        // Attach access token if exists
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for refresh token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If access token expired
        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refresh_token");

                // Call refresh token API
                const response = await authApi.post("/auth/token/refresh", {
                    refresh: refreshToken,
                });

                const newAccessToken = response.data.access;

                // Save new access token
                localStorage.setItem("access_token", newAccessToken);

                // Update headers
                api.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${newAccessToken}`;

                originalRequest.headers[
                    "Authorization"
                ] = `Bearer ${newAccessToken}`;

                // Retry original request
                return api(originalRequest);
            } catch (refreshError) {
                console.error("Refresh token expired");

                // Clear tokens
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");

                // Redirect to login
                window.location.href = "/signin";

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export { api, authApi };