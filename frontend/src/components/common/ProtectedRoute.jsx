import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Shows a spinner while auth is loading
const Loader = () => (
  <div className="page-loader">
    <div className="spinner" style={{ width: 32, height: 32 }} />
  </div>
);

// Requires user to be logged in
export const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  return user ? children : <Navigate to="/login" replace />;
};

// Requires admin role
export const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
};

// Redirects logged-in users away from auth pages
export const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (user) return <Navigate to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"} replace />;
  return children;
};
