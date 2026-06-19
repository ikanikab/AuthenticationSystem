import { Task } from "../models/Task.js";
import { User } from "../models/User.js";
import TryCatch from "../middlewares/TryCatch.js";
import sanitize from "mongo-sanitize";

// Admin: Create a task
export const createTask = TryCatch(async (req, res) => {
  const sanitizedBody = sanitize(req.body);
  const { title, description, priority, dueDate, assignedTo } = sanitizedBody;

  if (!title) {
    return res.status(400).json({ message: "Title is required." });
  }

  // If assignedTo provided, verify user exists
  if (assignedTo) {
    const userExists = await User.findById(assignedTo);
    if (!userExists) {
      return res.status(404).json({ message: "Assigned user not found." });
    }
  }

  const task = await Task.create({
    title,
    description,
    priority,
    dueDate,
    assignedTo: assignedTo || null,
    createdBy: req.user._id,
  });

  res.status(201).json({ message: "Task created successfully.", task });
});

// Admin: Get all tasks
export const getAllTasks = TryCatch(async (req, res) => {
  const tasks = await Task.find()
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

  res.json({ tasks });
});

// Admin: Get single task
export const getTaskById = TryCatch(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");

  if (!task) return res.status(404).json({ message: "Task not found." });

  res.json({ task });
});

// Admin: Edit task
export const updateTask = TryCatch(async (req, res) => {
  const sanitizedBody = sanitize(req.body);
  const { title, description, priority, status, dueDate, assignedTo } =
    sanitizedBody;

  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found." });

  if (assignedTo) {
    const userExists = await User.findById(assignedTo);
    if (!userExists) {
      return res.status(404).json({ message: "Assigned user not found." });
    }
  }

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (priority !== undefined) task.priority = priority;
  if (status !== undefined) task.status = status;
  if (dueDate !== undefined) task.dueDate = dueDate;
  if (assignedTo !== undefined) task.assignedTo = assignedTo || null;

  await task.save();

  res.json({ message: "Task updated successfully.", task });
});

// Admin: Delete task
export const deleteTask = TryCatch(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found." });

  await task.deleteOne();

  res.json({ message: "Task deleted successfully." });
});

// Admin: Assign task to user
export const assignTask = TryCatch(async (req, res) => {
  const { userId } = req.body;
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found." });

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found." });

  task.assignedTo = userId;
  await task.save();

  res.json({ message: `Task assigned to ${user.name}.`, task });
});

// Admin: Get all users
export const getAllUsers = TryCatch(async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json({ users });
});

// User: Get my assigned tasks
export const getMyTasks = TryCatch(async (req, res) => {
  const tasks = await Task.find({ assignedTo: req.user._id })
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

  res.json({ tasks });
});

// User: Update task status only
export const updateTaskStatus = TryCatch(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ["todo", "in-progress", "completed"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value." });
  }

  const task = await Task.findOne({
    _id: req.params.id,
    assignedTo: req.user._id,
  });

  if (!task) {
    return res
      .status(404)
      .json({ message: "Task not found or not assigned to you." });
  }

  task.status = status;
  await task.save();

  res.json({ message: "Task status updated.", task });
});