import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { createTask, updateTask, getTaskById, getAllUsers } from "../../api";

const empty = {
  title: "",
  description: "",
  priority: "medium",
  status: "todo",
  dueDate: "",
  assignedTo: "",
};

export default function TaskForm() {
  const { id } = useParams(); // present = edit mode
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(empty);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllUsers().then((res) => setUsers(res.data.users)).catch(() => {});

    if (isEdit) {
      getTaskById(id)
        .then((res) => {
          const t = res.data.task;
          setForm({
            title: t.title,
            description: t.description || "",
            priority: t.priority,
            status: t.status,
            dueDate: t.dueDate ? t.dueDate.slice(0, 10) : "",
            assignedTo: t.assignedTo?._id || "",
          });
        })
        .catch(() => toast.error("Failed to load task."))
        .finally(() => setFetchLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        ...form,
        assignedTo: form.assignedTo || null,
        dueDate: form.dueDate || undefined,
      };
      if (isEdit) {
        await updateTask(id, payload);
        toast.success("Task updated.");
      } else {
        await createTask(payload);
        toast.success("Task created.");
      }
      navigate("/admin/tasks");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return <div className="page-loader"><div className="spinner" /></div>;
  }

  return (
    <div style={{ maxWidth: 560 }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24 }}>
        {isEdit ? "Edit task" : "Create task"}
      </h2>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Task title"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Optional details about this task"
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div className="form-group">
              <label>Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="todo">To do</option>
                <option value="in-progress">In progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Due date</label>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Assign to</label>
            <select name="assignedTo" value={form.assignedTo} onChange={handleChange}>
              <option value="">— Unassigned —</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/admin/tasks")}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : isEdit ? "Save changes" : "Create task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
