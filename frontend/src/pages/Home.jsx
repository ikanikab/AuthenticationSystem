import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#111827",
      backgroundImage:
        "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
      backgroundSize: "24px 24px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      textAlign: "center",
    }}>
      <div style={{ marginBottom: 24 }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 14px",
            borderRadius: 9999,
            background: "rgba(96, 165, 250, 0.1)",
            border: "1px solid rgba(96, 165, 250, 0.2)",
            color: "#60a5fa",
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Task Management
        </span>
      </div>

      <h1 style={{ fontSize: 28, fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 16, maxWidth: 640 }}>
        Organize your work,<br />
        <span style={{ color: "#60a5fa" }}> deliver faster.</span>
      </h1>

      <p style={{ color: "#9ca3af", fontSize: 16, maxWidth: 440, lineHeight: 1.7, marginBottom: 36 }}>
        TaskFlow helps teams manage tasks and track progress, all in one place.
      </p>

      <div style={{ display: "flex", gap: 12 }}>
        <Link to="/register"
          style={{
            background: "#2563eb", color: "#fff", padding: "11px 24px",
            borderRadius: 8, fontWeight: 600, fontSize: 14,
          }}>
          Get started
        </Link>
        <Link to="/login"
          style={{
            background: "rgba(255,255,255,0.08)", color: "#d1d5db",
            padding: "11px 24px", borderRadius: 8, fontWeight: 500, fontSize: 14,
            border: "1px solid rgba(255,255,255,0.12)",
          }}>
          Sign in
        </Link>
      </div>

      <div style={{ marginTop: 64, display: "flex", gap: 40, color: "#6b7280", fontSize: 13 }}>
        {["JWT Auth", "OTP 2FA", "Role-Based Access", "Email Verification", "Secure Authentication"].map((f) => (
          <span key={f} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: "#60a5fa" }}> ★ </span> {f}
          </span>
        ))}
      </div>
    </div>
  );
}
