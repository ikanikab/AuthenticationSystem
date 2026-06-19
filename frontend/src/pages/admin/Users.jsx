import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAllUsers } from "../../api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllUsers()
      .then((res) => setUsers(res.data.users))
      .catch(() => toast.error("Failed to load users."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="section-header">
        <h2>Users</h2>
        <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          {users.length} total
        </span>
      </div>

      {loading ? (
        <div className="page-loader"><div className="spinner" /></div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className="avatar" style={{ width: 30, height: 30, fontSize: 12 }}>
                        {user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                      </div>
                      <span style={{ fontWeight: 500 }}>{user.name}</span>
                    </div>
                  </td>
                  <td style={{ color: "var(--text-secondary)" }}>{user.email}</td>
                  <td>
                    <span
                      className="badge"
                      style={{
                        background: user.role === "admin" ? "var(--accent-light)" : "#f3f4f6",
                        color: user.role === "admin" ? "var(--accent)" : "var(--text-secondary)",
                      }}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td style={{ color: "var(--text-secondary)", fontSize: 13 }}>
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
