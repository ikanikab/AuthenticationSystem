import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getMyTasks, updateMyTaskStatus } from "../../api";
import TaskCard from "../../components/tasks/TaskCard";

const STATUSES = ["todo", "in-progress", "completed"];

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getMyTasks()
      .then((res) => setTasks(res.data.tasks))
      .catch(() => toast.error("Failed to load tasks."))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (taskId, status) => {
    try {
      await updateMyTaskStatus(taskId, status);
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status } : t))
      );
      toast.success("Status updated.");
    } catch {
      toast.error("Could not update status.");
    }
  };

  const filtered = filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  return (
    <div>
      <div className="section-header">
        <h2>My Tasks</h2>
        <div style={{ display: "flex", gap: 8 }}>
          {["all", ...STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className="btn btn-sm"
              style={{
                background: filter === s ? "var(--accent)" : "var(--surface)",
                color: filter === s ? "#fff" : "var(--text-secondary)",
                border: filter === s ? "none" : "1px solid var(--border)",
                textTransform: "capitalize",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="page-loader"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <h3>No tasks found</h3>
          <p>{filter === "all" ? "You have no assigned tasks yet." : `No tasks with status "${filter}".`}</p>
        </div>
      ) : (
        <div className="tasks-grid">
          {filtered.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              actions={
                <select
                  className="status-select"
                  value={task.status}
                  onChange={(e) => handleStatusChange(task._id, e.target.value)}
                  style={{ flex: 1 }}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s} style={{ textTransform: "capitalize" }}>
                      {s.replace("-", " ")}
                    </option>
                  ))}
                </select>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
