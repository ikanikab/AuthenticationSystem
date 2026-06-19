import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllTasks, getAllUsers } from "../../api";

export default function AdminDashboard() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllTasks(), getAllUsers()])
      .then(([tasksRes, usersRes]) => {
        setTasks(tasksRes.data.tasks);
        setUsers(usersRes.data.users);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const todo = tasks.filter((t) => t.status === "todo").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const unassigned = tasks.filter((t) => !t.assignedTo).length;

  const recent = tasks.slice(0, 5);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Admin Dashboard</h2>
        <p style={{ color: "var(--text-secondary)", marginTop: 4 }}>Overview of all tasks and users.</p>
      </div>

      {loading ? (
        <div className="page-loader"><div className="spinner" /></div>
      ) : (
        <>
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
              <div className="stat-value" style={{ color: "var(--accent)" }}>{inProgress}</div>
              <div className="stat-label">In progress</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: "var(--success)" }}>{completed}</div>
              <div className="stat-label">Completed</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{users.length}</div>
              <div className="stat-label">Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: "var(--danger)" }}>{unassigned}</div>
              <div className="stat-label">Unassigned</div>
            </div>
          </div>

          <div className="section-header">
            <h2 style={{ fontSize: 16 }}>Recent tasks</h2>
            <Link to="/admin/tasks" style={{ fontSize: 13, color: "var(--accent)" }}>View all →</Link>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Assigned to</th>
                  <th>Due date</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((task) => (
                  <tr key={task._id}>
                    <td style={{ fontWeight: 500 }}>{task.title}</td>
                    <td><span className={`badge badge-${task.status}`}>{task.status}</span></td>
                    <td><span className={`badge badge-${task.priority}`}>{task.priority}</span></td>
                    <td>{task.assignedTo?.name || <span style={{ color: "var(--text-muted)" }}>Unassigned</span>}</td>
                    <td style={{ color: "var(--text-secondary)" }}>
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))}
                {recent.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: "center", padding: 32, color: "var(--text-muted)" }}>No tasks yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
