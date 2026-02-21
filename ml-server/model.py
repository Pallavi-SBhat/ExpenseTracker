import numpy as np
from sklearn.linear_model import LinearRegression

def predict_next_month(expenses, savings):
    # Convert to numpy safely
    expenses = np.array(expenses, dtype=float)
    savings = np.array(savings, dtype=float)

    # Safety checks
    if len(expenses) < 2 or len(savings) < 2:
        return {
            "predicted_expenses": float(expenses.mean() if len(expenses) > 0 else 0),
            "predicted_savings": float(savings.mean() if len(savings) > 0 else 0),
            "predicted_net_savings": float(
                (savings.mean() if len(savings) > 0 else 0)
                - (expenses.mean() if len(expenses) > 0 else 0)
            )
        }

    # Create time index
    X_exp = np.arange(len(expenses)).reshape(-1, 1)
    X_sav = np.arange(len(savings)).reshape(-1, 1)

    try:
        exp_model = LinearRegression()
        sav_model = LinearRegression()

        exp_model.fit(X_exp, expenses)
        sav_model.fit(X_sav, savings)

        next_index = np.array([[len(expenses)]])

        predicted_expenses = exp_model.predict(next_index)[0]
        predicted_savings = sav_model.predict(next_index)[0]

    except Exception as e:
        #FALLBACK (never crash)
        predicted_expenses = expenses.mean()
        predicted_savings = savings.mean()

    return {
        "predicted_expenses": float(predicted_expenses),
        "predicted_savings": float(predicted_savings),
        "predicted_net_savings": float(predicted_savings - predicted_expenses),
    }
