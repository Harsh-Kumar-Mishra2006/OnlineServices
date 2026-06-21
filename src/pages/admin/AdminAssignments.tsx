import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/layout/layout";
import assignmentService from "../../service/assignmentService";

const AdminAssignments: React.FC = () => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    assigned: 0,
    accepted: 0,
    in_progress: 0,
    completed: 0,
    cancelled: 0,
    rejected: 0,
  });

  useEffect(() => {
    fetchAssignments();
  }, [filter]);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (filter !== "all") params.status = filter;

      const response = await assignmentService.getAllAssignments(params);
      if (response.success) {
        setAssignments(response.data || []);
        // Calculate stats
        const data = response.data || [];
        setStats({
          total: data.length,
          assigned: data.filter((a: any) => a.status === "assigned").length,
          accepted: data.filter((a: any) => a.status === "accepted").length,
          in_progress: data.filter((a: any) => a.status === "in_progress")
            .length,
          completed: data.filter((a: any) => a.status === "completed").length,
          cancelled: data.filter((a: any) => a.status === "cancelled").length,
          rejected: data.filter((a: any) => a.status === "rejected").length,
        });
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
    switch (status) {
      case "assigned":
        return "bg-blue-100 text-blue-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "assigned":
        return "📋 Assigned";
      case "accepted":
        return "✅ Accepted";
      case "in_progress":
        return "🔄 In Progress";
      case "completed":
        return "🎉 Completed";
      case "cancelled":
        return "❌ Cancelled";
      case "rejected":
        return "🚫 Rejected";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading assignments...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
            <p className="text-gray-600 mt-2">Manage all worker assignments</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-7 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">
                {stats.assigned}
              </p>
              <p className="text-sm text-gray-600">Assigned</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-600">
                {stats.accepted}
              </p>
              <p className="text-sm text-gray-600">Accepted</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 text-center">
              <p className="text-2xl font-bold text-purple-600">
                {stats.in_progress}
              </p>
              <p className="text-sm text-gray-600">In Progress</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-600">
                {stats.completed}
              </p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 text-center">
              <p className="text-2xl font-bold text-red-600">
                {stats.cancelled}
              </p>
              <p className="text-sm text-gray-600">Cancelled</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 text-center">
              <p className="text-2xl font-bold text-red-600">
                {stats.rejected}
              </p>
              <p className="text-sm text-gray-600">Rejected</p>
            </div>
          </div>

          {/* Filter */}
          <div className="bg-white rounded-2xl shadow-xl shadow-blue-500/10 p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === "all"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All ({stats.total})
              </button>
              <button
                onClick={() => setFilter("assigned")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === "assigned"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Assigned ({stats.assigned})
              </button>
              <button
                onClick={() => setFilter("accepted")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === "accepted"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Accepted ({stats.accepted})
              </button>
              <button
                onClick={() => setFilter("in_progress")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === "in_progress"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                In Progress ({stats.in_progress})
              </button>
              <button
                onClick={() => setFilter("completed")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === "completed"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Completed ({stats.completed})
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {assignments.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <p className="text-gray-500 text-lg">No assignments found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <div
                  key={assignment._id}
                  className="bg-white rounded-2xl shadow-xl shadow-blue-500/10 overflow-hidden hover:shadow-2xl transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-lg font-semibold text-gray-900">
                            #{assignment._id?.slice(-6)}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}
                          >
                            {getStatusLabel(assignment.status)}
                          </span>
                          {assignment.worker_response &&
                            assignment.worker_response !== "pending" && (
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                Worker: {assignment.worker_response}
                              </span>
                            )}
                        </div>

                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="font-medium text-gray-500">
                              Worker:
                            </span>
                            <span className="ml-2 text-gray-800">
                              {assignment.worker?.name || "N/A"}
                            </span>
                            <span className="ml-2 text-gray-500">
                              ({assignment.worker?.service_type || "N/A"})
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">
                              User:
                            </span>
                            <span className="ml-2 text-gray-800">
                              {assignment.query?.name || "N/A"}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">
                              Service:
                            </span>
                            <span className="ml-2 text-gray-800">
                              {assignment.query?.service_type_required || "N/A"}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">
                              Scheduled:
                            </span>
                            <span className="ml-2 text-gray-800">
                              {assignment.scheduled_date
                                ? new Date(
                                    assignment.scheduled_date,
                                  ).toLocaleDateString()
                                : "N/A"}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">
                              Assigned By:
                            </span>
                            <span className="ml-2 text-gray-800">
                              {assignment.assigned_by?.name || "N/A"}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">
                              Created:
                            </span>
                            <span className="ml-2 text-gray-800">
                              {new Date(
                                assignment.created_at,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {assignment.admin_notes && (
                          <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                            📝 {assignment.admin_notes}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Link
                          to={`/admin/assignment/${assignment._id}`}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors text-center"
                        >
                          View Details
                        </Link>
                        {assignment.status === "assigned" && (
                          <button
                            onClick={async () => {
                              if (
                                window.confirm(
                                  "Are you sure you want to cancel this assignment?",
                                )
                              ) {
                                const response =
                                  await assignmentService.cancelAssignment(
                                    assignment._id,
                                  );
                                if (response.success) {
                                  fetchAssignments();
                                } else {
                                  alert(
                                    response.error ||
                                      "Failed to cancel assignment",
                                  );
                                }
                              }
                            }}
                            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                          >
                            Cancel Assignment
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminAssignments;
