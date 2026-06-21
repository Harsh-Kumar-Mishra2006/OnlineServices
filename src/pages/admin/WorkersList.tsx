import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/layout";
import authService from "../../service/authService";
import { type Worker } from "../../types";

const WorkersList: React.FC = () => {
  const navigate = useNavigate();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterService, setFilterService] = useState("all");

  useEffect(() => {
    fetchWorkers();
  }, []);

  useEffect(() => {
    filterWorkers();
  }, [searchTerm, filterStatus, filterService, workers]);

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const response = await authService.getAllWorkersForAdmin();
      if (response.success) {
        setWorkers(response.data || []);
        setFilteredWorkers(response.data || []);
      } else {
        setError(response.error || "Failed to fetch workers");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const filterWorkers = () => {
    let filtered = [...workers];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (worker) =>
          worker.name.toLowerCase().includes(term) ||
          worker.email.toLowerCase().includes(term) ||
          worker.service_type.toLowerCase().includes(term) ||
          worker.address?.city?.toLowerCase().includes(term) ||
          worker.address?.state?.toLowerCase().includes(term),
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((worker) => worker.status === filterStatus);
    }

    if (filterService !== "all") {
      filtered = filtered.filter(
        (worker) => worker.service_type === filterService,
      );
    }

    setFilteredWorkers(filtered);
  };

  const handleStatusChange = async (workerId: string, newStatus: string) => {
    try {
      const response = await authService.updateWorkerStatus(
        workerId,
        newStatus,
      );
      if (response.success) {
        fetchWorkers();
      } else {
        alert(response.error || "Failed to update status");
      }
    } catch (err: any) {
      alert(err.message || "An error occurred");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "busy":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper function to get worker ID (handles both id and _id)
  const getWorkerId = (worker: Worker): string => {
    return worker.id || worker._id || "";
  };

  const serviceTypes = ["all", ...new Set(workers.map((w) => w.service_type))];

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading workers...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Workers</h1>
            <p className="text-gray-600 mt-2">
              Manage all worker accounts ({filteredWorkers.length} workers)
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/add-worker")}
            className="bg-gradient-to-r from-blue-600 to-sky-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all hover:scale-105"
          >
            + Add New Worker
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-xl shadow-blue-500/10 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, email, service..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                />
                <svg
                  className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="busy">Busy</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <select
                value={filterService}
                onChange={(e) => setFilterService(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
              >
                <option value="all">All Services</option>
                {serviceTypes
                  .filter((s) => s !== "all")
                  .map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {filteredWorkers.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            {searchTerm || filterStatus !== "all" || filterService !== "all" ? (
              <>
                <p className="text-gray-500 text-lg">
                  No workers match your filters
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterStatus("all");
                    setFilterService("all");
                  }}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Clear filters
                </button>
              </>
            ) : (
              <>
                <p className="text-gray-500 text-lg">
                  No workers found. Create your first worker!
                </p>
                <button
                  onClick={() => navigate("/add-worker")}
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Worker
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkers.map((worker) => {
              const workerId = getWorkerId(worker);
              return (
                <div
                  key={workerId || Math.random().toString()}
                  className="bg-white rounded-2xl shadow-xl shadow-blue-500/10 overflow-hidden hover:shadow-2xl transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-sky-500 flex items-center justify-center text-white font-bold text-lg">
                            {worker.name?.charAt(0).toUpperCase() || "W"}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {worker.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {worker.email}
                            </p>
                          </div>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(worker.status)}`}
                      >
                        {worker.status}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium">Service:</span>
                        <span className="bg-blue-50 px-2 py-1 rounded text-blue-700">
                          {worker.service_type}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium">Experience:</span>
                        <span>{worker.experience_years} years</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium">Rate:</span>
                        <span className="font-semibold text-green-600">
                          ${worker.hourly_rate}/hr
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium">Location:</span>
                        <span>
                          {worker.address?.city}, {worker.address?.state}
                        </span>
                      </div>
                      {worker.skills && worker.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {worker.skills.slice(0, 3).map((skill, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                          {worker.skills.length > 3 && (
                            <span className="text-xs text-gray-400">
                              +{worker.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Assign Work Button - Fixed with proper ID handling */}
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        {worker.status === "active" && workerId && (
                          <button
                            onClick={() => {
                              console.log(
                                "Navigating with workerId:",
                                workerId,
                              );
                              navigate(
                                `/admin/assign-work?workerId=${workerId}&workerName=${encodeURIComponent(worker.name)}`,
                              );
                            }}
                            className="w-full bg-gradient-to-r from-blue-600 to-sky-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all hover:scale-[1.02] active:scale-95"
                          >
                            📋 Assign Work
                          </button>
                        )}
                        {worker.status === "active" && !workerId && (
                          <p className="text-red-500 text-xs text-center">
                            Error: Worker ID not found
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <select
                        value={worker.status}
                        onChange={(e) =>
                          handleStatusChange(workerId, e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-sm"
                      >
                        <option value="active">Active</option>
                        <option value="busy">Busy</option>
                        <option value="pending">Pending</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkersList;
