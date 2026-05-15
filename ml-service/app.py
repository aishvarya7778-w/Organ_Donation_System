import joblib
from flask import Flask, request, jsonify

MODEL_PATH = 'compatibility_model.pkl'

app = Flask(__name__)


def load_model():
    try:
        model = joblib.load(MODEL_PATH)
        return model
    except Exception as exc:
        raise RuntimeError(f'Unable to load ML model: {exc}')


def validate_payload(payload):
    required_fields = [
        'bloodGroup',
        'organType',
        'donorAge',
        'recipientAge',
        'urgency',
        'healthScore'
    ]

    missing = [field for field in required_fields if field not in payload]
    if missing:
        return False, f"Missing fields: {', '.join(missing)}"

    try:
        blood_group = int(payload['bloodGroup'])
        organ_type = int(payload['organType'])
        donor_age = int(payload['donorAge'])
        recipient_age = int(payload['recipientAge'])
        urgency = float(payload['urgency'])
        health_score = float(payload['healthScore'])
    except (TypeError, ValueError):
        return False, 'Field values must be numeric.'

    if blood_group not in {0, 1, 2, 3}:
        return False, 'bloodGroup must be one of [0, 1, 2, 3].'
    if organ_type not in {0, 1, 2}:
        return False, 'organType must be one of [0, 1, 2].'
    if donor_age < 0 or recipient_age < 0:
        return False, 'Ages must be non-negative.'
    if urgency < 0 or urgency > 10:
        return False, 'urgency must be between 0 and 10.'
    if health_score < 0 or health_score > 100:
        return False, 'healthScore must be between 0 and 100.'

    return True, ''


model = load_model()


@app.route('/predict', methods=['POST'])
def predict():
    payload = request.get_json(force=True, silent=True)
    if not payload:
        return jsonify({'error': 'Invalid JSON payload'}), 400

    valid, message = validate_payload(payload)
    if not valid:
        return jsonify({'error': message}), 400

    features = [
        payload['bloodGroup'],
        payload['organType'],
        payload['donorAge'],
        payload['recipientAge'],
        payload['urgency'],
        payload['healthScore']
    ]

    try:
        prediction = model.predict([features])[0]
        probabilities = model.predict_proba([features])[0]
        confidence = float(max(probabilities) * 100.0)

        return jsonify({
            'compatible': int(prediction),
            'confidence': round(confidence, 2)
        })
    except Exception as exc:
        return jsonify({'error': f'Prediction failed: {exc}'}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
