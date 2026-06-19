import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function VerifyRegistration() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/verify-registration", { email, otp });
      login(res.data.user);
      toast.success(res.data.message);
      navigate(res.data.user.role === "admin" ? "/admin/dashboard" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed.");
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
        <h1>Verify your account</h1>
        <p className="subtitle">Enter the 6-digit code sent to your email.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {!location.state?.email && (
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          )}

          <div className="form-group">
            <label>Verification code</label>
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

          <button className="btn btn-primary" type="submit" disabled={loading || otp.length < 6}
            style={{ width: "100%", justifyContent: "center" }}>
            {loading ? <span className="spinner" /> : "Verify account"}
          </button>
        </form>

        <div className="auth-link"><Link to="/login">← Back to Login</Link></div>
      </div>
    </div>
  );
}