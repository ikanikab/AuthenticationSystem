import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { PrivateRoute, AdminRoute, PublicRoute } from "./components/common/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";

// Pages
import Home from "./pages/Home";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import VerifyRegistration from "./pages/auth/VerifyRegistration";
import VerifyOtp from "./pages/auth/VerifyOtp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import UserDashboard from "./pages/user/Dashboard";
import MyTasks from "./pages/user/MyTasks";
import Profile from "./pages/user/Profile";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminTasks from "./pages/admin/Tasks";
import TaskForm from "./pages/admin/TaskForm";
import AdminUsers from "./pages/admin/Users";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              fontFamily: "Inter, sans-serif",
              fontSize: 14,
              borderRadius: 8,
              boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
            },
          }}
        />

        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />

          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/verify-otp" element={<PublicRoute><VerifyOtp /></PublicRoute>} />
          <Route path="/verify-registration" element={<PublicRoute><VerifyRegistration /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
          <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />

          {/* User routes */}
          <Route element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/my-tasks" element={<MyTasks />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Admin routes */}
          <Route element={<AdminRoute><DashboardLayout /></AdminRoute>}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/tasks" element={<AdminTasks />} />
            <Route path="/admin/tasks/create" element={<TaskForm />} />
            <Route path="/admin/tasks/:id/edit" element={<TaskForm />} />
            <Route path="/admin/users" element={<AdminUsers />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
