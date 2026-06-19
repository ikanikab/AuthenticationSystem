import api from "./axios";

// ── Auth ──────────────────────────────────────────────────────────────────────
export const register = (data) => api.post("/register", data);
export const verifyEmailToken = (token) => api.post(`/verify/${token}`);
export const login = (data) => api.post("/login", data);
export const verifyOtp = (data) => api.post("/verify-otp", data);
export const getMe = () => api.get("/me");
export const refreshAccessToken = () => api.post("/refresh");
export const logout = () => api.post("/logout");
export const forgotPassword = (data) => api.post("/forgot-password", data);
export const resetPassword = (data) => api.post("/reset-password", data);

// ── Admin: Tasks ──────────────────────────────────────────────────────────────
export const getAllTasks = () => api.get("/tasks");
export const getTaskById = (id) => api.get(`/tasks/${id}`);
export const createTask = (data) => api.post("/tasks", data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
export const assignTask = (id, userId) => api.patch(`/tasks/${id}/assign`, { userId });

// ── Admin: Users ──────────────────────────────────────────────────────────────
export const getAllUsers = () => api.get("/users");

// ── User: Tasks ───────────────────────────────────────────────────────────────
export const getMyTasks = () => api.get("/my-tasks");
export const updateMyTaskStatus = (id, status) =>
  api.patch(`/my-tasks/${id}/status`, { status });
