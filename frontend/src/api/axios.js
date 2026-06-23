import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api/v1",
  withCredentials: true, // sends cookies
});

// Intercept 401 → try to refresh token once
let isRefreshing = false;
let queue = [];

const processQueue = (error) => {
  queue.forEach((p) => (error ? p.reject(error) : p.resolve()));
  queue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    // Only attempt refresh on 401, not on the refresh endpoint itself
    if (
      error.response?.status === 401 &&
      !original._retry &&
      !original.url?.includes("/refresh") &&
      !original.url?.includes("/login") &&
      !original.url?.includes("/verify-otp")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        }).then(() => api(original));
      }

      original._retry = true;
      isRefreshing = true;

      try {
        await api.post("/refresh");
        processQueue(null);
        return api(original);
      } catch (refreshError) {
        processQueue(refreshError);
        // Force logout on failed refresh
        window.dispatchEvent(new Event("auth:logout"));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
