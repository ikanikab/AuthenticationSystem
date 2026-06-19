import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { login } from "../../api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form);
      toast.success("OTP sent to your email!");
      // Pass email via state so verify-otp page can pre-fill it
      navigate("/verify-otp", { state: { email: form.email } });
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>
          ← Back to Home
        </Link>
        <h1>Welcome back</h1>
        <p className="subtitle">Sign in to your TaskFlow account.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="jane@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Your password"
              required
            />
          </div>

          <div style={{ textAlign: "right", marginTop: -8, marginBottom: 16 }}>
            <Link to="/forgot-password"
              style={{ fontSize: 13, color: "var(--accent)" }}>
              Forgot password?
            </Link>
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}
            style={{ width: "100%", justifyContent: "center" }}>
            {loading ? <span className="spinner" /> : "Sign in"}
          </button>
        </form>

        <div className="auth-link">
          Don't have an account? <Link to="/register">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
