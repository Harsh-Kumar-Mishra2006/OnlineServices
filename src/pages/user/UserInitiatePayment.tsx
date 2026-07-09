import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import paymentService from "../../service/paymentService";
import billingService from "../../service/billingService";
import { type Bill } from "../../types";
import Layout from "../../components/layout/layout";

const UserInitiatePayment: React.FC = () => {
  const { billId } = useParams<{ billId: string }>();
  const navigate = useNavigate();
  const [bill, setBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [paymentData, setPaymentData] = useState({
    screenshot: null as File | null,
    user_notes: "",
  });

  useEffect(() => {
    if (billId) {
      fetchBill();
    }
  }, [billId]);

  const fetchBill = async () => {
    if (!billId) return;
    setLoading(true);
    try {
      const response = await billingService.getBillById(billId);
      if (response.success) {
        setBill(response.data);
      } else {
        setError(response.error || "Failed to fetch bill");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentData({ ...paymentData, screenshot: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!paymentData.screenshot) {
      setError("Please upload a payment screenshot");
      return;
    }

    if (!billId) {
      setError("Bill ID is missing");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await paymentService.initiatePayment({
        bill_id: billId,
        user_notes: paymentData.user_notes,
        screenshot: paymentData.screenshot,
      });

      if (response.success) {
        setSuccess(
          "Payment submitted successfully! Please wait for admin verification.",
        );
        setTimeout(() => {
          navigate("/user/payments");
        }, 3000);
      } else {
        setError(response.error || "Failed to submit payment");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setSubmitting(false);
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
            <p className="mt-4 text-gray-600">Loading bill details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate("/user/bills")}
          className="text-blue-600 hover:text-blue-800 font-medium mb-6 inline-flex items-center"
        >
          ← Back to Bills
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Make Payment
          </h1>

          {bill && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-2">
                <p className="text-sm text-gray-500">Bill Number</p>
                <p className="text-sm font-medium">{bill.bill_number}</p>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="text-sm font-bold text-green-600">
                  {formatCurrency(bill.total_amount)}
                </p>
                <p className="text-sm text-gray-500">Service</p>
                <p className="text-sm font-medium">{bill.service_type}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* QR Code Section - Add your QR code image here */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <h3 className="text-sm font-medium text-gray-700 mb-4">
                Scan QR Code to Pay
              </h3>
              <div className="flex justify-center">
                <img
                  src="/payment-qr-code.jpg" // Replace with your QR code image path
                  alt="Payment QR Code"
                  className="w-48 h-48 object-contain border rounded-lg"
                />
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Scan this QR code using your payment app and make the payment
              </p>
            </div>

            {/* Upload Screenshot */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Payment Screenshot *
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="mb-1 text-sm text-gray-500">
                      {paymentData.screenshot
                        ? paymentData.screenshot.name
                        : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, JPEG (Max 5MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                  />
                </label>
              </div>
              {paymentData.screenshot && (
                <p className="mt-2 text-sm text-green-600">
                  ✅ File uploaded: {paymentData.screenshot.name}
                </p>
              )}
            </div>

            {/* User Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={paymentData.user_notes}
                onChange={(e) =>
                  setPaymentData({ ...paymentData, user_notes: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                placeholder="Any additional notes about the payment..."
              />
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                <p className="text-green-700">{success}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit Payment"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default UserInitiatePayment;
