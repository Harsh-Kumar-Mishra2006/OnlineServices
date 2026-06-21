import React, { useState } from "react";
import Layout from "../../components/layout/layout";
import CreateQuery from "../../pages/Queries/CreateQuerry";
import MyQueriesList from "../../pages/Queries/MyQuerries";
import QueryDetails from "../../pages/Queries/QuerryDetails";
import RateService from "../../pages/Queries/RateService";

const UserQueries: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "create" | "list" | "details" | "rate"
  >("list");
  const [selectedQueryId, setSelectedQueryId] = useState<string | null>(null);

  const handleViewDetails = (id: string) => {
    setSelectedQueryId(id);
    setActiveTab("details");
  };

  const handleRateService = (id: string) => {
    setSelectedQueryId(id);
    setActiveTab("rate");
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
              Service Requests
            </h1>
            <p className="text-gray-600 mt-2">Manage your service requests</p>
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
              📋 My Requests
            </button>
            <button
              onClick={() => setActiveTab("create")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === "create"
                  ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-500/30"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              ✨ New Request
            </button>
            {activeTab === "details" && (
              <button
                onClick={handleBack}
                className="px-6 py-3 rounded-xl font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
              >
                ← Back
              </button>
            )}
            {activeTab === "rate" && (
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
            {activeTab === "create" && (
              <CreateQuery onSuccess={() => setActiveTab("list")} />
            )}

            {activeTab === "list" && (
              <MyQueriesList
                onViewDetails={handleViewDetails}
                onRateService={handleRateService}
              />
            )}

            {activeTab === "details" && selectedQueryId && (
              <QueryDetails
                queryId={selectedQueryId}
                onBack={handleBack}
                onRate={() => handleRateService(selectedQueryId)}
              />
            )}

            {activeTab === "rate" && selectedQueryId && (
              <RateService
                queryId={selectedQueryId}
                onSuccess={handleBack}
                onCancel={handleBack}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserQueries;
