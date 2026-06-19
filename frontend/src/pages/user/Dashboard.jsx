import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyTasks } from "../../api";
import { useAuth } from "../../context/AuthContext";
import TaskCard from "../../components/tasks/TaskCard";

export default function UserDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyTasks()
      .then((res) => setTasks(res.data.tasks))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const todo = tasks.filter((t) => t.status === "todo").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const completed = tasks.filter((t) => t.status === "completed").length;

  const recent = tasks.slice(0, 3);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Hello, {user?.name?.split(" ")[0]} 👋</h2>
        <p style={{ color: "var(--text-secondary)", marginTop: 4 }}>Here's what's on your plate today.</p>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{tasks.length}</div>
          <div className="stat-label">Total tasks</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: "var(--warning)" }}>{todo}</div>
          <div className="stat-label">To do</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: "#2563eb" }}>{inProgress}</div>
          <div className="stat-label">In progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: "var(--success)" }}>{completed}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      <div className="section-header">
        <h2 style={{ fontSize: 16 }}>Recent tasks</h2>
        <Link to="/my-tasks" style={{ fontSize: 13, color: "var(--accent)" }}>View all →</Link>
      </div>

      {loading ? (
        <div className="page-loader"><div className="spinner" /></div>
      ) : recent.length === 0 ? (
        <div className="empty-state">
          <h3>No tasks yet</h3>
          <p>Tasks assigned to you will appear here.</p>
        </div>
      ) : (
        <div className="tasks-grid">
          {recent.map((task) => <TaskCard key={task._id} task={task} />)}
        </div>
      )}
    </div>
  );
}
