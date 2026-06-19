import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { forgotPassword } from "../../api";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await forgotPassword({ email });
      toast.success(res.data.message);
    } catch {
      // Always proceed to avoid user enumeration
    } finally {
      setLoading(false);
      navigate("/reset-password", { state: { email } });
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>
          ← Back to Home
        </Link>

        <h1>Forgot password?</h1>
        <p className="subtitle">Enter your email and we'll send you a reset code.</p>

        <form onSubmit={handleSubmit}>
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

          <button className="btn btn-primary" type="submit" disabled={loading}
            style={{ width: "100%", justifyContent: "center" }}>
            {loading ? <span className="spinner" /> : "Send reset code"}
          </button>
        </form>

        <div className="auth-link">
          <Link to="/login">← Back to Login</Link>
        </div>
      </div>
    </div>
  );
}