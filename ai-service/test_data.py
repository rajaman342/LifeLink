import pandas as pd

data = pd.read_csv("data/donor_data.csv")

X = data[
    [
        "distance",
        "days_since_donation",
        "response_rate"
    ]
]

y = data["responded"]

print("Features:")
print(X)

print("\nTarget:")
print(y)