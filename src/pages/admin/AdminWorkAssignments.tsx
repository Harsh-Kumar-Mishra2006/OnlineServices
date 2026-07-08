import React, { useState, useEffect } from "react";
import {
  type UserQuery,
  type Worker,
  QUERY_STATUS,
  URGENCY_LEVELS,
  SERVICE_CATEGORIES,
} from "../../types";
import queryService from "../../service/querryService";
import authService from "../../service/authService";
import Layout from "../../components/layout/layout";

// FIXED: Use Omit to exclude incompatible properties
interface Assignment extends Omit<UserQuery, "user" | "assigned_to"> {
  user: {
    name: string;
    email: string;
    phone: string;
  };
  assigned_to: Worker;
}

const AdminWorkAssignments: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState("");
  const [reassignNotes, setReassignNotes] = useState("");
  const [stats, setStats] = useState({
    total_assignments: 0,
    active_assignments: 0,
    completed_assignments: 0,
    pending_completion: 0,
  });

  const [filters, setFilters] = useState({
    status: "all",
    service_type: "all",
    worker_id: "",
    date_from: "",
    date_to: "",
  });

  const [workers, setWorkers] = useState<Worker[]>([]);

  useEffect(() => {
    fetchWorkers();
    fetchAssignments();
  }, [filters]);

  const fetchWorkers = async () => {
    try {
      // Use admin endpoint to get ALL workers
      const response = await authService.getAllWorkersForAdmin();
      if (response.success) {
        setWorkers(response.data || []);
      } else {
        console.error("Failed to fetch workers:", response.error);
      }
    } catch (error) {
      console.error("Error fetching workers:", error);
    }
  };

  const fetchAssignments = async () => {
    setLoading(true);
    setError("");
    try {
      const params: any = {};
      if (filters.status !== "all") params.status = filters.status;
      if (filters.service_type !== "all")
        params.service_type = filters.service_type;
      if (filters.worker_id) params.worker_id = filters.worker_id;
      if (filters.date_from) params.date_from = filters.date_from;
      if (filters.date_to) params.date_to = filters.date_to;

      const response = await queryService.getAllAssignments(params);
      if (response.success) {
        // Map the response data to ensure correct types
        const mappedAssignments = (response.data || []).map((item: any) => ({
          ...item,
          user: {
            name: item.user?.name || item.name,
            email: item.user?.email || item.email,
            phone: item.user?.phone || item.phone,
          },
          assigned_to: item.assigned_to,
        }));
        setAssignments(mappedAssignments);

        if (response.summary) {
          setStats({
            total_assignments: response.summary.total_assignments || 0,
            active_assignments: response.summary.active_assignments || 0,
            completed_assignments: response.summary.completed_assignments || 0,
            pending_completion: response.summary.pending_completion || 0,
          });
        }
      } else {
        setError(response.error || "Failed to fetch assignments");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleReassign = async () => {
    if (!selectedWorker || !selectedAssignment) {
      alert("Please select a worker to reassign");
      return;
    }

    try {
      const response = await queryService.reassignWorker(
        selectedAssignment._id!,
        selectedWorker,
        undefined,
        reassignNotes,
      );

      if (response.success) {
        setShowReassignModal(false);
        setSelectedWorker("");
        setReassignNotes("");
        await fetchAssignments(); // Refresh the list
        alert("Worker reassigned successfully!");
      } else {
        alert(response.error || "Failed to reassign worker");
      }
    } catch (error: any) {
      console.error("Reassignment error:", error);
      alert(error.message || "An error occurred during reassignment");
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      assigned: "bg-blue-100 text-blue-800",
      in_progress: "bg-purple-100 text-purple-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      rescheduled: "bg-orange-100 text-orange-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading assignments...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Work Assignments</h1>
          <p className="text-gray-600 mt-1">
            Manage all worker assignments and tasks
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-500">Total Assignments</p>
            <p className="text-2xl font-bold text-blue-600">
              {stats.total_assignments}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-500">Active Assignments</p>
            <p className="text-2xl font-bold text-purple-600">
              {stats.active_assignments}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.completed_assignments}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-500">Overdue Tasks</p>
            <p className="text-2xl font-bold text-red-600">
              {stats.pending_completion}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
              >
                <option value="all">All Status</option>
                {Object.entries(QUERY_STATUS).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Type
              </label>
              <select
                value={filters.service_type}
                onChange={(e) =>
                  setFilters({ ...filters, service_type: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
              >
                <option value="all">All Services</option>
                {SERVICE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Worker
              </label>
              <select
                value={filters.worker_id}
                onChange={(e) =>
                  setFilters({ ...filters, worker_id: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
              >
                <option value="">All Workers</option>
                {workers.map((worker) => (
                  <option key={worker._id} value={worker._id}>
                    {worker.name} - {worker.service_type} ({worker.status})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date From
              </label>
              <input
                type="date"
                value={filters.date_from}
                onChange={(e) =>
                  setFilters({ ...filters, date_from: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date To
              </label>
              <input
                type="date"
                value={filters.date_to}
                onChange={(e) =>
                  setFilters({ ...filters, date_to: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-4">
            <p className="text-red-700">{error}</p>
            <button
              onClick={fetchAssignments}
              className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Try again
            </button>
          </div>
        )}

        {/* Assignments List */}
        {assignments.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-500 text-lg">No assignments found</p>
            <p className="text-gray-400 text-sm mt-1">
              Try adjusting your filters or check back later
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <div
                key={assignment._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        #{assignment._id?.slice(-6)}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}
                      >
                        {
                          QUERY_STATUS[
                            assignment.status as keyof typeof QUERY_STATUS
                          ]?.label
                        }
                      </span>
                      <span className="text-sm text-gray-500">
                        {assignment.assigned_at
                          ? new Date(
                              assignment.assigned_at,
                            ).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>

                    {/* Customer & Service */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-gray-500">Customer</p>
                        <p className="font-medium text-gray-800">
                          {assignment.user?.name || assignment.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {assignment.user?.email || assignment.email}
                        </p>
                        <p className="text-sm text-gray-600">
                          {assignment.user?.phone || assignment.phone}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Service Details</p>
                        <p className="font-medium text-gray-800">
                          {assignment.service_type_required}
                        </p>
                        <p className="text-sm text-gray-600">
                          Urgency:{" "}
                          {
                            URGENCY_LEVELS[
                              assignment.urgency as keyof typeof URGENCY_LEVELS
                            ]?.label
                          }
                        </p>
                        <p className="text-sm text-gray-600">
                          Location: {assignment.address?.city},{" "}
                          {assignment.address?.state}
                        </p>
                      </div>
                    </div>

                    {/* Issue */}
                    <p className="text-gray-700 mt-2 line-clamp-2">
                      {assignment.issue}
                    </p>

                    {/* Assigned Worker */}
                    {assignment.assigned_to && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <p className="text-sm text-gray-500">
                              Assigned Worker
                            </p>
                            <p className="font-semibold text-gray-800">
                              {assignment.assigned_to.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {assignment.assigned_to.service_type} • ⭐{" "}
                              {assignment.assigned_to.rating || "N/A"} (
                              {assignment.assigned_to.total_reviews || 0}{" "}
                              reviews)
                            </p>
                            <p className="text-xs text-gray-500">
                              Status: {assignment.assigned_to.status}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedAssignment(assignment);
                                setShowReassignModal(true);
                              }}
                              className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
                            >
                              Reassign
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Schedule */}
                    {assignment.scheduled_date && (
                      <p className="text-sm text-gray-500 mt-2">
                        📅 Scheduled:{" "}
                        {new Date(assignment.scheduled_date).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reassign Modal */}
        {showReassignModal && selectedAssignment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Reassign Worker
              </h2>
              <p className="text-gray-600 mb-4">
                Reassigning request #{selectedAssignment._id?.slice(-6)} from{" "}
                <span className="font-semibold">
                  {selectedAssignment.assigned_to?.name}
                </span>
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select New Worker
                  </label>
                  <select
                    value={selectedWorker}
                    onChange={(e) => setSelectedWorker(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  >
                    <option value="">Select a worker...</option>
                    {workers
                      .filter(
                        (w) => w._id !== selectedAssignment.assigned_to?._id,
                      )
                      .filter(
                        (w) => w.status === "active" || w.status === "pending",
                      )
                      .map((worker) => (
                        <option key={worker._id} value={worker._id}>
                          {worker.name} - {worker.service_type} (⭐{" "}
                          {worker.rating || "N/A"}) - {worker.status}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={reassignNotes}
                    onChange={(e) => setReassignNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    placeholder="Reason for reassignment..."
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleReassign}
                  disabled={!selectedWorker}
                  className="flex-1 bg-gradient-to-r from-orange-600 to-red-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reassign Worker
                </button>
                <button
                  onClick={() => {
                    setShowReassignModal(false);
                    setSelectedWorker("");
                    setReassignNotes("");
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminWorkAssignments;
