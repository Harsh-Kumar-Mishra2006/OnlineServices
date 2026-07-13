import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { type UserQuery, QUERY_STATUS, URGENCY_LEVELS } from "../../types";
import queryService from "../../service/querryService";
import Layout from "../layout/layout";

const WorkerAssignmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState<UserQuery | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completionData, setCompletionData] = useState({
    actual_hours: 0,
    completion_notes: "",
    photos: [] as string[],
  });

  useEffect(() => {
    if (id) {
      fetchAssignment();
    }
  }, [id]);

  const fetchAssignment = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await queryService.getWorkerAssignmentDetails(id);
      if (response.success) {
        setAssignment(response.data);
      } else {
        setError(response.error || "Failed to fetch assignment details");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!id || !assignment) return;
    setUpdating(true);
    try {
      const response = await queryService.updateWorkerAssignmentStatus(
        id,
        newStatus,
        `Status updated to ${newStatus}`,
      );
      if (response.success) {
        await fetchAssignment();
        alert(`Assignment status updated to ${newStatus}`);
      } else {
        alert(response.error || "Failed to update status");
      }
    } catch (err: any) {
      alert(err.message || "An error occurred");
    } finally {
      setUpdating(false);
    }
  };

  const handleComplete = async () => {
    if (!id || !assignment) return;
    if (completionData.actual_hours <= 0) {
      alert("Please enter valid hours worked");
      return;
    }

    setUpdating(true);
    try {
      const response = await queryService.submitCompletionReport(
        id,
        completionData,
      );
      if (response.success) {
        setShowCompleteModal(false);
        await fetchAssignment();
        alert("Completion report submitted successfully!");
        navigate("/worker/assignments");
      } else {
        alert(response.error || "Failed to submit completion report");
      }
    } catch (err: any) {
      alert(err.message || "An error occurred");
    } finally {
      setUpdating(false);
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
            <p className="mt-4 text-gray-600">Loading assignment details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !assignment) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <p className="text-red-700">{error || "Assignment not found"}</p>
            <button
              onClick={() => navigate("/worker/assignments")}
              className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Back to Assignments
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/worker/assignments")}
            className="text-blue-600 hover:text-blue-800 font-medium mb-4 inline-flex items-center"
          >
            ← Back to Assignments
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Assignment #{assignment._id?.slice(-6)}
            </h1>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(assignment.status)}`}
            >
              {
                QUERY_STATUS[assignment.status as keyof typeof QUERY_STATUS]
                  ?.label
              }
            </span>
          </div>
        </div>

        {/* Assignment Details */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Customer Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">
                  {assignment.user && typeof assignment.user !== "string"
                    ? assignment.user.name
                    : assignment.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">
                  {assignment.user && typeof assignment.user !== "string"
                    ? assignment.user.email
                    : assignment.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">
                  {assignment.user && typeof assignment.user !== "string"
                    ? assignment.user.phone
                    : assignment.phone}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">
                  {assignment.address?.street}, {assignment.address?.city},{" "}
                  {assignment.address?.state} - {assignment.address?.pincode}
                </p>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Service Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Service Type</p>
                <p className="font-medium">
                  {assignment.service_type_required}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Urgency</p>
                <p className="font-medium">
                  {
                    URGENCY_LEVELS[
                      assignment.urgency as keyof typeof URGENCY_LEVELS
                    ]?.label
                  }
                </p>
              </div>
              {assignment.scheduled_date && (
                <div>
                  <p className="text-sm text-gray-500">Scheduled Date</p>
                  <p className="font-medium">
                    {new Date(assignment.scheduled_date).toLocaleString()}
                  </p>
                </div>
              )}
              {assignment.budget && (
                <div>
                  <p className="text-sm text-gray-500">Budget</p>
                  <p className="font-medium">
                    ₹{assignment.budget.min} -{" "}
                    {assignment.budget.max || "Negotiable"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Issue Description */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Issue Description
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {assignment.issue}
            </p>
          </div>

          {/* Notes */}
          {(assignment.worker_notes || assignment.admin_notes) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Notes
              </h2>
              {assignment.admin_notes && (
                <div className="mb-3">
                  <p className="text-sm text-gray-500">Admin Notes</p>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg mt-1">
                    {assignment.admin_notes}
                  </p>
                </div>
              )}
              {assignment.worker_notes && (
                <div>
                  <p className="text-sm text-gray-500">Your Notes</p>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg mt-1">
                    {assignment.worker_notes}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Actions
            </h2>
            <div className="flex flex-wrap gap-3">
              {assignment.status === "assigned" && (
                <>
                  <button
                    onClick={() => handleStatusUpdate("in_progress")}
                    disabled={updating}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
                  >
                    Start Work
                  </button>
                  <button
                    onClick={() => handleStatusUpdate("cancelled")}
                    disabled={updating}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    Cancel Assignment
                  </button>
                </>
              )}
              {assignment.status === "in_progress" && (
                <>
                  <button
                    onClick={() => setShowCompleteModal(true)}
                    disabled={updating}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    Complete Work
                  </button>
                  <button
                    onClick={() => handleStatusUpdate("cancelled")}
                    disabled={updating}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    Cancel Assignment
                  </button>
                </>
              )}
              {assignment.status === "completed" && (
                <div className="text-green-600 font-medium">
                  ✅ This assignment has been completed
                </div>
              )}
              {assignment.status === "cancelled" && (
                <div className="text-red-600 font-medium">
                  ❌ This assignment has been cancelled
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Complete Modal */}
        {showCompleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Complete Work
              </h2>
              <p className="text-gray-600 mb-4">
                Please provide details about the completed work
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hours Worked *
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={completionData.actual_hours}
                    onChange={(e) =>
                      setCompletionData({
                        ...completionData,
                        actual_hours: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Completion Notes
                  </label>
                  <textarea
                    value={completionData.completion_notes}
                    onChange={(e) =>
                      setCompletionData({
                        ...completionData,
                        completion_notes: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    placeholder="Describe the work completed..."
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleComplete}
                  disabled={updating || completionData.actual_hours <= 0}
                  className="flex-1 bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Report
                </button>
                <button
                  onClick={() => setShowCompleteModal(false)}
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

export default WorkerAssignmentDetail;
