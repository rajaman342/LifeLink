import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score


# ==========================================
# 1. LOAD DATASET
# ==========================================

data = pd.read_csv("data/donor_data.csv")

print("Dataset loaded successfully!")
print(data)


# ==========================================
# 2. SELECT FEATURES
# ==========================================

X = data[
    [
        "distance",
        "days_since_donation",
        "response_rate"
    ]
]


# ==========================================
# 3. SELECT TARGET
# ==========================================

y = data["responded"]


# ==========================================
# 4. SPLIT DATASET
# ==========================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

print("\nTraining data size:", len(X_train))
print("Testing data size:", len(X_test))


# ==========================================
# 5. CREATE ML MODEL
# ==========================================

model = LogisticRegression()


# ==========================================
# 6. TRAIN MODEL
# ==========================================

model.fit(X_train, y_train)

print("\nModel trained successfully!")


# ==========================================
# 7. MAKE PREDICTIONS
# ==========================================

y_pred = model.predict(X_test)

print("\nPredictions:")
print(y_pred)


# ==========================================
# 8. CALCULATE ACCURACY
# ==========================================

accuracy = accuracy_score(y_test, y_pred)

print("\nModel Accuracy:", accuracy)


# ==========================================
# 9. SAVE TRAINED MODEL
# ==========================================

joblib.dump(
    model,
    "model/donor_model.pkl"
)

print("\nModel saved successfully!")
print("Location: model/donor_model.pkl")