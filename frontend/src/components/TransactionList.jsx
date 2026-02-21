import { Trash2, Calendar } from 'lucide-react';
import { API_URL } from '../lib/api';

export default function TransactionList({ expenses, savings, onUpdate }) {

  const handleDeleteExpense = async (id) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    await fetch(`${API_URL}/api/expenses/${id}`, {
      method: 'DELETE',
    });

    onUpdate();
  };

  const handleDeleteSaving = async (id) => {
    if (!confirm('Are you sure you want to delete this saving?')) return;

    await fetch(`${API_URL}/api/savings/${id}`, {
      method: 'DELETE',
    });

    onUpdate();
  };

  const allTransactions = [
    ...expenses.map((e) => ({ ...e, type: 'expense' })),
    ...savings.map((s) => ({ ...s, type: 'saving' })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Transactions</h3>

      {allTransactions.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No transactions yet</p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {allTransactions.slice(0, 20).map((transaction) => (
            <div
              key={`${transaction.type}-${transaction.id}`}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      transaction.type === 'expense'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {transaction.type === 'expense' ? 'Expense' : 'Saving'}
                  </span>
                  <span className="font-medium text-gray-800">
                    {'category' in transaction ? transaction.category : transaction.source}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  {new Date(transaction.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                  {'description' in transaction && transaction.description && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span>{transaction.description}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-lg font-bold ${
                    transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  {transaction.type === 'expense' ? '-' : '+'}${transaction.amount.toFixed(2)}
                </span>
                <button
                  onClick={() =>
                    transaction.type === 'expense'
                      ? handleDeleteExpense(transaction.id)
                      : handleDeleteSaving(transaction.id)
                  }
                  className="text-gray-400 hover:text-red-600 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
