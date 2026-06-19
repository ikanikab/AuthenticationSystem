const priorityClass = { low: "badge-low", medium: "badge-medium", high: "badge-high" };
const statusClass = {
  todo: "badge-todo",
  "in-progress": "badge-in-progress",
  completed: "badge-completed",
};

const formatDate = (date) => {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export default function TaskCard({ task, actions }) {
  return (
    <div className="task-card">
      <div className="task-card-header">
        <p className="task-card-title">{task.title}</p>
        <span className={`badge ${priorityClass[task.priority] || "badge-medium"}`}>
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="task-card-desc">{task.description}</p>
      )}

      <div className="task-card-meta">
        <span className={`badge ${statusClass[task.status] || "badge-todo"}`}>
          {task.status}
        </span>
      </div>

      <div className="task-card-footer">
        <span>
          {task.assignedTo ? `Assigned to: ${task.assignedTo.name || "Unknown"}` : "Unassigned"}
        </span>
        {task.dueDate && <span>Due: {formatDate(task.dueDate)}</span>}
      </div>

      {actions && <div style={{ display: "flex", gap: 8, marginTop: 4 }}>{actions}</div>}
    </div>
  );
}
