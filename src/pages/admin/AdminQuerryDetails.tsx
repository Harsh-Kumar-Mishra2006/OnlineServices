import React, { useState, useEffect } from "react";
import queryService from "../../service/querryService";
import { type UserQuery, QUERY_STATUS, URGENCY_LEVELS } from "../../types";

interface AdminQueryDetailsProps {
  queryId: string;
  onBack: () => void;
}

const AdminQueryDetails: React.FC<AdminQueryDetailsProps> = ({
  queryId,
  onBack,
}) => {
  const [query, setQuery] = useState<UserQuery | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [availableWorkers, setAvailableWorkers] = useState<any[]>([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [statusNotes, setStatusNotes] = useState("");

  useEffect(() => {
    fetchQuery();
  }, [queryId]);

  const fetchQuery = async () => {
    setLoading(true);
    try {
      const response = await queryService.getQueryById(queryId);
      if (response.success) {
        setQuery(response.data);
        setNewStatus(response.data.status);
      } else {
        setError(response.error || "Failed to fetch query");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableWorkers = async () => {
    try {
      const response = await queryService.getAvailableWorkers(queryId);
      if (response.success) {
        setAvailableWorkers(response.data.workers || []);
        setShowAssignModal(true);
      } else {
        alert(response.error || "Failed to fetch available workers");
      }
    } catch (err: any) {
      alert(err.message || "An error occurred");
    }
  };

  // AdminQueryDetails.tsx - Updated handleAssign

  const handleAssign = async () => {
    if (!selectedWorker) {
      alert("Please select a worker");
      return;
    }

    try {
      console.log(`📤 Assigning worker ${selectedWorker} to query ${queryId}`);

      const response = await queryService.assignWorker(
        queryId,
        selectedWorker,
        scheduledDate,
        adminNotes,
      );

      console.log(`📦 Assignment response:`, response);

      if (response.success) {
        setShowAssignModal(false);
        await fetchQuery(); // Refresh query details
        alert("Worker assigned successfully!");
      } else {
        // Show detailed error message
        alert(`Failed to assign worker: ${response.error || "Unknown error"}`);
      }
    } catch (err: any) {
      console.error("❌ Assignment error:", err);
      alert(
        err.response?.data?.error ||
          err.message ||
          "An error occurred during assignment",
      );
    }
  };

  const handleStatusUpdate = async () => {
    if (newStatus === query?.status) return;

    try {
      const response = await queryService.updateQueryStatus(
        queryId,
        newStatus,
        statusNotes,
      );
      if (response.success) {
        fetchQuery();
        alert(`Status updated to ${newStatus}`);
      } else {
        alert(response.error || "Failed to update status");
      }
    } catch (err: any) {
      alert(err.message || "An error occurred");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading request details...</p>
        </div>
      </div>
    );
  }

  if (error || !query) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || "Request not found"}</p>
        <button
          onClick={onBack}
          className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Request #{query._id?.slice(-6)}
        </h2>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          ← Back
        </button>
      </div>

      <div className="space-y-6">
        {/* Status Update */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Update Status
          </h3>
          <div className="flex flex-wrap gap-3">
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            >
              {Object.entries(QUERY_STATUS).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={statusNotes}
              onChange={(e) => setStatusNotes(e.target.value)}
              placeholder="Add notes (optional)"
              className="flex-1 min-w-[200px] px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            />
            <button
              onClick={handleStatusUpdate}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Update
            </button>
          </div>
        </div>

        {/* Query Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Customer</h3>
            <p className="text-gray-800 font-medium">{query.name}</p>
            <p className="text-sm text-gray-600">{query.email}</p>
            <p className="text-sm text-gray-600">{query.phone}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Service Details
            </h3>
            <p className="text-gray-800 font-medium">
              {query.service_type_required}
            </p>
            <p className="text-sm text-gray-600">
              {
                URGENCY_LEVELS[query.urgency as keyof typeof URGENCY_LEVELS]
                  ?.label
              }
            </p>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${QUERY_STATUS[query.status as keyof typeof QUERY_STATUS]?.color || "bg-gray-100"}`}
            >
              {QUERY_STATUS[query.status as keyof typeof QUERY_STATUS]?.label}
            </span>
          </div>
        </div>

        {/* Issue */}
        <div>
          <h3 className="text-sm font-medium text-gray-500">
            Issue Description
          </h3>
          <p className="mt-1 text-gray-800 whitespace-pre-wrap">
            {query.issue}
          </p>
        </div>

        {/* Address */}
        <div>
          <h3 className="text-sm font-medium text-gray-500">Address</h3>
          <p className="mt-1 text-gray-800">
            {query.address.street}, {query.address.city}, {query.address.state}{" "}
            - {query.address.pincode}
          </p>
        </div>

        {/* Assigned Worker */}
        {query.assigned_to && typeof query.assigned_to !== "string" ? (
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-500">
              Assigned Worker
            </h3>
            <div className="mt-2 p-4 bg-blue-50 rounded-lg">
              <p className="font-semibold text-gray-800">
                {query.assigned_to.name}
              </p>
              <p className="text-sm text-gray-600">
                {query.assigned_to.service_type}
              </p>
              <p className="text-sm text-gray-600">
                ⭐ {query.assigned_to.rating || "N/A"} (
                {query.assigned_to.total_reviews || 0} reviews)
              </p>
              <p className="text-sm text-gray-600">
                📞 {query.assigned_to.phone_number}
              </p>
            </div>
          </div>
        ) : (
          <div className="border-t border-gray-200 pt-4">
            <button
              onClick={fetchAvailableWorkers}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Assign Worker
            </button>
          </div>
        )}

        {/* Notes */}
        {query.admin_notes && (
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-500">Admin Notes</h3>
            <p className="mt-1 text-gray-700 bg-gray-50 p-3 rounded-lg">
              {query.admin_notes}
            </p>
          </div>
        )}

        {query.worker_notes && (
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-500">Worker Notes</h3>
            <p className="mt-1 text-gray-700 bg-gray-50 p-3 rounded-lg">
              {query.worker_notes}
            </p>
          </div>
        )}
      </div>

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Assign Worker
            </h2>

            {availableWorkers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">
                  No available workers found for this service type
                </p>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="mt-4 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                  {availableWorkers.map((worker) => (
                    <label
                      key={worker._id}
                      className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        selectedWorker === worker._id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <input
                          type="radio"
                          name="worker"
                          value={worker._id}
                          checked={selectedWorker === worker._id}
                          onChange={(e) => setSelectedWorker(e.target.value)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            {worker.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {worker.service_type}
                          </p>
                          <div className="flex gap-4 mt-1 text-sm text-gray-500">
                            <span>⭐ {worker.rating || "N/A"}</span>
                            <span>💰 ${worker.hourly_rate}/hr</span>
                            <span>📅 {worker.experience_years} years</span>
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Scheduled Date (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Admin Notes (Optional)
                    </label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                      placeholder="Add any notes about this assignment..."
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={handleAssign}
                    disabled={!selectedWorker}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-sky-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Assign Worker
                  </button>
                  <button
                    onClick={() => setShowAssignModal(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQueryDetails;
