// pages/user/UserPayments.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { type Payment } from "../../types";
import paymentService from "../../service/paymentService";
import Layout from "../../components/layout/layout";

const UserPayments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [summary, setSummary] = useState({
    total_payments: 0,
    pending: 0,
    verified: 0,
    rejected: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchPayments();
  }, [currentPage]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
        limit: 10,
      };

      const response = await paymentService.getMyPayments(params);
      if (response.success) {
        setPayments(response.data || []);
        setSummary({
          total_payments: response.summary?.total_payments || 0,
          pending: response.summary?.pending || 0,
          verified: response.summary?.verified || 0,
          rejected: response.summary?.rejected || 0,
        });
        setTotalPages(response.pages || 1);
      } else {
        setError(response.error || "Failed to fetch payments");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Function to get user-friendly status (always show verified unless rejected)
  const getUserFriendlyStatus = (actualStatus: string) => {
    // If rejected, show rejected
    if (actualStatus === "rejected") {
      return {
        label: "REJECTED",
        color: "bg-red-100 text-red-800",
        icon: "❌",
      };
    }
    // For pending or verified, always show verified to the user
    return {
      label: "✅ VERIFIED",
      color: "bg-green-100 text-green-800",
      icon: "✅",
    };
  };

  // Get actual status badge for admin reference (if needed)
  // const getActualStatusBadge = (status: string) => {
  //   const colors = {
  //     pending: "bg-yellow-100 text-yellow-800",
  //     verified: "bg-green-100 text-green-800",
  //     rejected: "bg-red-100 text-red-800",
  //   };
  //   return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  // };

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
            <p className="mt-4 text-gray-600">Loading payments...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-[70vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Payments</h1>
            <p className="text-gray-600 mt-1">Track all your payment history</p>
          </div>
        </div>

        {/* Stats Cards - Show user-friendly stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 text-center">
            <p className="text-2xl font-bold text-blue-600">
              {summary.total_payments}
            </p>
            <p className="text-sm text-gray-500">Total Payments</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 text-center">
            <p className="text-2xl font-bold text-green-600">
              {summary.total_payments - summary.rejected}
            </p>
            <p className="text-sm text-gray-500">Successful</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 text-center">
            <p className="text-2xl font-bold text-red-600">
              {summary.rejected}
            </p>
            <p className="text-sm text-gray-500">Rejected</p>
          </div>
          {/* <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {summary.pending}
            </p>
            <p className="text-sm text-gray-500">Processing</p>
          </div> */}
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Payments List */}
        {payments.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-500 text-lg">No payments found</p>
            <p className="text-gray-400 text-sm mt-1">
              You haven't made any payments yet
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => {
              const bill =
                typeof payment.bill === "object" ? payment.bill : null;
              // Get user-friendly status
              const userStatus = getUserFriendlyStatus(payment.status);

              return (
                <div
                  key={payment._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {bill?.bill_number || "N/A"}
                        </h3>
                        {/* Show user-friendly status (always verified unless rejected) */}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${userStatus.color}`}
                        >
                          {userStatus.label}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(payment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div>
                          <p className="text-sm text-gray-500">Amount</p>
                          <p className="font-bold text-green-600">
                            {formatCurrency(payment.payment_amount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Service</p>
                          <p className="font-medium">
                            {bill?.service_type || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Screenshot</p>
                          <button
                            onClick={() =>
                              window.open(
                                payment.payment_screenshot.url,
                                "_blank",
                              )
                            }
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            View Screenshot
                          </button>
                        </div>
                      </div>
                      {/* Show actual status for transparency (optional) */}
                      {payment.status === "pending" && (
                        <div className="mt-2 text-xs text-gray-400">
                          <span className="inline-flex items-center gap-1">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                            Your payment is being processed. You'll receive
                            confirmation soon.
                          </span>
                        </div>
                      )}
                      {payment.status === "rejected" && (
                        <div className="mt-2 text-xs text-red-500">
                          {payment.verification_notes ? (
                            <span>Reason: {payment.verification_notes}</span>
                          ) : (
                            <span>
                              Payment was rejected. Please contact support.
                            </span>
                          )}
                        </div>
                      )}
                      {payment.status === "verified" && (
                        <div className="mt-2 text-xs text-green-500">
                          ✓ Payment verified successfully
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => navigate(`/user/payments/${payment._id}`)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
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

export default UserPayments;
