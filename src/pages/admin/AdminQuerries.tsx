import React, { useState } from "react";
import Layout from "../../components/layout/layout";
import AdminQueriesList from "../../pages/admin/AdminQuerryDashboard";
import AdminQueryDetails from "../../pages/admin/AdminQuerryDetails";

const AdminQueries: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"list" | "details">("list");
  const [selectedQueryId, setSelectedQueryId] = useState<string | null>(null);

  const handleViewDetails = (id: string) => {
    setSelectedQueryId(id);
    setActiveTab("details");
  };

  const handleBack = () => {
    setActiveTab("list");
    setSelectedQueryId(null);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Service Requests Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage all user service requests
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-2xl shadow-xl shadow-blue-500/10 p-2 mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab("list")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === "list"
                  ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-500/30"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              📋 All Requests
            </button>
            {activeTab === "details" && (
              <button
                onClick={handleBack}
                className="px-6 py-3 rounded-xl font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
              >
                ← Back
              </button>
            )}
          </div>

          {/* Content */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl shadow-blue-500/10 p-6">
            {activeTab === "list" && (
              <AdminQueriesList onViewDetails={handleViewDetails} />
            )}

            {activeTab === "details" && selectedQueryId && (
              <AdminQueryDetails
                queryId={selectedQueryId}
                onBack={handleBack}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminQueries;
