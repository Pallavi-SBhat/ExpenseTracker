import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { API_URL } from "../lib/api";

export default function Predictions({ expenses, savings }) {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!expenses || !savings) return;
    const expenseValues = expenses
    .map(e => Number(e.amount))
    .filter(v => !isNaN(v));

    const savingValues = savings
    .map(s => Number(s.amount))
    .filter(v => !isNaN(v));
    if (expenses.length < 2 || savings.length < 2) {
      setLoading(false);
      return;
    }

    const fetchPrediction = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API_URL}/api/predictions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
         expenses: expenseValues,
         savings: savingValues,
        }),

        });

        if (!res.ok) throw new Error("Prediction failed");

        const data = await res.json();
        setPrediction(data);
      } catch (err) {
        console.error(err);
        setError("Unable to generate prediction");
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [expenses, savings]);

  if (loading) return <p>Generating prediction...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!prediction) return null;

  return (
    <div className="bg-linear-to-br from-blue-600 to-green-600 rounded-xl shadow-lg p-6 text-white">
      <h3 className="text-xl font-bold mb-6">Next Month Prediction</h3>

      <div className="space-y-4">
        {/* Expenses */}
        <div className="bg-white/10 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="w-5 h-5" />
            <span className="text-sm font-medium">Expected Expenses</span>
          </div>
          <div className="text-3xl font-bold">
            ₹{prediction.predicted_expenses.toFixed(2)}
          </div>
        </div>

        {/* Savings */}
        <div className="bg-white/10 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">Expected Savings</span>
          </div>
          <div className="text-3xl font-bold">
            ₹{prediction.predicted_savings.toFixed(2)}
          </div>
        </div>

        {/* Net Savings */}
        <div className="bg-white/20 rounded-lg p-4 border border-white/30">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-5 h-5" />
            <span className="text-sm font-medium">Net Savings Forecast</span>
          </div>
          <div
            className={`text-3xl font-bold ${
              prediction.predicted_net_savings >= 0
                ? "text-green-200"
                : "text-red-200"
            }`}
          >
            {prediction.predicted_net_savings >= 0 ? "+" : "-"}₹
            {Math.abs(prediction.predicted_net_savings).toFixed(2)}
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-white/80">
        Predictions are generated using a machine learning regression model
        trained on your historical transaction data.
      </p>
    </div>
  );
}
