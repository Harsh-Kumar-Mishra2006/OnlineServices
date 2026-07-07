import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { type UserQuery, type BillItem } from "../../types";
import queryService from "../../service/querryService";
import billingService from "../../service/billingService";
import Layout from "../../components/layout/layout";

const AdminCreateBill: React.FC = () => {
  const { queryId } = useParams<{ queryId: string }>();
  const navigate = useNavigate();
  const [query, setQuery] = useState<UserQuery | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [billData, setBillData] = useState({
    items: [{ description: "", quantity: 1, rate: 0, amount: 0 }],
    tax_rate: 0,
    discount: 0,
    discount_type: "fixed" as "percentage" | "fixed",
    due_date: "",
    notes: "",
    terms_conditions:
      "Payment is due within 15 days. Late payments may incur additional charges.",
  });

  useEffect(() => {
    if (queryId) {
      fetchQuery();
    }
  }, [queryId]);

  const fetchQuery = async () => {
    if (!queryId) return;
    setLoading(true);
    try {
      const response = await queryService.getQueryById(queryId);
      if (response.success) {
        setQuery(response.data);
        // Pre-fill item description
        setBillData((prev) => ({
          ...prev,
          items: [
            {
              description: `Service: ${response.data.service_type_required}`,
              quantity: 1,
              rate: 0,
              amount: 0,
            },
          ],
        }));
      } else {
        setError(response.error || "Failed to fetch query");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

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

      // Recalculate amount
      if (field === "quantity" || field === "rate") {
        newItems[index].amount =
          newItems[index].quantity * newItems[index].rate;
      }

      return { ...prev, items: newItems };
    });
  };

  const calculateTotals = () => {
    const subtotal = billData.items.reduce((sum, item) => sum + item.amount, 0);
    const tax = (subtotal * billData.tax_rate) / 100;
    let discount = billData.discount;

    if (billData.discount_type === "percentage") {
      discount = (subtotal * billData.discount) / 100;
    }

    const total = subtotal + tax - discount;
    return { subtotal, tax, discount, total };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryId) return;

    // Validate items
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
        query_id: queryId,
        items: billData.items,
        tax_rate: billData.tax_rate,
        discount: billData.discount,
        discount_type: billData.discount_type,
        due_date: billData.due_date,
        notes: billData.notes,
        terms_conditions: billData.terms_conditions,
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

  const { subtotal, tax, discount, total } = calculateTotals();

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading query details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !query) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <p className="text-red-700">{error || "Query not found"}</p>
            <button
              onClick={() => navigate("/admin/queries")}
              className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Back to Queries
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800 font-medium mb-4 inline-flex items-center"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Create Bill</h1>
          <p className="text-gray-600 mt-1">
            Service Request #{query._id?.slice(-6)} -{" "}
            {query.service_type_required}
          </p>
        </div>

        {/* Query Summary */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Customer</p>
              <p className="font-medium">{query.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{query.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{query.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Service</p>
              <p className="font-medium">{query.service_type_required}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Bill Items
            </h2>

            {billData.items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-3 mb-3 items-end"
              >
                <div className="col-span-5">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Qty
                  </label>
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
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    required
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rate ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.rate}
                    onChange={(e) =>
                      updateItem(index, "rate", parseFloat(e.target.value) || 0)
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    required
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <p className="text-gray-900 font-medium py-2">
                    ${item.amount.toFixed(2)}
                  </p>
                </div>
                <div className="col-span-1">
                  {billData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-500 hover:text-red-700 p-2"
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

          {/* Totals */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={billData.tax_rate}
                    onChange={(e) =>
                      setBillData({
                        ...billData,
                        tax_rate: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount
                  </label>
                  <div className="flex gap-3">
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
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    />
                    <select
                      value={billData.discount_type}
                      onChange={(e) =>
                        setBillData({
                          ...billData,
                          discount_type: e.target.value as
                            | "percentage"
                            | "fixed",
                        })
                      }
                      className="px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    >
                      <option value="fixed">Fixed ($)</option>
                      <option value="percentage">Percentage (%)</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Tax ({billData.tax_rate}%):
                  </span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
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

          {/* Additional Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={billData.due_date}
                  onChange={(e) =>
                    setBillData({ ...billData, due_date: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  value={billData.notes}
                  onChange={(e) =>
                    setBillData({ ...billData, notes: e.target.value })
                  }
                  placeholder="Additional notes..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Terms & Conditions
              </label>
              <textarea
                value={billData.terms_conditions}
                onChange={(e) =>
                  setBillData({ ...billData, terms_conditions: e.target.value })
                }
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
              />
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
