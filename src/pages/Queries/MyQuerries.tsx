import React, { useState, useEffect } from "react";
import queryService from "../../service/querryService";
import { type UserQuery, QUERY_STATUS, URGENCY_LEVELS } from "../../types";

interface MyQueriesListProps {
  onViewDetails: (id: string) => void;
  onRateService: (id: string) => void;
}

const MyQueriesList: React.FC<MyQueriesListProps> = ({
  onViewDetails,
  onRateService,
}) => {
  const [queries, setQueries] = useState<UserQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchQueries();
  }, [filter]);

  const fetchQueries = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (filter !== "all") params.status = filter;

      const response = await queryService.getMyQueries(params);
      if (response.success) {
        setQueries(response.data || []);
      } else {
        setError(response.error || "Failed to fetch queries");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (
      !window.confirm("Are you sure you want to cancel this service request?")
    )
      return;

    try {
      const response = await queryService.cancelQuery(id);
      if (response.success) {
        fetchQueries();
      } else {
        alert(response.error || "Failed to cancel query");
      }
    } catch (err: any) {
      alert(err.message || "An error occurred");
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "urgent":
        return "text-red-600 bg-red-50";
      case "very_high":
        return "text-orange-600 bg-orange-50";
      case "high":
        return "text-yellow-600 bg-yellow-50";
      case "medium":
        return "text-blue-600 bg-blue-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          My Service Requests
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              filter === "all"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All ({queries.length})
          </button>
          {Object.entries(QUERY_STATUS).map(([key, value]) => {
            const count = queries.filter((q) => q.status === key).length;
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filter === key
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {value.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {queries.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No service requests found</p>
          <p className="text-gray-400 text-sm mt-1">
            Create your first request to get started
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {queries.map((query) => (
            <div
              key={query._id}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {query.service_type_required}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getUrgencyColor(query.urgency)}`}
                    >
                      {URGENCY_LEVELS[
                        query.urgency as keyof typeof URGENCY_LEVELS
                      ]?.label || query.urgency}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${QUERY_STATUS[query.status as keyof typeof QUERY_STATUS]?.color || "bg-gray-100"}`}
                    >
                      {
                        QUERY_STATUS[query.status as keyof typeof QUERY_STATUS]
                          ?.label
                      }
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {query.address?.city}, {query.address?.state}
                  </p>
                  <p className="text-gray-700 mt-2 line-clamp-2">
                    {query.issue}
                  </p>
                  {query.assigned_to &&
                    typeof query.assigned_to !== "string" && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium">Assigned to:</span>
                        <span>{query.assigned_to.name}</span>
                        <span className="text-gray-400">|</span>
                        <span>{query.assigned_to.service_type}</span>
                      </div>
                    )}
                  <div className="mt-2 text-xs text-gray-400">
                    Created: {new Date(query.created_at).toLocaleDateString()}
                    {query.scheduled_date &&
                      ` | Scheduled: ${new Date(query.scheduled_date).toLocaleDateString()}`}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => onViewDetails(query._id!)}
                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                  >
                    View Details
                  </button>
                  {query.status === "pending" && (
                    <button
                      onClick={() => handleCancel(query._id!)}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  {query.status === "completed" && !query.rating && (
                    <button
                      onClick={() => onRateService(query._id!)}
                      className="px-4 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
                    >
                      Rate Service
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyQueriesList;
