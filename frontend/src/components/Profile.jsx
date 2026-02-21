import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Save } from 'lucide-react';
import { API_URL } from '../lib/api';

export default function Profile({ onProfileUpdated }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [fullName, setFullName] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [savingsGoal, setSavingsGoal] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const res = await fetch(`${API_URL}/api/profile?user_id=${user.id}`);
      if (!res.ok) return; // maybe no profile yet

      const data = await res.json();
      if (data) {
        setProfile(data);
        setFullName(data.full_name || '');
        setMonthlyIncome(
          data.monthly_income != null ? data.monthly_income.toString() : ''
        );
        setSavingsGoal(
          data.savings_goal != null ? data.savings_goal.toString() : ''
        );
        setCurrency(data.currency || 'USD');
      }
    } catch (err) {
      console.error('Failed to load profile', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${API_URL}/api/profile/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          full_name: fullName,
          monthly_income: parseFloat(monthlyIncome) || 0,
          savings_goal: parseFloat(savingsGoal) || 0,
          currency,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setSuccess('Profile updated successfully!');
      onProfileUpdated();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-linear-to-br from-blue-600 to-green-600 p-2 rounded-lg">
          <User className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">Profile Settings</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Income
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00"
          />
          <p className="text-xs text-gray-500 mt-1">
            Used for better predictions and insights
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Savings Goal
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={savingsGoal}
            onChange={(e) => setSavingsGoal(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00"
          />
          <p className="text-xs text-gray-500 mt-1">
            Your target savings amount each month
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Currency
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="JPY">JPY (¥)</option>
            <option value="INR">INR (₹)</option>
          </select>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-green-700 transition disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
