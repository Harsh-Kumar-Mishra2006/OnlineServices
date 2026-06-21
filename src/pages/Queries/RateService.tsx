import React, { useState } from "react";
import queryService from "../../service/querryService";

interface RateServiceProps {
  queryId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const RateService: React.FC<RateServiceProps> = ({
  queryId,
  onSuccess,
  onCancel,
}) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await queryService.submitRating(
        queryId,
        rating,
        feedback,
      );
      if (response.success) {
        setSuccess("Thank you for your feedback!");
        setTimeout(onSuccess, 1500);
      } else {
        setError(response.error || "Failed to submit rating");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Rate Your Service</h2>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>

      <p className="text-gray-600 mb-6">
        How was your experience with the service?
      </p>

      {/* Rating Stars */}
      <div className="flex justify-center gap-2 mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(star)}
            className="text-4xl transition-all transform hover:scale-110 focus:outline-none"
          >
            <span
              className={
                star <= (hoverRating || rating)
                  ? "text-yellow-400"
                  : "text-gray-300"
              }
            >
              ★
            </span>
          </button>
        ))}
      </div>

      <div className="text-center mb-8">
        <p className="text-lg font-medium text-gray-700">
          {rating === 0 && "Select a rating above"}
          {rating === 1 && "⭐ Poor - Needs improvement"}
          {rating === 2 && "⭐⭐ Fair - Could be better"}
          {rating === 3 && "⭐⭐⭐ Good - Satisfied"}
          {rating === 4 && "⭐⭐⭐⭐ Great - Very satisfied"}
          {rating === 5 && "⭐⭐⭐⭐⭐ Excellent - Outstanding!"}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Feedback (Optional)
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            placeholder="Share your experience with the service..."
          />
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg mb-4">
            <p className="text-green-700 text-sm">{success}</p>
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading || rating === 0}
            className="flex-1 bg-gradient-to-r from-blue-600 to-sky-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Rating"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
          >
            Skip
          </button>
        </div>
      </form>
    </div>
  );
};

export default RateService;
