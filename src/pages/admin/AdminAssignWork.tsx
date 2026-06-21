import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../../components/layout/layout";
import assignmentService from "../../service/assignmentService";
import queryService from "../../service/querryService";
import authService from "../../service/authService";
import { URGENCY_LEVELS } from "../../types";

const AdminAssignWork: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [debugInfo, setDebugInfo] = useState<string>("");

  // Get workerId from URL params
  const searchParams = new URLSearchParams(location.search);
  const workerId = searchParams.get("workerId");
  const workerName = searchParams.get("workerName");

  const [formData, setFormData] = useState({
    worker_id: workerId || "",
    worker_name: workerName || "",
    user_name: "",
    user_email: "",
    user_phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      landmark: "",
    },
    issue: "",
    service_type_required: "",
    urgency: "medium" as const,
    scheduled_date: new Date().toISOString().split("T")[0],
    scheduled_time_slot: "anytime" as const,
    estimated_hours: 2,
    admin_notes: "",
  });

  const [availableQueries, setAvailableQueries] = useState<any[]>([]);
  const [loadingQueries, setLoadingQueries] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState<string>("");
  const [workerServiceType, setWorkerServiceType] = useState<string>("");

  useEffect(() => {
    if (workerId) {
      fetchAvailableQueries();
    } else {
      setError("No worker selected. Please go back and select a worker.");
    }
  }, [workerId]);

  const fetchAvailableQueries = async () => {
    setLoadingQueries(true);
    setError("");
    setDebugInfo("");

    try {
      console.log("🔍 Fetching worker details for ID:", workerId);

      // First get worker details to know their service type
      const workerResponse = await authService.getWorkerById(workerId!);
      console.log("📦 Worker response:", workerResponse);

      if (workerResponse.success && workerResponse.data) {
        const serviceType = workerResponse.data.service_type;
        setWorkerServiceType(serviceType);
        setDebugInfo(`Worker Service Type: ${serviceType}`);

        console.log(
          "🔍 Fetching pending queries for service type:",
          serviceType,
        );

        // Get pending queries matching this service type
        const queriesResponse = await queryService.getAllQueries({
          status: "pending",
          limit: 100,
        });

        console.log("📦 All pending queries:", queriesResponse);

        if (queriesResponse.success) {
          // Filter queries locally to match service type
          const filteredQueries = queriesResponse.data.filter(
            (q: any) => q.service_type_required === serviceType,
          );

          console.log("✅ Filtered queries:", filteredQueries);
          setAvailableQueries(filteredQueries || []);

          if (filteredQueries.length === 0) {
            setDebugInfo(
              `No pending requests found for service type: ${serviceType}`,
            );
          } else {
            setDebugInfo(
              `Found ${filteredQueries.length} pending requests for ${serviceType}`,
            );
          }
        } else {
          setError(queriesResponse.error || "Failed to fetch queries");
          setDebugInfo(`Error fetching queries: ${queriesResponse.error}`);
        }
      } else {
        setError(workerResponse.error || "Failed to fetch worker details");
        setDebugInfo(`Worker fetch error: ${workerResponse.error}`);
      }
    } catch (err: any) {
      console.error("❌ Error fetching available queries:", err);
      setError(err.message || "An error occurred");
      setDebugInfo(`Exception: ${err.message}`);
    } finally {
      setLoadingQueries(false);
    }
  };

  const handleQuerySelect = (queryId: string) => {
    setSelectedQuery(queryId);
    const query = availableQueries.find((q) => q._id === queryId);
    if (query) {
      setFormData((prev) => ({
        ...prev,
        user_name: query.name || "",
        user_email: query.email || "",
        user_phone: query.phone || "",
        address: query.address || {
          street: "",
          city: "",
          state: "",
          pincode: "",
          landmark: "",
        },
        issue: query.issue || "",
        service_type_required: query.service_type_required || "",
        urgency: query.urgency || "medium",
      }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!selectedQuery) {
      setError("Please select a query to assign");
      setLoading(false);
      return;
    }

    if (!formData.scheduled_date) {
      setError("Please select a scheduled date");
      setLoading(false);
      return;
    }

    try {
      const assignmentData = {
        queryId: selectedQuery,
        workerId: workerId!,
        scheduled_date: formData.scheduled_date,
        scheduled_time_slot: formData.scheduled_time_slot,
        admin_notes: formData.admin_notes,
        estimated_hours: formData.estimated_hours,
      };

      console.log("📤 Submitting assignment:", assignmentData);

      const response = await assignmentService.createAssignment(assignmentData);

      if (response.success) {
        setSuccess(
          `✅ Worker "${formData.worker_name}" assigned successfully!`,
        );
        setTimeout(() => {
          navigate("/admin/assignments");
        }, 2000);
      } else {
        setError(response.error || "Failed to assign worker");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/admin/workers")}
                className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
              >
                ← Back to Workers
              </button>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mt-4">
              Assign Work
            </h1>
            <p className="text-gray-600 mt-2">
              Assign a service request to {formData.worker_name || "a worker"}
            </p>
          </div>

          {/* Debug Info */}
          {debugInfo && (
            <div className="bg-gray-100 border border-gray-300 p-3 rounded-lg mb-4 text-sm">
              <p className="font-medium text-gray-700">🔍 Debug Info:</p>
              <p className="text-gray-600">{debugInfo}</p>
            </div>
          )}

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl shadow-blue-500/10 overflow-hidden">
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Worker Info */}
                <div className="bg-blue-50 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Assigned Worker
                  </h3>
                  <p className="font-semibold text-gray-900 text-lg">
                    {formData.worker_name || "Not selected"}
                  </p>
                  {workerId && (
                    <p className="text-sm text-gray-600">ID: {workerId}</p>
                  )}
                  {workerServiceType && (
                    <p className="text-sm text-gray-600">
                      Service Type: {workerServiceType}
                    </p>
                  )}
                </div>

                {/* Select Query */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Select Service Request
                  </h3>
                  {loadingQueries ? (
                    <div className="text-center py-4">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p className="mt-2 text-gray-600">
                        Loading available requests...
                      </p>
                    </div>
                  ) : availableQueries.length === 0 ? (
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
                      <p className="text-yellow-700">
                        No pending requests available for this worker's service
                        type.
                      </p>
                      <p className="text-yellow-600 text-sm mt-1">
                        {workerServiceType
                          ? `Worker service type: ${workerServiceType}`
                          : "Worker service type not found"}
                      </p>
                      <button
                        type="button"
                        onClick={fetchAvailableQueries}
                        className="mt-2 text-blue-600 hover:text-blue-700 font-semibold text-sm"
                      >
                        🔄 Refresh
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {availableQueries.map((query) => (
                        <label
                          key={query._id}
                          className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${
                            selectedQuery === query._id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <input
                              type="radio"
                              name="query"
                              value={query._id}
                              checked={selectedQuery === query._id}
                              onChange={(e) =>
                                handleQuerySelect(e.target.value)
                              }
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-3 flex-wrap">
                                <p className="font-semibold text-gray-900">
                                  {query.name}
                                </p>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    query.urgency === "urgent"
                                      ? "bg-red-100 text-red-700"
                                      : query.urgency === "very_high"
                                        ? "bg-orange-100 text-orange-700"
                                        : query.urgency === "high"
                                          ? "bg-yellow-100 text-yellow-700"
                                          : "bg-blue-100 text-blue-700"
                                  }`}
                                >
                                  {URGENCY_LEVELS[
                                    query.urgency as keyof typeof URGENCY_LEVELS
                                  ]?.label || query.urgency}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">
                                {query.service_type_required}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                {query.issue}
                              </p>
                              <p className="text-xs text-gray-400">
                                {query.address?.city}, {query.address?.state}
                              </p>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* User Details - Only show if query selected */}
                {selectedQuery && (
                  <>
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        User Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                          </label>
                          <input
                            type="text"
                            value={formData.user_name}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50"
                            disabled
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            value={formData.user_email}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50"
                            disabled
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone
                          </label>
                          <input
                            type="tel"
                            value={formData.user_phone}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50"
                            disabled
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Service Type
                          </label>
                          <input
                            type="text"
                            value={formData.service_type_required}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50"
                            disabled
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-sm font-medium text-gray-500">
                        Issue Description
                      </h3>
                      <p className="mt-1 text-gray-800 whitespace-pre-wrap">
                        {formData.issue}
                      </p>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-sm font-medium text-gray-500">
                        Address
                      </h3>
                      <p className="mt-1 text-gray-800">
                        {formData.address.street}, {formData.address.city},{" "}
                        {formData.address.state} - {formData.address.pincode}
                      </p>
                    </div>
                  </>
                )}

                {/* Schedule */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Schedule
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Scheduled Date *
                      </label>
                      <input
                        type="date"
                        name="scheduled_date"
                        value={formData.scheduled_date}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Time Slot
                      </label>
                      <select
                        name="scheduled_time_slot"
                        value={formData.scheduled_time_slot}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                      >
                        <option value="morning">🌅 Morning (6AM - 12PM)</option>
                        <option value="afternoon">
                          ☀️ Afternoon (12PM - 5PM)
                        </option>
                        <option value="evening">🌆 Evening (5PM - 9PM)</option>
                        <option value="night">🌙 Night (9PM - 6AM)</option>
                        <option value="anytime">🕐 Anytime</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estimated Hours
                      </label>
                      <input
                        type="number"
                        name="estimated_hours"
                        value={formData.estimated_hours}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                        min="1"
                        step="0.5"
                      />
                    </div>
                  </div>
                </div>

                {/* Admin Notes */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Admin Notes
                  </h3>
                  <textarea
                    name="admin_notes"
                    value={formData.admin_notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    placeholder="Add any special instructions or notes for the worker..."
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                    <p className="text-green-700 text-sm">{success}</p>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading || !selectedQuery}
                    className="flex-1 relative overflow-hidden bg-gradient-to-r from-blue-600 to-sky-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/40 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <span className="relative z-10">
                      {loading ? "Assigning..." : "Assign Work"}
                    </span>
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-blue-500 to-sky-400 transition-transform duration-500 hover:translate-x-0"></div>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/admin/workers")}
                    className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminAssignWork;
