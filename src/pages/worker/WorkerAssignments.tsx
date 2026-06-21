import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/layout";
import assignmentService from "../../service/assignmentService";
import { URGENCY_LEVELS } from "../../types";

const WorkerAssignments: React.FC = () => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [showDetails, setShowDetails] = useState<string | null>(null);

  useEffect(() => {
    fetchAssignments();
  }, [filter]);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (filter !== "all") params.status = filter;

      const response = await assignmentService.getMyWorkerAssignments(params);
      if (response.success) {
        setAssignments(response.data || []);
      } else {
        setError(response.error || "Failed to fetch assignments");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id: string) => {
    if (!window.confirm("Do you want to accept this assignment?")) return;

    try {
      const response = await assignmentService.acceptAssignment(id);
      if (response.success) {
        fetchAssignments();
        alert("Assignment accepted successfully!");
      } else {
        alert(response.error || "Failed to accept assignment");
      }
    } catch (err: any) {
      alert(err.message || "An error occurred");
    }
  };

  const handleReject = async (id: string) => {
    if (!window.confirm("Do you want to reject this assignment?")) return;

    try {
      const response = await assignmentService.rejectAssignment(id);
      if (response.success) {
        fetchAssignments();
        alert("Assignment rejected");
      } else {
        alert(response.error || "Failed to reject assignment");
      }
    } catch (err: any) {
      alert(err.message || "An error occurred");
    }
  };

  const handleStartWork = async (id: string) => {
    if (!window.confirm("Ready to start working on this assignment?")) return;

    try {
      const response = await assignmentService.startWork(id);
      if (response.success) {
        fetchAssignments();
        alert("Work started!");
      } else {
        alert(response.error || "Failed to start work");
      }
    } catch (err: any) {
      alert(err.message || "An error occurred");
    }
  };

  const handleCompleteWork = async (id: string) => {
    const notes = prompt("Add completion notes (optional):");
    const hours = prompt("Enter actual hours worked:");
    const rating = prompt("Rate the service (1-5, optional):");

    try {
      const response = await assignmentService.completeWork(id, {
        completion_notes: notes || "",
        actual_hours: hours ? parseFloat(hours) : 0,
        completion_rating: rating ? parseInt(rating) : undefined,
      });
      if (response.success) {
        fetchAssignments();
        alert("Work completed successfully!");
      } else {
        alert(response.error || "Failed to complete work");
      }
    } catch (err: any) {
      alert(err.message || "An error occurred");
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

  const getActionButtons = (assignment: any) => {
    switch (assignment.status) {
      case "assigned":
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleAccept(assignment._id)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Accept
            </button>
            <button
              onClick={() => handleReject(assignment._id)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Reject
            </button>
          </div>
        );
      case "accepted":
        return (
          <button
            onClick={() => handleStartWork(assignment._id)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Start Work
          </button>
        );
      case "in_progress":
        return (
          <button
            onClick={() => handleCompleteWork(assignment._id)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            Complete Work
          </button>
        );
      default:
        return null;
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
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Assignments</h1>
            <p className="text-gray-600 mt-2">
              View and manage your assigned work
            </p>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            <div className="bg-white rounded-xl shadow-lg p-3 text-center">
              <p className="text-xl font-bold text-blue-600">
                {assignments.length}
              </p>
              <p className="text-xs text-gray-600">Total</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-3 text-center">
              <p className="text-xl font-bold text-blue-600">
                {assignments.filter((a) => a.status === "assigned").length}
              </p>
              <p className="text-xs text-gray-600">Assigned</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-3 text-center">
              <p className="text-xl font-bold text-green-600">
                {assignments.filter((a) => a.status === "accepted").length}
              </p>
              <p className="text-xs text-gray-600">Accepted</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-3 text-center">
              <p className="text-xl font-bold text-purple-600">
                {assignments.filter((a) => a.status === "in_progress").length}
              </p>
              <p className="text-xs text-gray-600">In Progress</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-3 text-center">
              <p className="text-xl font-bold text-green-600">
                {assignments.filter((a) => a.status === "completed").length}
              </p>
              <p className="text-xs text-gray-600">Completed</p>
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
                All ({assignments.length})
              </button>
              <button
                onClick={() => setFilter("assigned")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === "assigned"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Assigned (
                {assignments.filter((a) => a.status === "assigned").length})
              </button>
              <button
                onClick={() => setFilter("accepted")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === "accepted"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Accepted (
                {assignments.filter((a) => a.status === "accepted").length})
              </button>
              <button
                onClick={() => setFilter("in_progress")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === "in_progress"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                In Progress (
                {assignments.filter((a) => a.status === "in_progress").length})
              </button>
              <button
                onClick={() => setFilter("completed")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === "completed"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Completed (
                {assignments.filter((a) => a.status === "completed").length})
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
              <p className="text-gray-400 text-sm mt-1">
                You'll see assignments here when admin assigns work to you
              </p>
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
                          {assignment.query?.urgency && (
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                assignment.query.urgency === "urgent"
                                  ? "bg-red-100 text-red-700"
                                  : assignment.query.urgency === "very_high"
                                    ? "bg-orange-100 text-orange-700"
                                    : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {URGENCY_LEVELS[
                                assignment.query
                                  .urgency as keyof typeof URGENCY_LEVELS
                              ]?.label || assignment.query.urgency}
                            </span>
                          )}
                          {assignment.worker_response &&
                            assignment.worker_response !== "pending" && (
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  assignment.worker_response === "accepted"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {assignment.worker_response === "accepted"
                                  ? "✅ Accepted"
                                  : "❌ Rejected"}
                              </span>
                            )}
                        </div>

                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="font-medium text-gray-500">
                              Customer:
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
                          <div className="md:col-span-2">
                            <span className="font-medium text-gray-500">
                              Issue:
                            </span>
                            <span className="ml-2 text-gray-700">
                              {assignment.query?.issue?.substring(0, 100) ||
                                "N/A"}
                              {assignment.query?.issue?.length > 100 && "..."}
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
                              Time Slot:
                            </span>
                            <span className="ml-2 text-gray-800 capitalize">
                              {assignment.scheduled_time_slot || "anytime"}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">
                              Est. Hours:
                            </span>
                            <span className="ml-2 text-gray-800">
                              {assignment.estimated_hours || 0}h
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
                              Assigned Date:
                            </span>
                            <span className="ml-2 text-gray-800">
                              {assignment.created_at
                                ? new Date(
                                    assignment.created_at,
                                  ).toLocaleDateString()
                                : "N/A"}
                            </span>
                          </div>
                        </div>

                        {assignment.admin_notes && (
                          <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                            📝 Admin Note: {assignment.admin_notes}
                          </p>
                        )}

                        {assignment.worker_notes && (
                          <p className="mt-2 text-sm text-gray-600 bg-blue-50 p-2 rounded-lg">
                            📝 Your Note: {assignment.worker_notes}
                          </p>
                        )}

                        {assignment.completion_notes && (
                          <p className="mt-2 text-sm text-gray-600 bg-green-50 p-2 rounded-lg">
                            ✅ Completion Note: {assignment.completion_notes}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        {getActionButtons(assignment)}
                        <button
                          onClick={() =>
                            setShowDetails(
                              showDetails === assignment._id
                                ? null
                                : assignment._id,
                            )
                          }
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                        >
                          {showDetails === assignment._id
                            ? "Hide Details"
                            : "Show Details"}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {showDetails === assignment._id && assignment.query && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-700 mb-2">
                          Customer Details
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm bg-gray-50 p-4 rounded-lg">
                          <div>
                            <span className="font-medium text-gray-500">
                              Name:
                            </span>
                            <span className="ml-2 text-gray-800">
                              {assignment.query.name}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">
                              Email:
                            </span>
                            <span className="ml-2 text-gray-800">
                              {assignment.query.email}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">
                              Phone:
                            </span>
                            <span className="ml-2 text-gray-800">
                              {assignment.query.phone}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">
                              Service Type:
                            </span>
                            <span className="ml-2 text-gray-800">
                              {assignment.query.service_type_required}
                            </span>
                          </div>
                          <div className="md:col-span-2">
                            <span className="font-medium text-gray-500">
                              Address:
                            </span>
                            <span className="ml-2 text-gray-800">
                              {assignment.query.address?.street},{" "}
                              {assignment.query.address?.city},{" "}
                              {assignment.query.address?.state} -{" "}
                              {assignment.query.address?.pincode}
                            </span>
                          </div>
                          <div className="md:col-span-2">
                            <span className="font-medium text-gray-500">
                              Full Issue:
                            </span>
                            <p className="mt-1 text-gray-700 bg-white p-2 rounded border border-gray-200">
                              {assignment.query.issue}
                            </p>
                          </div>
                        </div>

                        {/* Timeline */}
                        <h4 className="font-semibold text-gray-700 mt-4 mb-2">
                          Timeline
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm bg-gray-50 p-4 rounded-lg">
                          <div>
                            <span className="font-medium text-gray-500">
                              Assigned:
                            </span>
                            <span className="ml-2 text-gray-800">
                              {assignment.created_at
                                ? new Date(
                                    assignment.created_at,
                                  ).toLocaleString()
                                : "N/A"}
                            </span>
                          </div>
                          {assignment.accepted_at && (
                            <div>
                              <span className="font-medium text-gray-500">
                                Accepted:
                              </span>
                              <span className="ml-2 text-gray-800">
                                {new Date(
                                  assignment.accepted_at,
                                ).toLocaleString()}
                              </span>
                            </div>
                          )}
                          {assignment.started_at && (
                            <div>
                              <span className="font-medium text-gray-500">
                                Started:
                              </span>
                              <span className="ml-2 text-gray-800">
                                {new Date(
                                  assignment.started_at,
                                ).toLocaleString()}
                              </span>
                            </div>
                          )}
                          {assignment.completed_at && (
                            <div>
                              <span className="font-medium text-gray-500">
                                Completed:
                              </span>
                              <span className="ml-2 text-gray-800">
                                {new Date(
                                  assignment.completed_at,
                                ).toLocaleString()}
                              </span>
                            </div>
                          )}
                          {assignment.actual_hours > 0 && (
                            <div>
                              <span className="font-medium text-gray-500">
                                Actual Hours:
                              </span>
                              <span className="ml-2 text-gray-800">
                                {assignment.actual_hours}h
                              </span>
                            </div>
                          )}
                          {assignment.completion_rating && (
                            <div>
                              <span className="font-medium text-gray-500">
                                Rating:
                              </span>
                              <span className="ml-2 text-gray-800">
                                ⭐ {assignment.completion_rating}/5
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
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

export default WorkerAssignments;
