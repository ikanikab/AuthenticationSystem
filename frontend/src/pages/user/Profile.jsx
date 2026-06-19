import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { forgotPassword } from "../../api";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [resetLoading, setResetLoading] = useState(false);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out.");
    navigate("/login");
  };

  const handleResetPassword = async () => {
    setResetLoading(true);
    try {
      await forgotPassword({ email: user.email });
      toast.success("Password reset link sent to your email.");
    } catch {
      toast.error("Could not send reset link. Try again later.");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500 }}>
      <div className="card" style={{ textAlign: "center", padding: "36px 24px", marginBottom: 20 }}>
        <div
          className="avatar"
          style={{ width: 72, height: 72, fontSize: 26, margin: "0 auto 16px" }}
        >
          {initials}
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{user?.name}</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>{user?.email}</p>
        <span
          className="badge"
          style={{
            marginTop: 10,
            background: user?.role === "admin" ? "var(--accent-light)" : "#f3f4f6",
            color: user?.role === "admin" ? "var(--accent)" : "var(--text-secondary)",
            textTransform: "capitalize",
          }}
        >
          {user?.role}
        </span>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Account info</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            {[
              ["Name", user?.name],
              ["Email", user?.email],
              ["Role", user?.role],
              ["Member since", user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—"],
            ].map(([label, value]) => (
              <tr key={label} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "11px 0", width: 140, color: "var(--text-secondary)", fontSize: 13 }}>{label}</td>
                <td style={{ padding: "11px 0", fontWeight: 500, fontSize: 14, textTransform: "capitalize" }}>{value || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Account actions */}
      <div className="card" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Account actions</h3>

        <button
          className="btn btn-secondary"
          onClick={handleResetPassword}
          disabled={resetLoading}
          style={{ justifyContent: "center" }}
        >
          {resetLoading ? <span className="spinner" /> : "Reset Password"}
        </button>

        <Link to="/" className="btn btn-secondary" style={{ justifyContent: "center" }}>
          Go to Home
        </Link>

        <button
          className="btn btn-danger"
          onClick={handleLogout}
          style={{ justifyContent: "center" }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}