import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { type Bill, type UserQuery } from "../../types";
import billingService from "../../service/billingService";
import queryService from "../../service/querryService";
import Layout from "../../components/layout/layout";

const AdminBillsList: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [completedQueries, setCompletedQueries] = useState<UserQuery[]>([]);
  const [selectedQuery, setSelectedQuery] = useState("");
  const [loadingQueries, setLoadingQueries] = useState(false);

  const [summary, setSummary] = useState({
    total_bills: 0,
    pending: 0,
    paid: 0,
    overdue: 0,
    total_amount: 0,
  });

  const [filters, setFilters] = useState({
    status: "all",
    date_from: "",
    date_to: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchBills();
  }, [filters, currentPage]);

  const fetchBills = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
        limit: 20,
        sort_by: "created_at",
        sort_order: "desc",
      };
      if (filters.status !== "all") params.status = filters.status;
      if (filters.date_from) params.date_from = filters.date_from;
      if (filters.date_to) params.date_to = filters.date_to;

      const response = await billingService.getAllBills(params);
      if (response.success) {
        setBills(response.data || []);
        setSummary({
          total_bills: response.summary?.total_bills || 0,
          pending: response.summary?.pending || 0,
          paid: response.summary?.paid || 0,
          overdue: response.summary?.overdue || 0,
          total_amount: response.summary?.total_amount?.[0]?.total || 0,
        });
        setTotalPages(response.pages || 1);
      } else {
        setError(response.error || "Failed to fetch bills");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchCompletedQueries = async () => {
    setLoadingQueries(true);
    try {
      const response = await queryService.getAllQueries({
        status: "completed",
        limit: 100,
      });
      if (response.success) {
        // Filter out queries that already have bills
        const billedQueryIds = bills.map((bill) =>
          typeof bill.query === "object" ? bill.query._id : bill.query,
        );
        const availableQueries = response.data.filter(
          (q: UserQuery) => !billedQueryIds.includes(q._id),
        );
        setCompletedQueries(availableQueries);
      }
    } catch (err: any) {
      console.error("Error fetching completed queries:", err);
    } finally {
      setLoadingQueries(false);
    }
  };

  const handleOpenCreateModal = () => {
    setShowCreateModal(true);
    fetchCompletedQueries();
    setSelectedQuery("");
  };

  const handleCreateBill = () => {
    if (!selectedQuery) {
      alert("Please select a completed service request");
      return;
    }
    navigate(`/admin/bills/create/${selectedQuery}`);
  };

  const getPaymentStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
      overdue: "bg-red-100 text-red-800",
      cancelled: "bg-gray-100 text-gray-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading bills...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bills</h1>
            <p className="text-gray-600 mt-1">Manage all service bills</p>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span>+</span> Create Bill
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 text-center">
            <p className="text-2xl font-bold text-blue-600">
              {summary.total_bills}
            </p>
            <p className="text-sm text-gray-500">Total Bills</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {summary.pending}
            </p>
            <p className="text-sm text-gray-500">Pending</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 text-center">
            <p className="text-2xl font-bold text-green-600">{summary.paid}</p>
            <p className="text-sm text-gray-500">Paid</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 text-center">
            <p className="text-2xl font-bold text-red-600">{summary.overdue}</p>
            <p className="text-sm text-gray-500">Overdue</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 text-center">
            <p className="text-2xl font-bold text-purple-600">
              {formatCurrency(summary.total_amount)}
            </p>
            <p className="text-sm text-gray-500">Total Amount</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Status
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
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
          </div>
        )}

        {/* Bills List */}
        {bills.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-500 text-lg">No bills found</p>
            <p className="text-gray-400 text-sm mt-1">
              Create bills for completed service requests
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bills.map((bill) => (
              <div
                key={bill._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {bill.bill_number}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(bill.payment_status)}`}
                      >
                        {bill.payment_status.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(bill.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div>
                        <p className="text-sm text-gray-500">Customer</p>
                        <p className="font-medium text-gray-800">
                          {typeof bill.user === "object"
                            ? bill.user.name
                            : "Unknown"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {typeof bill.user === "object" ? bill.user.email : ""}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Service</p>
                        <p className="font-medium text-gray-800">
                          {bill.service_type}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Amount</p>
                        <p className="text-lg font-bold text-gray-900">
                          {formatCurrency(bill.total_amount)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Due: {new Date(bill.due_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/bills/${bill._id}`)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      View
                    </button>
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

      {/* Create Bill Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Create New Bill
            </h2>
            <p className="text-gray-600 mb-4">
              Select a completed service request to create a bill
            </p>

            {loadingQueries ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : completedQueries.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No completed queries available for billing
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  All completed queries already have bills or none are completed
                  yet
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {completedQueries.map((query) => (
                  <label
                    key={query._id}
                    className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedQuery === query._id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="query"
                        value={query._id}
                        checked={selectedQuery === query._id}
                        onChange={(e) => setSelectedQuery(e.target.value)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          #{query._id?.slice(-6)} - {query.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {query.service_type_required}
                        </p>
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {query.issue}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(query.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleCreateBill}
                disabled={!selectedQuery}
                className="flex-1 bg-gradient-to-r from-blue-600 to-sky-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Bill
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setSelectedQuery("");
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdminBillsList;
