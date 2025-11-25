import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from imblearn.over_sampling import SMOTE
import joblib
import os

MODEL_PATH = "pcos_model.json"
ENCODER_PATH = "encoders.pkl"

# Feature list must match the frontend form and training data
FEATURES = [
    'Age', 'Weight', 'Height', 'Cycle(R/I)', 'Cycle length(days)', 'Marraige Status (Yrs)', 
    'Pregnant(Y/N)', 'Hip(inch)', 'Waist(inch)', 
    'Acne', 'Hair growth(Y/N)', 'Skin darkening (Y/N)', 'Fast food (Y/N)'
]

# Mapping frontend fields to model features
FIELD_MAPPING = {
    'age': 'Age',
    'weight': 'Weight',
    'height': 'Height',
    'cycle': 'Cycle(R/I)', # Regular=2, Irregular=4 usually in datasets, or 0/1
    'cycle_length': 'Cycle length(days)',
    'marriage_status': 'Marraige Status (Yrs)', # We asked Yes/No in frontend, mapping to 0/1 or years. I'll simplify to binary for demo.
    'pregnant': 'Pregnant(Y/N)',
    'hip': 'Hip(inch)',
    'waist': 'Waist(inch)',
    'acne': 'Acne',
    'hair_growth': 'Hair growth(Y/N)',
    'skin_darkening': 'Skin darkening (Y/N)',
    'fast_food': 'Fast food (Y/N)'
}

def train_model_if_needed():
    if os.path.exists(MODEL_PATH) and os.path.exists(ENCODER_PATH):
        print("Model already exists.")
        return

    print("Training new model on synthetic data...")
    
    n_samples = 1000
    data = {
        'Age': np.random.randint(18, 45, n_samples),
        'Weight': np.random.normal(65, 15, n_samples),
        'Height': np.random.normal(160, 10, n_samples),
        'Cycle(R/I)': np.random.choice(['Regular', 'Irregular'], n_samples),
        'Cycle length(days)': np.random.randint(20, 45, n_samples),
        'Marraige Status (Yrs)': np.random.choice(['Yes', 'No'], n_samples), # Simplified for demo
        'Pregnant(Y/N)': np.random.choice(['Yes', 'No'], n_samples),
        'Hip(inch)': np.random.normal(40, 5, n_samples),
        'Waist(inch)': np.random.normal(32, 5, n_samples),
        'Acne': np.random.choice(['Yes', 'No'], n_samples),
        'Hair growth(Y/N)': np.random.choice(['Yes', 'No'], n_samples),
        'Skin darkening (Y/N)': np.random.choice(['Yes', 'No'], n_samples),
        'Fast food (Y/N)': np.random.choice(['Yes', 'No'], n_samples),
    }
    
    df = pd.DataFrame(data)
    
    df['BMI'] = df['Weight'] / ((df['Height']/100)**2)
    
    def get_pcos(row):
        score = 0
        if row['Cycle(R/I)'] == 'Irregular': score += 3
        if row['BMI'] > 25: score += 2
        if row['Hair growth(Y/N)'] == 'Yes': score += 2
        if row['Acne'] == 'Yes': score += 1
        if row['Skin darkening (Y/N)'] == 'Yes': score += 1
        if row['Cycle length(days)'] > 35 or row['Cycle length(days)'] < 21: score += 1
        
        prob = score / 10.0
        return 1 if np.random.random() < prob else 0

    df['PCOS (Y/N)'] = df.apply(get_pcos, axis=1)
    
    # Drop helper column
    df = df.drop('BMI', axis=1)
    
    # Encoders
    encoders = {}
    for col in df.columns:
        if df[col].dtype == 'object':
            le = LabelEncoder()
            df[col] = le.fit_transform(df[col])
            encoders[col] = le
    
    X = df.drop('PCOS (Y/N)', axis=1)
    y = df['PCOS (Y/N)']
    
    # SMOTE
    smote = SMOTE(random_state=42)
    X_res, y_res = smote.fit_resample(X, y)
    
    # Train XGBoost
    model = xgb.XGBClassifier(use_label_encoder=False, eval_metric='logloss')
    model.fit(X_res, y_res)
    
    # Save
    model.save_model(MODEL_PATH)
    joblib.dump(encoders, ENCODER_PATH)
    print("Model trained and saved.")

def get_prediction(input_data):
    if not os.path.exists(MODEL_PATH) or not os.path.exists(ENCODER_PATH):
        train_model_if_needed()
        
    model = xgb.XGBClassifier()
    model.load_model(MODEL_PATH)
    encoders = joblib.load(ENCODER_PATH)
    
    # Prepare input dataframe
    mapped_data = {}
    for k, v in input_data.items():
        if k in FIELD_MAPPING:
            col_name = FIELD_MAPPING[k]
            mapped_data[col_name] = v
            
    input_df = pd.DataFrame([mapped_data])
    
    # Transform using encoders
    for col, le in encoders.items():
        if col in input_df.columns:
            try:
                val = input_df[col].iloc[0]
                
                if col == 'Fast food (Y/N)':
                    val = 'Yes' if val in ['Often', 'Occasional'] else 'No'
                
                if val in le.classes_:
                    input_df[col] = le.transform([val])
                else:
                    input_df[col] = 0 # Fallback
            except Exception:
                input_df[col] = 0

    # Ensure column order matches training
    # Note: X.columns from training
    cols = ['Age', 'Weight', 'Height', 'Cycle(R/I)', 'Cycle length(days)', 'Marraige Status (Yrs)', 
            'Pregnant(Y/N)', 'Hip(inch)', 'Waist(inch)', 
            'Acne', 'Hair growth(Y/N)', 'Skin darkening (Y/N)', 'Fast food (Y/N)']
            
    input_df = input_df[cols]
    
    # Predict
    prob = model.predict_proba(input_df)[0][1]
    pred = model.predict(input_df)[0]
    
    risk = "High Risk" if pred == 1 else "Low Risk"
    
    return {
        "risk": risk,
        "probability": float(prob)
    }






