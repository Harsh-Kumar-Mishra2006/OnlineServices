// pages/admin/AdminCreateBill.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { type BillItem } from "../../types";
import billingService from "../../service/billingService";
import Layout from "../../components/layout/layout";

const AdminCreateBill: React.FC = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [billData, setBillData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    customer_address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
    },
    service_type: "",
    service_description: "",
    worker_name: "",
    worker_phone: "",
    items: [{ description: "", quantity: 1, rate: 0, amount: 0 }],
    discount: 0,
    notes: "",
  });

  const addItem = () => {
    setBillData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { description: "", quantity: 1, rate: 0, amount: 0 },
      ],
    }));
  };

  const removeItem = (index: number) => {
    if (billData.items.length === 1) return;
    setBillData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const updateItem = (index: number, field: keyof BillItem, value: any) => {
    setBillData((prev) => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      if (field === "quantity" || field === "rate") {
        newItems[index].amount =
          newItems[index].quantity * newItems[index].rate;
      }
      return { ...prev, items: newItems };
    });
  };

  const calculateTotals = () => {
    const subtotal = billData.items.reduce((sum, item) => sum + item.amount, 0);
    const discount = billData.discount || 0;
    const total = subtotal - discount;
    return { subtotal, discount, total };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !billData.customer_name ||
      !billData.customer_email ||
      !billData.customer_phone
    ) {
      setError("Please fill in all customer details");
      return;
    }

    if (!billData.service_type || !billData.service_description) {
      setError("Please fill in service details");
      return;
    }

    if (!billData.worker_name || !billData.worker_phone) {
      setError("Please fill in worker details");
      return;
    }

    const invalidItems = billData.items.some(
      (item) => !item.description || item.rate <= 0,
    );
    if (invalidItems) {
      setError("Please fill in all item descriptions and rates");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await billingService.createBill({
        customer_name: billData.customer_name,
        customer_email: billData.customer_email,
        customer_phone: billData.customer_phone,
        customer_address: billData.customer_address,
        service_type: billData.service_type,
        service_description: billData.service_description,
        worker_name: billData.worker_name,
        worker_phone: billData.worker_phone,
        items: billData.items,
        discount: billData.discount,
        notes: billData.notes,
      });

      if (response.success) {
        alert("Bill created successfully!");
        navigate("/admin/bills");
      } else {
        setError(response.error || "Failed to create bill");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const { subtotal, discount, total } = calculateTotals();

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800 font-medium mb-4 inline-flex items-center"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Create New Bill</h1>
          <p className="text-gray-600 mt-1">
            Manually enter all billing details
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Customer Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={billData.customer_name}
                  onChange={(e) =>
                    setBillData({ ...billData, customer_name: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Email *
                </label>
                <input
                  type="email"
                  value={billData.customer_email}
                  onChange={(e) =>
                    setBillData({ ...billData, customer_email: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Phone *
                </label>
                <input
                  type="text"
                  value={billData.customer_phone}
                  onChange={(e) =>
                    setBillData({ ...billData, customer_phone: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  placeholder="+1 234 567 890"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street
                </label>
                <input
                  type="text"
                  value={billData.customer_address.street}
                  onChange={(e) =>
                    setBillData({
                      ...billData,
                      customer_address: {
                        ...billData.customer_address,
                        street: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  placeholder="123 Main St"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={billData.customer_address.city}
                  onChange={(e) =>
                    setBillData({
                      ...billData,
                      customer_address: {
                        ...billData.customer_address,
                        city: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  placeholder="New York"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={billData.customer_address.state}
                  onChange={(e) =>
                    setBillData({
                      ...billData,
                      customer_address: {
                        ...billData.customer_address,
                        state: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  placeholder="NY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  value={billData.customer_address.pincode}
                  onChange={(e) =>
                    setBillData({
                      ...billData,
                      customer_address: {
                        ...billData.customer_address,
                        pincode: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  placeholder="10001"
                />
              </div>
            </div>
          </div>

          {/* Service Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Service Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Type *
                </label>
                <input
                  type="text"
                  value={billData.service_type}
                  onChange={(e) =>
                    setBillData({ ...billData, service_type: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  placeholder="Plumbing, Electrical, etc."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Description *
                </label>
                <input
                  type="text"
                  value={billData.service_description}
                  onChange={(e) =>
                    setBillData({
                      ...billData,
                      service_description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  placeholder="Brief description of service"
                  required
                />
              </div>
            </div>
          </div>

          {/* Worker Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Worker Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Worker Name *
                </label>
                <input
                  type="text"
                  value={billData.worker_name}
                  onChange={(e) =>
                    setBillData({ ...billData, worker_name: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  placeholder="Jane Smith"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Worker Phone *
                </label>
                <input
                  type="text"
                  value={billData.worker_phone}
                  onChange={(e) =>
                    setBillData({ ...billData, worker_phone: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  placeholder="+1 234 567 890"
                  required
                />
              </div>
            </div>
          </div>

          {/* Bill Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Bill Items
            </h2>

            <div className="grid grid-cols-12 gap-3 mb-2 text-sm font-medium text-gray-500">
              <div className="col-span-6">Description</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-2 text-center">Rate ($)</div>
              <div className="col-span-1 text-center">Amount</div>
              <div className="col-span-1"></div>
            </div>

            {billData.items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-3 mb-3 items-center"
              >
                <div className="col-span-6">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) =>
                      updateItem(index, "description", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    placeholder="Item description"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(
                        index,
                        "quantity",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-center"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.rate}
                    onChange={(e) =>
                      updateItem(index, "rate", parseFloat(e.target.value) || 0)
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-center"
                    required
                  />
                </div>
                <div className="col-span-1 text-center font-medium text-gray-700">
                  ${item.amount.toFixed(2)}
                </div>
                <div className="col-span-1 text-center">
                  {billData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addItem}
              className="mt-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              + Add Item
            </button>
          </div>

          {/* Totals & Notes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={billData.discount}
                  onChange={(e) =>
                    setBillData({
                      ...billData,
                      discount: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                />
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={billData.notes}
                    onChange={(e) =>
                      setBillData({ ...billData, notes: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    placeholder="Additional notes..."
                  />
                </div>
              </div>
              <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount:</span>
                  <span className="font-medium text-red-600">
                    -${discount.toFixed(2)}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-xl font-bold text-green-600">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Creating Bill..." : "Create Bill"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AdminCreateBill;
