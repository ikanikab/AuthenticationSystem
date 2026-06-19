import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Icon = ({ path }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={path} />
  </svg>
);

const ICONS = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  tasks: "M9 11l3 3L22 4 M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11",
  users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  profile: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z",
  logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
  create: "M12 5v14 M5 12h14",
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out.");
    navigate("/login");
  };

  const adminLinks = [
    { to: "/admin/dashboard", label: "Dashboard", icon: ICONS.dashboard },
    { to: "/admin/tasks", label: "All Tasks", icon: ICONS.tasks },
    { to: "/admin/tasks/create", label: "Create Task", icon: ICONS.create },
    { to: "/admin/users", label: "Users", icon: ICONS.users },
  ];

  const userLinks = [
    { to: "/dashboard", label: "Dashboard", icon: ICONS.dashboard },
    { to: "/my-tasks", label: "My Tasks", icon: ICONS.tasks },
    { to: "/profile", label: "Profile", icon: ICONS.profile },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        Task<span>Flow</span>
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <Icon path={link.icon} />
            {link.label}
          </NavLink>
        ))}

        {/* Profile link for admin too */}
        {isAdmin && (
          <NavLink
            to="/profile"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <Icon path={ICONS.profile} />
            Profile
          </NavLink>
        )}
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} style={{ color: "#f87171" }}>
          <Icon path={ICONS.logout} />
          Logout
        </button>
      </div>
    </aside>
  );
}
