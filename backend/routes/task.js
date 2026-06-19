import express from "express";
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  assignTask,
  getAllUsers,
  getMyTasks,
  updateTaskStatus,
} from "../controllers/task.js";
import { isAuth } from "../middlewares/isAuth.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

// ── Admin Routes ───────────────────────────────────────────────────────────────
router.post("/tasks", isAuth, isAdmin, createTask);
router.get("/tasks", isAuth, isAdmin, getAllTasks);
router.get("/tasks/:id", isAuth, isAdmin, getTaskById);
router.put("/tasks/:id", isAuth, isAdmin, updateTask);
router.delete("/tasks/:id", isAuth, isAdmin, deleteTask);
router.patch("/tasks/:id/assign", isAuth, isAdmin, assignTask);
router.get("/users", isAuth, isAdmin, getAllUsers);

// ── User Routes ────────────────────────────────────────────────────────────────
router.get("/my-tasks", isAuth, getMyTasks);
router.patch("/my-tasks/:id/status", isAuth, updateTaskStatus);

export default router;
