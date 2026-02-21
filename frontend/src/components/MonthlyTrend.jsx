export default function MonthlyTrend({ expenses, savings }) {
  const getLast6Months = () => {
    const months = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });

      months.push({
        month: monthName,
        expenses: 0,
        savings: 0,
      });
    }

    expenses.forEach((expense) => {
      const expenseDate = new Date(expense.date);
      const monthIndex = months.findIndex((m) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (5 - months.indexOf(m)));
        return (
          expenseDate.getMonth() === date.getMonth() &&
          expenseDate.getFullYear() === date.getFullYear()
        );
      });
      if (monthIndex !== -1) {
        months[monthIndex].expenses += expense.amount;
      }
    });

    savings.forEach((saving) => {
      const savingDate = new Date(saving.date);
      const monthIndex = months.findIndex((m) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (5 - months.indexOf(m)));
        return (
          savingDate.getMonth() === date.getMonth() &&
          savingDate.getFullYear() === date.getFullYear()
        );
      });
      if (monthIndex !== -1) {
        months[monthIndex].savings += saving.amount;
      }
    });

    return months;
  };

  const monthData = getLast6Months();
  const maxValue = Math.max(
    ...monthData.map((m) => Math.max(m.expenses, m.savings)),
    100
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-6">6-Month Trend</h3>

      <div className="space-y-6">
        {monthData.map((data, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{data.month}</span>
              <div className="flex gap-4 text-sm">
                <span className="text-red-600">-${data.expenses.toFixed(0)}</span>
                <span className="text-green-600">+${data.savings.toFixed(0)}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-6 bg-gray-100 rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-red-500 transition-all duration-500"
                    style={{ width: `${(data.expenses / maxValue) * 100}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-6 bg-gray-100 rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{ width: `${(data.savings / maxValue) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded" />
          <span className="text-gray-600">Expenses</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded" />
          <span className="text-gray-600">Savings</span>
        </div>
      </div>
    </div>
  );
}
