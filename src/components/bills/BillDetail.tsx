import React from "react";
import { useNavigate } from "react-router-dom";
import { type Bill } from "../../types";

interface BillDetailProps {
  bill: Bill;
  role: "admin" | "user";
}

const BillDetail: React.FC<BillDetailProps> = ({ bill, role }) => {
  const navigate = useNavigate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const handlePayment = () => {
    if (role === "user") {
      navigate(`/user/payments/initiate/${bill._id}`);
    }
  };

  const handleViewPayment = () => {
    if (role === "user") {
      navigate(`/user/payments`);
    } else {
      navigate(`/admin/payments`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() =>
          navigate(role === "admin" ? "/admin/bills" : "/user/bills")
        }
        className="text-blue-600 hover:text-blue-800 font-medium mb-6 inline-flex items-center"
      >
        ← Back to Bills
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-sky-500 px-6 py-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">{bill.bill_number}</h1>
              <p className="text-blue-100">
                Created: {new Date(bill.created_at).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100">Total Amount</p>
              <p className="text-3xl font-bold">
                {formatCurrency(bill.total_amount)}
              </p>
              {bill.is_paid && (
                <span className="text-xs bg-green-500 text-white px-3 py-1 rounded-full mt-1 inline-block">
                  ✅ Paid
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Rest of the bill details... (same as before) */}

          {/* Customer & Worker Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Customer
              </h3>
              <p className="text-lg font-medium text-gray-900">
                {bill.customer_name}
              </p>
              <p className="text-gray-600">{bill.customer_email}</p>
              <p className="text-gray-600">{bill.customer_phone}</p>
              {bill.customer_address && (
                <p className="text-gray-600 text-sm">
                  {bill.customer_address.street &&
                    `${bill.customer_address.street}, `}
                  {bill.customer_address.city &&
                    `${bill.customer_address.city}, `}
                  {bill.customer_address.state &&
                    `${bill.customer_address.state} `}
                  {bill.customer_address.pincode &&
                    `- ${bill.customer_address.pincode}`}
                </p>
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Worker
              </h3>
              <p className="text-lg font-medium text-gray-900">
                {bill.worker_name}
              </p>
              <p className="text-gray-600">{bill.worker_phone}</p>
              <p className="text-gray-600 text-sm">{bill.service_type}</p>
            </div>
          </div>

          {/* Service Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Service
            </h3>
            <p className="text-gray-800">{bill.service_description}</p>
          </div>

          {/* Items Table - same as before */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Items
            </h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                      Description
                    </th>
                    <th className="px-4 py-2 text-center text-sm font-medium text-gray-500">
                      Qty
                    </th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">
                      Rate
                    </th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bill.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-gray-800">
                        {item.description}
                      </td>
                      <td className="px-4 py-2 text-center text-gray-800">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-2 text-right text-gray-800">
                        {formatCurrency(item.rate)}
                      </td>
                      <td className="px-4 py-2 text-right font-medium text-gray-900">
                        {formatCurrency(item.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-2 text-right font-medium text-gray-600"
                    >
                      Subtotal:
                    </td>
                    <td className="px-4 py-2 text-right font-medium text-gray-900">
                      {formatCurrency(bill.subtotal)}
                    </td>
                  </tr>
                  {bill.discount > 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-2 text-right font-medium text-red-600"
                      >
                        Discount:
                      </td>
                      <td className="px-4 py-2 text-right font-medium text-red-600">
                        -{formatCurrency(bill.discount)}
                      </td>
                    </tr>
                  )}
                  <tr className="border-t-2 border-gray-300">
                    <td
                      colSpan={3}
                      className="px-4 py-3 text-right font-bold text-gray-900"
                    >
                      Total:
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-green-600 text-lg">
                      {formatCurrency(bill.total_amount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Notes */}
          {bill.notes && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Notes
              </h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                {bill.notes}
              </p>
            </div>
          )}

          {/* Payment Actions */}
          {role === "user" && !bill.is_paid && (
            <div className="border-t border-gray-200 pt-6">
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handlePayment}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl transition-all"
                >
                  💳 Complete Payment
                </button>
              </div>
            </div>
          )}

          {role === "user" && bill.is_paid && (
            <div className="border-t border-gray-200 pt-6">
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleViewPayment}
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all"
                >
                  👁️ View Payment
                </button>
              </div>
            </div>
          )}

          {role === "admin" && (
            <div className="border-t border-gray-200 pt-6">
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleViewPayment}
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all"
                >
                  👁️ View All Payments
                </button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-gray-200 pt-4 text-sm text-gray-500">
            <p>
              Created by:{" "}
              {typeof bill.created_by === "object"
                ? bill.created_by.name
                : "Admin"}
            </p>
            <p>Bill Number: {bill.bill_number}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillDetail;
