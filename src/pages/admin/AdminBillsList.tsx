// pages/admin/AdminBillsList.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { type Bill } from "../../types";
import billingService from "../../service/billingService";
import Layout from "../../components/layout/layout";

const AdminBillsList: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [summary, setSummary] = useState({
    total_bills: 0,
    total_amount: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchBills();
  }, [currentPage]);

  const fetchBills = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
        limit: 20,
        sort_by: "created_at",
        sort_order: "desc",
      };

      const response = await billingService.getAllBills(params);
      if (response.success) {
        setBills(response.data || []);
        setSummary({
          total_bills: response.summary?.total_bills || 0,
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
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
            onClick={() => navigate("/admin/bills/create")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span>+</span> Create Bill
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 text-center">
            <p className="text-3xl font-bold text-blue-600">
              {summary.total_bills}
            </p>
            <p className="text-sm text-gray-500">Total Bills</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 text-center">
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(summary.total_amount)}
            </p>
            <p className="text-sm text-gray-500">Total Amount</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-4">
            <p className="text-red-700">{error}</p>
            <button
              onClick={fetchBills}
              className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Try again
            </button>
          </div>
        )}

        {/* Bills List */}
        {bills.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-500 text-lg">No bills found</p>
            <p className="text-gray-400 text-sm mt-1">
              Create your first bill by clicking the "Create Bill" button
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
                      <span className="text-sm text-gray-500">
                        {new Date(bill.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div>
                        <p className="text-sm text-gray-500">Customer</p>
                        <p className="font-medium text-gray-800">
                          {bill.customer_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {bill.customer_email}
                        </p>
                        <p className="text-sm text-gray-600">
                          {bill.customer_phone}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Service</p>
                        <p className="font-medium text-gray-800">
                          {bill.service_type}
                        </p>
                        <p className="text-sm text-gray-600 line-clamp-1">
                          {bill.service_description}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Worker</p>
                        <p className="font-medium text-gray-800">
                          {bill.worker_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {bill.worker_phone}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Items: {bill.items.length}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(bill.total_amount)}
                    </p>
                    <button
                      onClick={() => navigate(`/admin/bills/${bill._id}`)}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      View Details
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
    </Layout>
  );
};

export default AdminBillsList;
