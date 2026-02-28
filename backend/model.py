import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from imblearn.over_sampling import SMOTE
import joblib
import os

MODEL_PATH = "pcos_model.pkl"  
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
    'marriage_status': 'Marraige Status (Yrs)', # We asked Yes/No in frontend, mapping to 0/1 or years. 
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
    
    n_samples = 2000
    
    # Create more realistic distributions
    data = {
        'Age': np.random.randint(18, 45, n_samples),
        'Weight': np.clip(np.random.normal(65, 15, n_samples), 40, 120),
        'Height': np.clip(np.random.normal(160, 10, n_samples), 140, 185),
        'Cycle(R/I)': np.random.choice(['Regular', 'Irregular'], n_samples, p=[0.65, 0.35]),  # 35% irregular
        'Cycle length(days)': np.random.choice(
            list(range(21, 36)) + list(range(36, 50)),  # Mix normal + long cycles
            n_samples
        ),
        'Marraige Status (Yrs)': np.random.choice(['Yes', 'No'], n_samples),
        'Pregnant(Y/N)': np.random.choice(['Yes', 'No'], n_samples, p=[0.15, 0.85]),  # 15% pregnant
        'Hip(inch)': np.clip(np.random.normal(38, 4, n_samples), 30, 50),
        'Waist(inch)': np.clip(np.random.normal(30, 5, n_samples), 22, 45),
        'Acne': np.random.choice(['Yes', 'No'], n_samples, p=[0.3, 0.7]),  # 30% with acne
        'Hair growth(Y/N)': np.random.choice(['Yes', 'No'], n_samples, p=[0.25, 0.75]),  # 25% hirsutism
        'Skin darkening (Y/N)': np.random.choice(['Yes', 'No'], n_samples, p=[0.2, 0.8]),  # 20% acanthosis
        'Fast food (Y/N)': np.random.choice(['Yes', 'No'], n_samples, p=[0.4, 0.6]),  # 40% fast food
    }
    
    df = pd.DataFrame(data)
    
    df['BMI'] = df['Weight'] / ((df['Height']/100)**2)
    
    def get_pcos(row):
        """
        Medical scoring system for PCOS based on Rotterdam Criteria
        Balanced scoring to produce realistic low/medium/high risk cases
        """
        score = 0
        max_score = 20  
        
        # Primary indicators 
        if row['Cycle(R/I)'] == 'Irregular':
            score += 5 
        
        # BMI categories
        bmi = row['BMI']
        if bmi > 30:
            score += 4  
        elif bmi > 25:
            score += 2  
        
        # Hyperandrogenism signs
        if row['Hair growth(Y/N)'] == 'Yes':
            score += 3  
        if row['Acne'] == 'Yes':
            score += 2  
        if row['Skin darkening (Y/N)'] == 'Yes':
            score += 2 
        
        # Cycle length (important for ovulatory dysfunction)
        cycle_len = row['Cycle length(days)']
        if cycle_len > 35:
            score += 3  
        elif cycle_len < 21:
            score += 2  
        
        # Lifestyle factors 
        if row['Fast food (Y/N)'] == 'Yes':
            score += 1
        
        # Waist-to-hip ratio 
        whr = row['Waist(inch)'] / max(row['Hip(inch)'], 1) 
        if whr > 0.85:
            score += 2
        
        # Calculate probability with smoother distribution
        prob = 0.05 + (score / max_score) * 0.9
        
        # Add controlled variation based on row index for reproducibility
        variation_seed = int((row['Age'] + row['Weight']) * 100) % 100
        np.random.seed(variation_seed)
        variation = np.random.uniform(-0.08, 0.08)
        prob = np.clip(prob + variation, 0.05, 0.95)
        
        # Create balanced distribution:
        return 1 if prob > 0.5 else 0

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
    model = xgb.XGBClassifier(
        use_label_encoder=False, 
        eval_metric='logloss',
        base_score=0.5,
        objective='binary:logistic',
        max_depth=4,  # Prevent overfitting
        learning_rate=0.1,
        n_estimators=100,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        scale_pos_weight=1.0  # Balanced after SMOTE
    )
    model.fit(X_res, y_res)
    
    # Save using sklearn-compatible method
    import pickle
    with open(MODEL_PATH.replace('.json', '.pkl'), 'wb') as f:
        pickle.dump(model, f)
    joblib.dump(encoders, ENCODER_PATH)
    print("Model trained and saved.")

