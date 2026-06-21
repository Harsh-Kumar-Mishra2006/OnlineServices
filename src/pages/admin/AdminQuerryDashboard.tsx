import React, { useState, useEffect } from "react";
import queryService from "../../service/querryService";
import {
  type UserQuery,
  QUERY_STATUS,
  URGENCY_LEVELS,
  SERVICE_CATEGORIES,
} from "../../types";

interface AdminQueriesListProps {
  onViewDetails: (id: string) => void;
}

const AdminQueriesList: React.FC<AdminQueriesListProps> = ({
  onViewDetails,
}) => {
  const [queries, setQueries] = useState<UserQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    assigned: 0,
    completed: 0,
    urgent: 0,
  });

  const [filters, setFilters] = useState({
    status: "all",
    service_type: "all",
    urgency: "all",
    city: "",
  });

  useEffect(() => {
    fetchQueries();
  }, [filters]);

  const fetchQueries = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (filters.status !== "all") params.status = filters.status;
      if (filters.service_type !== "all")
        params.service_type = filters.service_type;
      if (filters.urgency !== "all") params.urgency = filters.urgency;
      if (filters.city) params.city = filters.city;

      const response = await queryService.getAllQueries(params);
      if (response.success) {
        setQueries(response.data || []);
        if (response.summary) {
          setStats({
            total: response.summary.total || 0,
            pending: response.summary.pending || 0,
            assigned: response.summary.assigned || 0,
            completed: response.summary.completed || 0,
            urgent: response.summary.urgent || 0,
          });
        }
      } else {
        setError(response.error || "Failed to fetch queries");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyLabel = (urgency: string) => {
    return (
      URGENCY_LEVELS[urgency as keyof typeof URGENCY_LEVELS]?.label || urgency
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
          <p className="text-sm text-gray-600">Total</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-sm text-gray-600">Pending</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.assigned}</p>
          <p className="text-sm text-gray-600">Assigned</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          <p className="text-sm text-gray-600">Completed</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{stats.urgent}</p>
          <p className="text-sm text-gray-600">Urgent</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              Urgency
            </label>
            <select
              value={filters.urgency}
              onChange={(e) =>
                setFilters({ ...filters, urgency: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            >
              <option value="all">All Urgency</option>
              {Object.entries(URGENCY_LEVELS).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              placeholder="Filter by city"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            />
          </div>
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
                      {query.name}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${query.urgency === "urgent" || query.urgency === "very_high" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}
                    >
                      {getUrgencyLabel(query.urgency)}
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
                  <p className="text-sm text-gray-500">
                    {query.email} | {query.phone} | {query.address?.city},{" "}
                    {query.address?.state}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Service:</span>{" "}
                    {query.service_type_required}
                  </p>
                  <p className="text-gray-700 mt-2 line-clamp-2">
                    {query.issue}
                  </p>
                  {query.assigned_to &&
                    typeof query.assigned_to !== "string" && (
                      <p className="text-sm text-blue-600 mt-1">
                        👤 Assigned to: {query.assigned_to.name}
                      </p>
                    )}
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(query.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => onViewDetails(query._id!)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    View & Manage
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminQueriesList;
