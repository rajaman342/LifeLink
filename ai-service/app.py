from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd


# ==========================================
# CREATE FLASK APP
# ==========================================

app = Flask(__name__)

CORS(app)


# ==========================================
# LOAD TRAINED MODEL
# ==========================================

model = joblib.load("model/donor_model.pkl")

print("ML model loaded successfully!")


# ==========================================
# HOME ROUTE
# ==========================================

@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "success": True,
        "message": "LifeLink AI Service is running"
    })


# ==========================================
# PREDICTION ROUTE
# ==========================================

@app.route("/predict", methods=["POST"])
def predict():

    try:

        data = request.get_json()

        # Get donor information
        distance = data["distance"]
        days_since_donation = data["days_since_donation"]
        response_rate = data["response_rate"]

        # Create dataframe
        donor_data = pd.DataFrame([
            {
                "distance": distance,
                "days_since_donation": days_since_donation,
                "response_rate": response_rate
            }
        ])

        # Make prediction
        prediction = model.predict(donor_data)[0]

        # Get probability
        probability = model.predict_proba(
            donor_data
        )[0][1]

        # Convert probability to percentage
        score = round(probability * 100, 2)

        return jsonify({

            "success": True,

            "prediction": int(prediction),

            "score": score

        })

    except Exception as error:

        return jsonify({

            "success": False,

            "message": str(error)

        }), 500


# ==========================================
# START SERVER
# ==========================================

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5001,
        debug=True
    )