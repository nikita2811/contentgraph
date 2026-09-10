import axios from "axios";

const BASE_URL = "https://backend.contentgraph.io";

const authApi = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

const api = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

// --- Single-flight refresh state ---
let isRefreshing = false;
let refreshPromise = null;
let queue = []; // requests waiting on the current refresh

function processQueue(error, token = null) {
    queue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve(token);
    });
    queue = [];
}

// Request interceptor
api.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem("access_token");
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

        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        // Never try to refresh on the refresh call itself,
        // or on the login endpoint
        if (originalRequest.url?.includes("/auth/token/refresh")) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        // If a refresh is already happening, queue this request
        // instead of firing a second refresh call
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                queue.push({ resolve, reject });
            }).then((newAccessToken) => {
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            }).catch((err) => Promise.reject(err));
        }

        isRefreshing = true;

        refreshPromise = (async () => {
            try {
                const refreshToken = localStorage.getItem("refresh_token");
                if (!refreshToken) throw new Error("No refresh token");

                const response = await authApi.post("/auth/token/refresh", {
                    refresh: refreshToken,
                });

                const newAccessToken = response.data.access;
                localStorage.setItem("access_token", newAccessToken);

                api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

                processQueue(null, newAccessToken);
                return newAccessToken;
            } catch (refreshError) {
                console.error("Refresh token expired");
                processQueue(refreshError, null);

                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                // window.location.href = "/signin";

                throw refreshError;
            } finally {
                isRefreshing = false;
                refreshPromise = null;
            }
        })();

        try {
            const newAccessToken = await refreshPromise;
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
        } catch (err) {
            return Promise.reject(err);
        }
    }
);

export { api, authApi };