import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { type Bill } from "../../types";
import billingService from "../../service/billingService";
import BillDetail from "../../components/bills/BillDetail";
import Layout from "../../components/layout/layout";

const UserBillDetail: React.FC = () => {
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
      const response = await billingService.getUserBillById(id);
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
              onClick={() => navigate("/user/bills")}
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
      <BillDetail bill={bill} role="user" />
    </Layout>
  );
};

export default UserBillDetail;
