import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { QUERY_STATUS, type UserQuery, type Worker } from "../../types/index";
import queryService from "../../service/querryService";
import Layout from "../layout/layout";

interface DashboardData {
  worker: Worker;
  stats: {
    total: number;
    pending: number;
    in_progress: number;
    completed: number;
    cancelled: number;
    completion_rate: string;
  };
  earnings: {
    total: number;
    total_hours: number;
    average_per_assignment: number;
  };
  ratings_summary: {
    average_rating: number;
    total_ratings: number;
  };
  recent_assignments: UserQuery[];
}

const WorkerDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await queryService.getWorkerDashboardStats();
      if (response.success) {
        setDashboardData(response.data);
      } else {
        setError(response.error || "Failed to fetch dashboard data");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      assigned: "bg-blue-100 text-blue-800",
      in_progress: "bg-purple-100 text-purple-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
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
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !dashboardData) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <p className="text-red-700">
              {error || "Failed to load dashboard"}
            </p>
            <button
              onClick={fetchDashboardData}
              className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Try again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const { worker, stats, earnings, ratings_summary, recent_assignments } =
    dashboardData;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-sky-500 rounded-2xl p-6 text-white">
          <h1 className="text-3xl font-bold">
            Welcome back, {worker.name}! 👋
          </h1>
          <p className="mt-2 text-blue-50">
            {worker.service_type} • ⭐ {worker.rating || "N/A"} (
            {worker.total_reviews || 0} reviews)
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
              Status: {worker.status}
            </span>
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
              Rate: ${worker.hourly_rate}/hr
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-500">Total Assignments</p>
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-500">In Progress</p>
            <p className="text-2xl font-bold text-purple-600">
              {stats.in_progress}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.completed}
            </p>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <p className="text-sm text-gray-500">Completion Rate</p>
            <p className="text-xl font-bold text-gray-900">
              {stats.completion_rate}%
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <p className="text-sm text-gray-500">Total Earnings</p>
            <p className="text-xl font-bold text-green-600">
              ${earnings.total.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">
              {earnings.total_hours} hours worked
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <p className="text-sm text-gray-500">Average Rating</p>
            <div className="flex items-center gap-2">
              <p className="text-xl font-bold text-gray-900">
                {ratings_summary.average_rating.toFixed(1)}
              </p>
              <span className="text-yellow-400 text-xl">⭐</span>
              <span className="text-sm text-gray-500">
                ({ratings_summary.total_ratings} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Recent Assignments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Assignments
            </h2>
            <Link
              to="/worker/assignments"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View All →
            </Link>
          </div>
          {recent_assignments.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No assignments yet
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recent_assignments.map((assignment) => (
                <div
                  key={assignment._id}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-gray-900">
                          {assignment.name}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}
                        >
                          {
                            QUERY_STATUS[
                              assignment.status as keyof typeof QUERY_STATUS
                            ]?.label
                          }
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {assignment.service_type_required} •
                        {assignment.address?.city}, {assignment.address?.state}
                      </p>
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {assignment.issue}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        navigate(`/worker/assignment/${assignment._id}`)
                      }
                      className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
                    >
                      View Details
                    </button>
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

export default WorkerDashboard;
