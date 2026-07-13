import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  type UserQuery,
  QUERY_STATUS,
  URGENCY_LEVELS,
  SERVICE_CATEGORIES,
} from "../../types/index";
import queryService from "../../service/querryService";
import Layout from "../layout/layout";

const WorkerAssignments: React.FC = () => {
  const [assignments, setAssignments] = useState<UserQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    in_progress: 0,
    completed: 0,
    cancelled: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    status: "all",
    service_type: "all",
    sort_by: "assigned_at",
    sort_order: "desc",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignments();
  }, [filters, currentPage]);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
        limit: 10,
        sort_by: filters.sort_by,
        sort_order: filters.sort_order,
      };
      if (filters.status !== "all") params.status = filters.status;
      if (filters.service_type !== "all")
        params.service_type = filters.service_type;

      const response = await queryService.getWorkerAssignments(params);
      if (response.success) {
        setAssignments(response.data.assignments || []);
        setStats(response.data.stats);
        setTotalPages(response.data.pages || 1);
      } else {
        setError(response.error || "Failed to fetch assignments");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
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
        <div className="flex items-center justify-center min-h-screen">
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
          <h1 className="text-3xl font-bold text-gray-900">My Assignments</h1>
          <p className="text-gray-600 mt-1">
            View and manage all your assigned tasks
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            <p className="text-sm text-gray-500">Total</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </p>
            <p className="text-sm text-gray-500">Pending</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 text-center">
            <p className="text-2xl font-bold text-purple-600">
              {stats.in_progress}
            </p>
            <p className="text-sm text-gray-500">In Progress</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 text-center">
            <p className="text-2xl font-bold text-green-600">
              {stats.completed}
            </p>
            <p className="text-sm text-gray-500">Completed</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 text-center">
            <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
            <p className="text-sm text-gray-500">Cancelled</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                Sort By
              </label>
              <select
                value={filters.sort_by}
                onChange={(e) =>
                  setFilters({ ...filters, sort_by: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
              >
                <option value="assigned_at">Assigned Date</option>
                <option value="created_at">Created Date</option>
                <option value="scheduled_date">Scheduled Date</option>
                <option value="urgency">Urgency</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Assignments List */}
        {assignments.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-500 text-lg">No assignments found</p>
            <p className="text-gray-400 text-sm mt-1">
              You don't have any assignments matching the current filters
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
                      <span className="text-sm text-gray-500">
                        {
                          URGENCY_LEVELS[
                            assignment.urgency as keyof typeof URGENCY_LEVELS
                          ]?.label
                        }
                      </span>
                    </div>

                    {/* Customer & Service */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-gray-500">Customer</p>
                        <p className="font-medium text-gray-800">
                          {assignment.user &&
                          typeof assignment.user !== "string"
                            ? assignment.user.name
                            : assignment.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {assignment.user &&
                          typeof assignment.user !== "string"
                            ? assignment.user.email
                            : assignment.email}
                        </p>
                        <p className="text-sm text-gray-600">
                          {assignment.user &&
                          typeof assignment.user !== "string"
                            ? assignment.user.phone
                            : assignment.phone}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Service Details</p>
                        <p className="font-medium text-gray-800">
                          {assignment.service_type_required}
                        </p>
                        <p className="text-sm text-gray-600">
                          Location: {assignment.address?.city},{" "}
                          {assignment.address?.state}
                        </p>
                        {assignment.scheduled_date && (
                          <p className="text-sm text-gray-600">
                            Scheduled:{" "}
                            {new Date(
                              assignment.scheduled_date,
                            ).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Issue */}
                    <p className="text-gray-700 mt-2 line-clamp-2">
                      {assignment.issue}
                    </p>

                    {/* Actions */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {assignment.status === "assigned" && (
                        <button
                          onClick={() =>
                            navigate(`/worker/assignment/${assignment._id}`)
                          }
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          Start Work
                        </button>
                      )}
                      {assignment.status === "in_progress" && (
                        <button
                          onClick={() =>
                            navigate(`/worker/assignment/${assignment._id}`)
                          }
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                        >
                          Complete Work
                        </button>
                      )}
                      {(assignment.status === "assigned" ||
                        assignment.status === "in_progress") && (
                        <button
                          onClick={() =>
                            navigate(`/worker/assignment/${assignment._id}`)
                          }
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                        >
                          View Details
                        </button>
                      )}
                      {assignment.status === "completed" && (
                        <button
                          onClick={() =>
                            navigate(`/worker/assignment/${assignment._id}`)
                          }
                          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                          View Report
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default WorkerAssignments;
