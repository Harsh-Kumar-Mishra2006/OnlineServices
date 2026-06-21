import React, { useState, useEffect } from "react";
import queryService from "../../service/querryService";
import { type UserQuery, QUERY_STATUS, URGENCY_LEVELS } from "../../types";

interface QueryDetailsProps {
  queryId: string;
  onBack: () => void;
  onRate: () => void;
}

const QueryDetails: React.FC<QueryDetailsProps> = ({
  queryId,
  onBack,
  onRate,
}) => {
  const [query, setQuery] = useState<UserQuery | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchQuery();
  }, [queryId]);

  const fetchQuery = async () => {
    setLoading(true);
    try {
      const response = await queryService.getQueryById(queryId);
      if (response.success) {
        setQuery(response.data);
      } else {
        setError(response.error || "Failed to fetch query");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (
      !window.confirm("Are you sure you want to cancel this service request?")
    )
      return;

    try {
      const response = await queryService.cancelQuery(queryId);
      if (response.success) {
        fetchQuery();
      } else {
        alert(response.error || "Failed to cancel query");
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
        <h2 className="text-2xl font-bold text-gray-900">Request Details</h2>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          ← Back
        </button>
      </div>

      <div className="space-y-6">
        {/* Status & Urgency */}
        <div className="flex flex-wrap gap-3">
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium ${QUERY_STATUS[query.status as keyof typeof QUERY_STATUS]?.color || "bg-gray-100"}`}
          >
            {QUERY_STATUS[query.status as keyof typeof QUERY_STATUS]?.label}
          </span>
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium ${query.urgency === "urgent" || query.urgency === "very_high" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}
          >
            {URGENCY_LEVELS[query.urgency as keyof typeof URGENCY_LEVELS]
              ?.label || query.urgency}
          </span>
          <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
            {query.service_type_required}
          </span>
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
            {query.address.landmark && ` (Near: ${query.address.landmark})`}
          </p>
        </div>

        {/* Schedule */}
        {query.preferred_schedule && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Preferred Schedule
            </h3>
            <p className="mt-1 text-gray-800">
              {query.preferred_schedule.preferred_date &&
                new Date(
                  query.preferred_schedule.preferred_date,
                ).toLocaleDateString()}
              {query.preferred_schedule.preferred_time_slot &&
                ` at ${query.preferred_schedule.preferred_time_slot}`}
              {query.preferred_schedule.flexible_timing && " (Flexible)"}
            </p>
          </div>
        )}

        {/* Budget */}
        {query.budget && (query.budget.min > 0 || query.budget.max) && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Budget</h3>
            <p className="mt-1 text-gray-800">
              ${query.budget.min} - ${query.budget.max || "No max"}
              {query.budget.is_negotiable && " (Negotiable)"}
            </p>
          </div>
        )}

        {/* Assigned Worker */}
        {query.assigned_to && typeof query.assigned_to !== "string" && (
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
              {query.assigned_to.phone_number && (
                <p className="text-sm text-gray-600">
                  📞 {query.assigned_to.phone_number}
                </p>
              )}
            </div>
            {query.scheduled_date && (
              <p className="mt-2 text-sm text-gray-600">
                Scheduled for: {new Date(query.scheduled_date).toLocaleString()}
              </p>
            )}
          </div>
        )}

        {/* Admin/Worker Notes */}
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

        {/* Rating & Feedback */}
        {query.rating && (
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-500">Your Rating</h3>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              <span className="text-lg font-semibold">{query.rating}/5</span>
            </div>
            {query.feedback && (
              <p className="mt-1 text-gray-700 bg-green-50 p-3 rounded-lg">
                {query.feedback}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        {query.status === "pending" && (
          <div className="border-t border-gray-200 pt-4 flex gap-4">
            <button
              onClick={handleCancel}
              className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Cancel Request
            </button>
          </div>
        )}

        {query.status === "completed" && !query.rating && (
          <div className="border-t border-gray-200 pt-4">
            <button
              onClick={onRate}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Rate Service
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueryDetails;
