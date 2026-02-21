import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ExpenseForm from './ExpenseForm';
import SavingsForm from './SavingsForm';
import Charts from './Charts';
import MonthlyTrend from './MonthlyTrend';
import Predictions from './Predictions';
import Profile from './Profile';
import TransactionList from './TransactionList';
import { LogOut, DollarSign, TrendingUp, Target } from 'lucide-react';
import { API_URL } from '../lib/api';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [savings, setSavings] = useState([]);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      const [expensesRes, savingsRes, profileRes] = await Promise.all([
        fetch(`${API_URL}/api/expenses?user_id=${user.id}`).then((r) => r.json()),
        fetch(`${API_URL}/api/savings?user_id=${user.id}`).then((r) => r.json()),
        fetch(`${API_URL}/api/profile?user_id=${user.id}`).then((r) => r.json()),
      ]);

      setExpenses(Array.isArray(expensesRes) ? expensesRes : []);
      setSavings(Array.isArray(savingsRes) ? savingsRes : []);
      setProfile(profileRes || null);
    } catch (err) {
      console.error('Failed to load data', err);
    }
  };

  const currentMonth = new Date();
  const monthlyExpenses = expenses
    .filter((e) => {
      const expenseDate = new Date(e.date);
      return (
        expenseDate.getMonth() === currentMonth.getMonth() &&
        expenseDate.getFullYear() === currentMonth.getFullYear()
      );
    })
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const monthlySavings = savings
    .filter((s) => {
      const savingDate = new Date(s.date);
      return (
        savingDate.getMonth() === currentMonth.getMonth() &&
        savingDate.getFullYear() === currentMonth.getFullYear()
      );
    })
    .reduce((sum, s) => sum + Number(s.amount || 0), 0);

  const netSavings = monthlySavings - monthlyExpenses;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-green-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-linear-to-br from-blue-600 to-green-600 p-2 rounded-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">Expense Tracker</h1>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  activeTab === 'overview'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  activeTab === 'profile'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Profile
              </button>
              <button
                onClick={signOut}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-red-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    This Month Expenses
                  </span>
                </div>
                <div className="text-3xl font-bold text-gray-800">
                  ${monthlyExpenses.toFixed(2)}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    This Month Savings
                  </span>
                </div>
                <div className="text-3xl font-bold text-gray-800">
                  ${monthlySavings.toFixed(2)}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`${
                      netSavings >= 0 ? 'bg-green-100' : 'bg-red-100'
                    } p-2 rounded-lg`}
                  >
                    <Target
                      className={`w-5 h-5 ${
                        netSavings >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    Net Balance
                  </span>
                </div>
                <div
                  className={`text-3xl font-bold ${
                    netSavings >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {netSavings >= 0 ? '+' : '-'}$
                  {Math.abs(netSavings).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-8">
              <ExpenseForm onExpenseAdded={loadData} />
              <SavingsForm onSavingAdded={loadData} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Predictions expenses={expenses} savings={savings} />
              <Charts expenses={expenses} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MonthlyTrend expenses={expenses} savings={savings} />
              <TransactionList
                expenses={expenses}
                savings={savings}
                onUpdate={loadData}
              />
            </div>
          </>
        ) : (
          <div className="max-w-2xl mx-auto">
            <Profile onProfileUpdated={loadData} />
          </div>
        )}
      </main>
    </div>
  );
}
