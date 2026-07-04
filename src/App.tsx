import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/Home/HomePage";
import Login from "./components/auth/login";
import Signup from "./components/auth/signup";
import Profile from "./components/auth/Profile";
import AddWorker from "./pages/admin/AddWorker";
import AdminQueries from "./pages/admin/AdminQuerries";
import UserQueries from "./pages/Queries/UserQuerries";
import WorkerAssignments from "./pages/worker/WorkerAssignments";
import AdminAssignWork from "./pages/admin/AdminAssignWork";
import AdminAssignments from "./pages/admin/AdminAssignments";
import AdminWorkAssignments from "./pages/admin/AdminWorkAssignments";

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user.role !== "admin") {
        return <Navigate to="/" replace />;
      }
    } catch {
      return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
};

const WorkerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user.role !== "worker") {
        return <Navigate to="/" replace />;
      }
    } catch {
      return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/add-worker" element={<AddWorker />} />
          <Route path="/admin-querries-list" element={<AdminQueries />} />
          <Route path="/user-querry" element={<UserQueries />} />
          <Route path="/all-assignments" element={<AdminWorkAssignments />} />

          <Route
            path="/worker/assignments"
            element={
              <WorkerRoute>
                <WorkerAssignments />
              </WorkerRoute>
            }
          />
          <Route
            path="/admin/assign-work"
            element={
              <AdminRoute>
                <AdminAssignWork />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/assignments"
            element={
              <AdminRoute>
                <AdminAssignments />
              </AdminRoute>
            }
          />
          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
