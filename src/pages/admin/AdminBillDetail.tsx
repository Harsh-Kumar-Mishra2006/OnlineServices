import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { type Bill } from "../../types";
import billingService from "../../service/billingService";
import BillDetail from "../../components/bills/BillDetail";
import Layout from "../../components/layout/layout";

const AdminBillDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bill, setBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchBill();
    }
  }, [id]);

  const fetchBill = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await billingService.getBillById(id);
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

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this bill?")) return;

    try {
      const response = await billingService.deleteBill(id);
      if (response.success) {
        alert("Bill deleted successfully");
        navigate("/admin/bills");
      } else {
        alert(response.error || "Failed to delete bill");
      }
    } catch (err: any) {
      alert(err.message || "An error occurred");
    }
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

  if (error || !bill) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <p className="text-red-700">{error || "Bill not found"}</p>
            <button
              onClick={() => navigate("/admin/bills")}
              className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Back to Bills
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="relative">
        <BillDetail bill={bill} role="admin" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete Bill
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default AdminBillDetail;
