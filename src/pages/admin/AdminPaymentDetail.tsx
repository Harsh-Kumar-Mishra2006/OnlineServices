import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { type Payment } from "../../types";
import paymentService from "../../service/paymentService";
import Layout from "../../components/layout/layout";

const AdminPaymentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verificationData, setVerificationData] = useState({
    status: "verified" as "verified" | "rejected",
    verification_notes: "",
  });

  useEffect(() => {
    if (id) {
      fetchPayment();
    }
  }, [id]);

  const fetchPayment = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await paymentService.getPaymentDetails(id);
      if (response.success) {
        setPayment(response.data);
      } else {
        setError(response.error || "Failed to fetch payment");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!id || !payment) return;
    setVerifying(true);
    try {
      const response = await paymentService.verifyPayment(id, verificationData);
      if (response.success) {
        alert(`Payment ${verificationData.status} successfully!`);
        await fetchPayment();
      } else {
        alert(response.error || "Failed to verify payment");
      }
    } catch (err: any) {
      alert(err.message || "An error occurred");
    } finally {
      setVerifying(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      verified: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading payment details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !payment) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <p className="text-red-700">{error || "Payment not found"}</p>
            <button
              onClick={() => navigate("/admin/payments")}
              className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Back to Payments
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const bill = typeof payment.bill === "object" ? payment.bill : null;
  const user = typeof payment.user === "object" ? payment.user : null;
  const verifiedBy =
    typeof payment.verified_by === "object" ? payment.verified_by : null;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate("/admin/payments")}
          className="text-blue-600 hover:text-blue-800 font-medium mb-6 inline-flex items-center"
        >
          ← Back to Payments
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-sky-500 px-6 py-4 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Payment Details</h1>
                <p className="text-blue-100">{bill?.bill_number || "N/A"}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-100">Status</p>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusBadge(payment.status)}`}
                >
                  {payment.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Payment Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Customer
                </h3>
                <p className="text-lg font-medium text-gray-900">
                  {user?.name || "N/A"}
                </p>
                <p className="text-gray-600">{user?.email}</p>
                <p className="text-gray-600">{user?.phone}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Payment
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(payment.payment_amount)}
                </p>
                <p className="text-sm text-gray-500">
                  Submitted: {new Date(payment.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Screenshot */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Payment Screenshot
              </h3>
              <div className="mt-2 border rounded-lg p-2 bg-gray-50">
                <img
                  src={payment.payment_screenshot.url}
                  alt="Payment Screenshot"
                  className="max-h-96 mx-auto object-contain"
                />
                <div className="mt-2 text-center">
                  <a
                    href={payment.payment_screenshot.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Open in new tab
                  </a>
                </div>
              </div>
            </div>

            {/* User Notes */}
            {payment.user_notes && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  User Notes
                </h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                  {payment.user_notes}
                </p>
              </div>
            )}

            {/* Verification Info */}
            {payment.status !== "pending" && (
              <div
                className={`p-4 rounded-lg ${
                  payment.status === "verified" ? "bg-green-50" : "bg-red-50"
                }`}
              >
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  {payment.status === "verified"
                    ? "✅ Verified"
                    : "❌ Rejected"}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Verified by: {verifiedBy?.name || "Unknown"} on{" "}
                  {new Date(payment.verified_at!).toLocaleString()}
                </p>
                {payment.verification_notes && (
                  <p className="text-sm text-gray-600 mt-1">
                    Notes: {payment.verification_notes}
                  </p>
                )}
              </div>
            )}

            {/* Verification Form (only for pending) */}
            {payment.status === "pending" && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Verify Payment
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Decision *
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value="verified"
                          checked={verificationData.status === "verified"}
                          onChange={() =>
                            setVerificationData({
                              ...verificationData,
                              status: "verified",
                            })
                          }
                          className="w-4 h-4 text-green-600"
                        />
                        <span className="text-green-600 font-medium">
                          ✅ Verify
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value="rejected"
                          checked={verificationData.status === "rejected"}
                          onChange={() =>
                            setVerificationData({
                              ...verificationData,
                              status: "rejected",
                            })
                          }
                          className="w-4 h-4 text-red-600"
                        />
                        <span className="text-red-600 font-medium">
                          ❌ Reject
                        </span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Verification Notes (Optional)
                    </label>
                    <textarea
                      value={verificationData.verification_notes}
                      onChange={(e) =>
                        setVerificationData({
                          ...verificationData,
                          verification_notes: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                      placeholder="Add notes about this verification..."
                    />
                  </div>
                  <button
                    onClick={handleVerify}
                    disabled={verifying}
                    className="w-full bg-gradient-to-r from-blue-600 to-sky-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {verifying ? "Processing..." : "Submit Verification"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPaymentDetail;