def get_prediction(input_data):
    """
    Get PCOS risk prediction using a hybrid approach:
    1. Calculate medical risk score
    2. Use ML model for refined probability
    3. Apply clinical thresholds
    """
    if not os.path.exists(MODEL_PATH) or not os.path.exists(ENCODER_PATH):
        train_model_if_needed()
        
    # Load model using pickle
    import pickle
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
    encoders = joblib.load(ENCODER_PATH)
    
    # FIRST: Calculate clinical risk score (0-100)
    clinical_score = calculate_clinical_score(input_data)
    
    # Prepare input dataframe for ML model
    mapped_data = {}
    for k, v in input_data.items():
        if k in FIELD_MAPPING:
            col_name = FIELD_MAPPING[k]
            # Convert numeric strings to float
            if k in ['age', 'weight', 'height', 'cycle_length', 'hip', 'waist']:
                mapped_data[col_name] = float(v)
            else:
                mapped_data[col_name] = v
    
    print("DEBUG - Input data:", input_data)
    print("DEBUG - Clinical score:", clinical_score)
            
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
                    input_df[col] = 0
            except Exception:
                input_df[col] = 0

    # Ensure column order matches training
    cols = ['Age', 'Weight', 'Height', 'Cycle(R/I)', 'Cycle length(days)', 'Marraige Status (Yrs)', 
            'Pregnant(Y/N)', 'Hip(inch)', 'Waist(inch)', 
            'Acne', 'Hair growth(Y/N)', 'Skin darkening (Y/N)', 'Fast food (Y/N)']
            
    input_df = input_df[cols]
    
    # Get ML prediction
    ml_prob = model.predict_proba(input_df)[0][1]
    
    # HYBRID: Use mostly clinical score with ML as adjustment
    # Weight: 80% clinical, 20% ML for better calibration
    final_prob = (clinical_score * 0.80) + (ml_prob * 0.20)
    
    print(f"DEBUG - ML probability: {ml_prob:.3f}, Clinical score: {clinical_score:.3f}, Final: {final_prob:.3f}")
    
    # Apply clinical thresholds (wider medium range)
    if final_prob >= 0.75:
        risk = "High Risk"
    elif final_prob >= 0.35:
        risk = "Medium Risk"
    else:
        risk = "Low Risk"
    
    return {
        "risk": risk,
        "probability": float(final_prob)
    }


def calculate_clinical_score(input_data):
    """
    Calculate PCOS risk score based on Rotterdam Criteria and clinical guidelines.
    Returns probability between 0.0 and 1.0
    Calibrated for realistic low/medium/high risk distribution
    """
    score = 0
    max_score = 100
    
    # Extract values
    age = float(input_data.get('age', 25))
    weight = float(input_data.get('weight', 60))
    height = float(input_data.get('height', 160))
    cycle = input_data.get('cycle', 'Regular')
    cycle_length = float(input_data.get('cycle_length', 28))
    hip = float(input_data.get('hip', 36))
    waist = float(input_data.get('waist', 28))
    acne = input_data.get('acne', 'No')
    hair_growth = input_data.get('hair_growth', 'No')
    skin_darkening = input_data.get('skin_darkening', 'No')
    fast_food = input_data.get('fast_food', 'Rarely')
    
    # Calculate BMI
    bmi = weight / ((height/100) ** 2)
    
    # 1. IRREGULAR CYCLES 
    if cycle == 'Irregular':
        score += 25
    
    # 2. CYCLE LENGTH  
    if cycle_length > 40:
        score += 12 
    elif cycle_length > 35:
        score += 8    
    elif cycle_length < 21:
        score += 6  
    
    # 3. BMI (Metabolic component) 
    if bmi > 30:
        score += 18  
    elif bmi > 27:
        score += 12 
    elif bmi > 25:
        score += 7 
    
    # 4. HYPERANDROGENISM SIGNS
    if hair_growth == 'Yes':
        score += 12  
    if acne == 'Yes':
        score += 7  
    if skin_darkening == 'Yes':
        score += 6 
    
    # 5. WAIST-TO-HIP RATIO (Android obesity)
    whr = waist / max(hip, 1)
    if whr > 0.85:
        score += 12 
    elif whr > 0.80:
        score += 7
    
    # 6. LIFESTYLE FACTORS - 4 points (reduced from 5)
    if fast_food in ['Often', 'Occasional']:
        score += 4
    
    # Convert score to probability (0.0 to 1.0)
    probability = min((score / max_score) ** 0.85, 0.92) 
    
    return probability







