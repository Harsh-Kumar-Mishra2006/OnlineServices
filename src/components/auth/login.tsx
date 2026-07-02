import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Layout from "../layout/layout";
import authService from "../../service/authService";

type UserRole = "user" | "worker" | "admin";

const Login: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>("user");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const roles = [
    {
      id: "user",
      label: "User",
      icon: "👤",
      color: "from-blue-500 to-blue-600",
      placeholder: "Email or Username",
    },
    {
      id: "worker",
      label: "Worker",
      icon: "🔧",
      color: "from-green-500 to-green-600",
      placeholder: "Phone Number",
    },
    {
      id: "admin",
      label: "Admin",
      icon: "🛡️",
      color: "from-purple-500 to-purple-600",
      placeholder: "Email or Username",
    },
  ];

  const getPlaceholder = () => {
    const role = roles.find((r) => r.id === selectedRole);
    return role?.placeholder || "Enter your email, username, or phone";
  };

  const getIdentifierLabel = () => {
    if (selectedRole === "worker") {
      return "Phone Number";
    }
    return "Email or Username";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let loginData: any = { password };

      // For workers, use phone number
      if (selectedRole === "worker") {
        // Check if identifier looks like a phone number (contains digits)
        const cleanedPhone = identifier.replace(/[^0-9]/g, "");
        if (!/^[0-9]{10,15}$/.test(cleanedPhone)) {
          setError("Please enter a valid phone number (10-15 digits)");
          setLoading(false);
          return;
        }
        loginData.phone = cleanedPhone;
      } else {
        // For users and admins, use email or username
        const isEmail = identifier.includes("@");
        if (isEmail) {
          loginData.email = identifier;
        } else {
          loginData.username = identifier;
        }
      }

      // Call login with the credentials object
      const result = await login(loginData);

      if (result.success) {
        // Verify role matches
        const user = authService.getCurrentUser();
        if (user && user.role !== selectedRole) {
          setError(
            `You are logged in as a ${user.role}, not a ${selectedRole}. Please select the correct role.`,
          );
          // Logout and clear
          await authService.logout();
          setLoading(false);
          return;
        }
        navigate("/");
      } else {
        setError(result.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout showFooter={false}>
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-white to-sky-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-sky-500 rounded-2xl shadow-lg shadow-blue-500/30 mb-4">
              <span className="text-3xl">🏠</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back!</h2>
            <p className="text-gray-600 mt-2">
              Sign in to your HomeService account
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3 text-center">
              Select your role
            </p>
            <div className="grid grid-cols-3 gap-3">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id as UserRole)}
                  className={`
                    relative p-4 rounded-xl border-2 transition-all duration-300
                    ${
                      selectedRole === role.id
                        ? `border-transparent bg-gradient-to-r ${role.color} text-white shadow-lg shadow-${role.id === "user" ? "blue" : role.id === "worker" ? "green" : "purple"}-500/30 scale-105`
                        : "border-gray-200 bg-white hover:border-gray-300 hover:scale-105"
                    }
                  `}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl">{role.icon}</span>
                    <span
                      className={`text-sm font-semibold ${selectedRole === role.id ? "text-white" : "text-gray-700"}`}
                    >
                      {role.label}
                    </span>
                  </div>
                  {selectedRole === role.id && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl shadow-blue-500/10 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getIdentifierLabel()}
                </label>
                <input
                  type={selectedRole === "worker" ? "tel" : "text"}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
                  placeholder={getPlaceholder()}
                  required
                />
                {selectedRole === "worker" && (
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the phone number provided by admin
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-sky-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/40 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span className="relative z-10">
                  {loading
                    ? "Signing in..."
                    : `Sign in as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`}
                </span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-blue-500 to-sky-400 transition-transform duration-500 hover:translate-x-0"></div>
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Sign up now
                </Link>
              </p>
            </div>

            {/* Role-specific info */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs text-gray-600 text-center">
                {selectedRole === "user" &&
                  "👤 Access your bookings and manage your profile"}
                {selectedRole === "worker" &&
                  "🔧 Login with your phone number to manage services, availability, and earnings"}
                {selectedRole === "admin" &&
                  "🛡️ Admin dashboard for managing users and services"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
