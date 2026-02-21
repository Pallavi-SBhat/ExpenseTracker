export default function Charts({ expenses }) {
  const categoryData = expenses.reduce((acc, expense) => {
    const existing = acc.find((item) => item.category === expense.category);
    if (existing) {
      existing.amount += expense.amount;
    } else {
      acc.push({
        category: expense.category,
        amount: expense.amount,
        percentage: 0,
      });
    }
    return acc;
  }, []);

  const total = categoryData.reduce((sum, item) => sum + item.amount, 0);
  categoryData.forEach((item) => {
    item.percentage = total > 0 ? (item.amount / total) * 100 : 0;
  });

  categoryData.sort((a, b) => b.amount - a.amount);

  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-orange-500',
    'bg-teal-500',
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Expense Breakdown</h3>

      {categoryData.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No expenses to display</p>
      ) : (
        <div className="space-y-4">
          <div className="flex h-8 rounded-lg overflow-hidden">
            {categoryData.map((item, index) => (
              <div
                key={item.category}
                className={`${colors[index % colors.length]} transition-all duration-300 hover:opacity-80`}
                style={{ width: `${item.percentage}%` }}
                title={`${item.category}: ${item.percentage.toFixed(1)}%`}
              />
            ))}
          </div>

          <div className="space-y-3">
            {categoryData.map((item, index) => (
              <div key={item.category} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded ${colors[index % colors.length]}`} />
                  <span className="text-sm font-medium text-gray-700">{item.category}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    {item.percentage.toFixed(1)}%
                  </span>
                  <span className="text-sm font-semibold text-gray-800 min-w-20 text-right">
                    ${item.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-gray-800">Total Expenses</span>
              <span className="text-base font-bold text-gray-800">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
