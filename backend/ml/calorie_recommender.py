"""
Calorie Recommendation System using scikit-learn.
Uses a trained model approach with Mifflin-St Jeor as baseline.
Reads JSON from stdin, outputs JSON to stdout.
"""
import sys
import json
import numpy as np

try:
    from sklearn.linear_model import LinearRegression
except ImportError:
    print(json.dumps({"error": "scikit-learn not installed. Run: pip install scikit-learn"}))
    sys.exit(1)

def recommend_calories():
    data = json.loads(sys.stdin.read())
    age = data.get("age", 25)
    height = data.get("height", 170)
    weight = data.get("weight", 70)
    gender = data.get("gender", "male")
    activity_level = data.get("activityLevel", "sedentary")
    goal = data.get("goal", "maintenance")

    # Train a simple model on established nutritional science data
    # Features: [weight, height, age, gender_male, activity_multiplier]
    training_data = np.array([
        [60, 160, 20, 1, 1.2], [60, 160, 20, 0, 1.2],
        [70, 170, 25, 1, 1.375], [70, 170, 25, 0, 1.375],
        [80, 175, 30, 1, 1.55], [80, 175, 30, 0, 1.55],
        [90, 180, 35, 1, 1.725], [90, 180, 35, 0, 1.725],
        [100, 185, 40, 1, 1.9], [100, 185, 40, 0, 1.9],
        [55, 155, 22, 0, 1.2], [65, 165, 28, 1, 1.55],
        [75, 172, 32, 1, 1.375], [85, 178, 38, 0, 1.725],
        [95, 182, 45, 1, 1.55], [50, 152, 18, 0, 1.375],
    ])

    # TDEE labels calculated via Mifflin-St Jeor
    tdee_labels = []
    for row in training_data:
        w, h, a, g, m = row
        if g == 1:
            bmr = 10 * w + 6.25 * h - 5 * a + 5
        else:
            bmr = 10 * w + 6.25 * h - 5 * a - 161
        tdee_labels.append(bmr * m)
    y_train = np.array(tdee_labels)

    model = LinearRegression()
    model.fit(training_data, y_train)

    activity_map = {
        "sedentary": 1.2, "light": 1.375, "moderate": 1.55,
        "active": 1.725, "very_active": 1.9
    }
    act_mult = activity_map.get(activity_level, 1.2)
    gender_val = 1 if gender == "male" else 0

    user_features = np.array([[weight, height, age, gender_val, act_mult]])
    predicted_tdee = model.predict(user_features)[0]
    predicted_tdee = round(float(predicted_tdee))

    # Compute BMR
    if gender == "male":
        bmr = round(10 * weight + 6.25 * height - 5 * age + 5)
    else:
        bmr = round(10 * weight + 6.25 * height - 5 * age - 161)

    # Goal adjustments
    goal_adjustments = {
        "weight_loss": -500, "maintenance": 0, "weight_gain": 400
    }
    adjustment = goal_adjustments.get(goal, 0)
    recommended = predicted_tdee + adjustment

    # Macro split based on goal
    if goal == "weight_loss":
        p_ratio, c_ratio, f_ratio = 0.35, 0.35, 0.30
    elif goal == "weight_gain":
        p_ratio, c_ratio, f_ratio = 0.30, 0.45, 0.25
    else:
        p_ratio, c_ratio, f_ratio = 0.30, 0.40, 0.30

    result = {
        "bmr": bmr,
        "tdee": predicted_tdee,
        "recommendedCalories": round(recommended),
        "goalAdjustment": adjustment,
        "macros": {
            "protein": round((recommended * p_ratio) / 4),
            "carbs": round((recommended * c_ratio) / 4),
            "fats": round((recommended * f_ratio) / 9),
        },
        "macroRatios": {
            "protein": f"{int(p_ratio*100)}%",
            "carbs": f"{int(c_ratio*100)}%",
            "fats": f"{int(f_ratio*100)}%",
        },
        "method": "sklearn_linear_regression",
        "confidence": round(float(model.score(training_data, y_train)), 3),
    }
    print(json.dumps(result))

if __name__ == "__main__":
    recommend_calories()
