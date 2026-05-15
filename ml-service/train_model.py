from pathlib import Path
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib

"""Train a RandomForest classifier from the organ compatibility dataset."""

BASE_DIR = Path(__file__).resolve().parent
DATASET_PATH = BASE_DIR / 'dataset.csv'
MODEL_PATH = BASE_DIR / 'compatibility_model.pkl'

FEATURES = [
    'bloodGroup',
    'organType',
    'donorAge',
    'recipientAge',
    'urgency',
    'healthScore'
]


def load_dataset(path: str) -> pd.DataFrame:
    return pd.read_csv(path)


def prepare_features(data: pd.DataFrame):
    X = data[FEATURES].astype(float)
    y = data['compatible'].astype(int)
    return X, y


def train_and_save_model():
    data = load_dataset(DATASET_PATH)
    X, y = prepare_features(data)

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y
    )

    model = RandomForestClassifier(
        n_estimators=150,
        max_depth=8,
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred) * 100.0

    print(f'Model training complete. Test accuracy: {accuracy:.2f}%')
    joblib.dump(model, MODEL_PATH)
    print(f'Model saved to {MODEL_PATH}')


if __name__ == '__main__':
    train_and_save_model()
