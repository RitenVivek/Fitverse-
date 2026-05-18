"""
Weight Prediction using Linear Regression (scikit-learn)
Reads JSON from stdin, outputs JSON to stdout.
"""
import sys
import json
import numpy as np
from datetime import datetime, timedelta

try:
    from sklearn.linear_model import LinearRegression
except ImportError:
    print(json.dumps({"error": "scikit-learn not installed. Run: pip install scikit-learn"}))
    sys.exit(1)

def predict_weight():
    input_data = json.loads(sys.stdin.read())
    weights_data = input_data.get("weights", [])
    target_weight = input_data.get("targetWeight")
    days_to_predict = input_data.get("daysToPredict", 90)

    if len(weights_data) < 3:
        print(json.dumps({
            "prediction": None,
            "message": "Need at least 3 weight entries for prediction.",
            "currentEntries": len(weights_data)
        }))
        return

    # Parse dates and weights
    base_date = datetime.strptime(weights_data[0]["date"], "%Y-%m-%d")
    days = []
    weights = []
    for entry in weights_data:
        d = datetime.strptime(entry["date"], "%Y-%m-%d")
        days.append((d - base_date).days)
        weights.append(entry["weight"])

    X = np.array(days).reshape(-1, 1)
    y = np.array(weights)

    # Fit Linear Regression
    model = LinearRegression()
    model.fit(X, y)

    r_squared = model.score(X, y)
    slope = model.coef_[0]
    intercept = model.intercept_

    # Predict future weights
    last_day = days[-1]
    predictions = []
    for i in range(7, days_to_predict + 1, 7):  # weekly predictions
        future_day = last_day + i
        predicted = model.predict([[future_day]])[0]
        pred_date = base_date + timedelta(days=future_day)
        predictions.append({
            "day": i,
            "date": pred_date.strftime("%Y-%m-%d"),
            "weight": round(float(predicted), 1)
        })

    # Calculate days to target
    days_to_target = None
    if target_weight and abs(slope) > 0.001:
        days_needed = (target_weight - weights[-1]) / slope
        if 0 < days_needed < 365:
            days_to_target = int(days_needed)

    # Determine trend
    if slope < -0.01:
        trend = "losing"
    elif slope > 0.01:
        trend = "gaining"
    else:
        trend = "stable"

    result = {
        "currentWeight": weights[-1],
        "predictions": predictions,
        "trend": trend,
        "avgDailyChange": round(float(slope), 4),
        "weeklyChange": round(float(slope * 7), 2),
        "daysToTarget": days_to_target,
        "targetWeight": target_weight,
        "confidence": round(float(r_squared), 3),
        "method": "sklearn_linear_regression",
        "dataPoints": len(weights)
    }
    print(json.dumps(result))

if __name__ == "__main__":
    predict_weight()
