import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getAllTasks, deleteTask, getAllUsers, assignTask } from "../../api";

export default function AdminTasks() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignModal, setAssignModal] = useState(null); // task to assign
  const [selectedUser, setSelectedUser] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    Promise.all([getAllTasks(), getAllUsers()])
      .then(([t, u]) => {
        setTasks(t.data.tasks);
        setUsers(u.data.users);
      })
      .catch(() => toast.error("Failed to load data."))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      toast.success("Task deleted.");
    } catch {
      toast.error("Could not delete task.");
    }
  };

  const handleAssign = async () => {
    if (!selectedUser) return;
    setAssigning(true);
    try {
      await assignTask(assignModal._id, selectedUser);
      const assignedUser = users.find((u) => u._id === selectedUser);
      setTasks((prev) =>
        prev.map((t) =>
          t._id === assignModal._id ? { ...t, assignedTo: assignedUser } : t
        )
      );
      toast.success("Task assigned.");
      setAssignModal(null);
      setSelectedUser("");
    } catch {
      toast.error("Could not assign task.");
    } finally {
      setAssigning(false);
    }
  };

  const filtered =
    filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  return (
    <div>
      <div className="section-header">
        <h2>All Tasks</h2>
        <div style={{ display: "flex", gap: 8 }}>
          {["all", "todo", "in-progress", "completed"].map((s) => (
            <button key={s} onClick={() => setFilter(s)} className="btn btn-sm"
              style={{
                background: filter === s ? "var(--accent)" : "var(--surface)",
                color: filter === s ? "#fff" : "var(--text-secondary)",
                border: filter === s ? "none" : "1px solid var(--border)",
                textTransform: "capitalize",
              }}>
              {s}
            </button>
          ))}
          <Link to="/admin/tasks/create" className="btn btn-primary btn-sm">+ Create Task</Link>
        </div>
      </div>

      {loading ? (
        <div className="page-loader"><div className="spinner" /></div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Assigned to</th>
                <th>Due date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((task) => (
                <tr key={task._id}>
                  <td style={{ fontWeight: 500, maxWidth: 220 }}>
                    <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {task.title}
                    </span>
                  </td>
                  <td><span className={`badge badge-${task.status}`}>{task.status}</span></td>
                  <td><span className={`badge badge-${task.priority}`}>{task.priority}</span></td>
                  <td>
                    {task.assignedTo?.name || (
                      <span style={{ color: "var(--text-muted)" }}>Unassigned</span>
                    )}
                  </td>
                  <td style={{ color: "var(--text-secondary)", fontSize: 13 }}>
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—"}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => { setAssignModal(task); setSelectedUser(task.assignedTo?._id || ""); }}
                      >
                        Assign
                      </button>
                      <Link
                        to={`/admin/tasks/${task._id}/edit`}
                        className="btn btn-secondary btn-sm"
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(task._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>
                    No tasks found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Assign Modal */}
      {assignModal && (
        <div className="modal-overlay" onClick={() => setAssignModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Assign task</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: 16, fontSize: 13 }}>
              "{assignModal.title}"
            </p>

            <div className="form-group">
              <label>Select user</label>
              <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                <option value="">— Unassign —</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                ))}
              </select>
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setAssignModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAssign} disabled={assigning}>
                {assigning ? <span className="spinner" /> : "Assign"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
