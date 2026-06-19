import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/my-tasks": "My Tasks",
  "/profile": "Profile",
  "/admin/dashboard": "Admin Dashboard",
  "/admin/tasks": "All Tasks",
  "/admin/tasks/create": "Create Task",
  "/admin/users": "Users",
};

export default function DashboardLayout() {
  const { user } = useAuth();
  const location = useLocation();

  const title =
    pageTitles[location.pathname] ||
    (location.pathname.includes("/admin/tasks/") ? "Edit Task" : "Task Details");

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <header className="topbar">
          <h2>{title}</h2>
          <div className="topbar-user">
            <div className="avatar">{initials}</div>
            <span>{user?.name}</span>
            <span style={{ color: "#d1d5db", fontSize: 12 }}>
              {user?.role === "admin" ? "· Admin" : ""}
            </span>
          </div>
        </header>
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
