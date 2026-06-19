import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { resetPassword } from "../../api";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword({ email, otp, password });
      toast.success(res.data.message);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed. The code may have expired.");
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

        <h1>Reset your password</h1>
        <p className="subtitle">Enter the code sent to your email and choose a new password.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {!location.state?.email && (
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Reset code</label>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="6-digit code"
              inputMode="numeric"
              maxLength={6}
              required
              style={{ fontSize: 22, letterSpacing: "0.2em", textAlign: "center" }}
            />
          </div>

          <div className="form-group">
            <label>New password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 characters"
              required
              minLength={8}
            />
          </div>

          <div className="form-group">
            <label>Confirm password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat password"
              required
            />
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}
            style={{ width: "100%", justifyContent: "center" }}>
            {loading ? <span className="spinner" /> : "Reset password"}
          </button>
        </form>

        <div className="auth-link">
          <Link to="/login">← Back to Login</Link>
        </div>
      </div>
    </div>
  );
}