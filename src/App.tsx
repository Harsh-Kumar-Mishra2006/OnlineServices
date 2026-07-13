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
import AdminAssignWork from "./pages/admin/AdminAssignWork";
import AdminAssignments from "./pages/admin/AdminAssignments";
import AdminWorkAssignments from "./pages/admin/AdminWorkAssignments";
import WorkerAssignmentDetail from "./components/worker/WorkerAssignmentDetail";
import WorkerDashboard from "./components/worker/WorkerDashboard";
import WorkerAssignments from "./components/worker/WorkerAssignments";

// Billing Imports
import AdminBillsList from "./pages/admin/AdminBillsList";
import AdminCreateBill from "./pages/admin/AdminCreateBill";
import AdminBillDetail from "./pages/admin/AdminBillDetail";
import UserBills from "./pages/user/UserBills";
import UserBillDetail from "./pages/user/UserBillDetail";
import UserPayments from "./pages/user/UserPayments";
import UserInitiatePayment from "./pages/user/UserInitiatePayment";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminPaymentDetail from "./pages/admin/AdminPaymentDetail";

// ============= ROUTE PROTECTION COMPONENTS =============

// Protected Route - Any authenticated user
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Admin Route - Only admin users
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

// Worker Route - Only worker users
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
          {/* ============================================================ */}
          {/* PUBLIC ROUTES - Accessible by everyone */}
          {/* ============================================================ */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* ============================================================ */}
          {/* ADMIN ROUTES - Only accessible by admin users */}
          {/* ============================================================ */}
          {/* Worker Management */}
          <Route
            path="/add-worker"
            element={
              <AdminRoute>
                <AddWorker />
              </AdminRoute>
            }
          />
          {/* Query Management */}
          <Route
            path="/admin-querries-list"
            element={
              <AdminRoute>
                <AdminQueries />
              </AdminRoute>
            }
          />
          {/* Assignment Management */}
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
          <Route
            path="/all-assignments"
            element={
              <AdminRoute>
                <AdminWorkAssignments />
              </AdminRoute>
            }
          />
          {/* Billing - Admin */}
          <Route
            path="/admin/bills"
            element={
              <AdminRoute>
                <AdminBillsList />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/bills/create"
            element={
              <AdminRoute>
                <AdminCreateBill />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/bills/:id"
            element={
              <AdminRoute>
                <AdminBillDetail />
              </AdminRoute>
            }
          />
          {/* ============================================================ */}
          {/* USER ROUTES - Only accessible by authenticated users */}
          {/* ============================================================ */}
          {/* User Query Management */}
          <Route
            path="/user-querry"
            element={
              <ProtectedRoute>
                <UserQueries />
              </ProtectedRoute>
            }
          />
          {/* Billing - User */}
          <Route
            path="/user/bills"
            element={
              <ProtectedRoute>
                <UserBills />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/bills/:id"
            element={
              <ProtectedRoute>
                <UserBillDetail />
              </ProtectedRoute>
            }
          />

          {/* ============================================================ */}
          {/* PAYMENT ROUTES */}
          {/* ============================================================ */}
          <Route
            path="/user/payments"
            element={
              <ProtectedRoute>
                <UserPayments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/payments/initiate/:billId"
            element={
              <ProtectedRoute>
                <UserInitiatePayment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/payments"
            element={
              <AdminRoute>
                <AdminPayments />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/payments/:id"
            element={
              <AdminRoute>
                <AdminPaymentDetail />
              </AdminRoute>
            }
          />
          {/* ============================================================ */}
          {/* WORKER ROUTES - Only accessible by worker users */}
          {/* ============================================================ */}
          <Route
            path="/worker/dashboard"
            element={
              <WorkerRoute>
                <WorkerDashboard />
              </WorkerRoute>
            }
          />
          <Route
            path="/worker/assignments"
            element={
              <WorkerRoute>
                <WorkerAssignments />
              </WorkerRoute>
            }
          />
          <Route
            path="/worker/assignment/:id"
            element={
              <WorkerRoute>
                <WorkerAssignmentDetail />
              </WorkerRoute>
            }
          />
          {/* ============================================================ */}
          {/* PROFILE ROUTE - Accessible by all authenticated users */}
          {/* ============================================================ */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          {/* ============================================================ */}
          {/* CATCH ALL - Redirect to home if route not found */}
          {/* ============================================================ */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
