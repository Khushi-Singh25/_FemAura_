import random
import re
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Try to configure Gemini
GOOGLE_API_KEY = os.getenv("GEMINI_API_KEY")
model = None

print(f"DEBUG: GEMINI_API_KEY loaded: {'Yes (length: {})'.format(len(GOOGLE_API_KEY)) if GOOGLE_API_KEY else 'No'}")

if GOOGLE_API_KEY:
    try:
        import google.generativeai as genai
        genai.configure(api_key=GOOGLE_API_KEY)
        # Try multiple model names
        for model_name in ['gemini-pro', 'gemini-1.5-pro', 'models/gemini-pro']:
            try:
                model = genai.GenerativeModel(model_name)
                # Test with a simple query
                test_response = model.generate_content("Hi")
                print(f"DEBUG: Gemini configured successfully with model: {model_name}")
                break
            except Exception as e:
                print(f"DEBUG: Model {model_name} failed: {type(e).__name__}")
                model = None
                continue
        
        if model is None:
            print("DEBUG: All Gemini model attempts failed, using rule-based fallback")
    except Exception as e:
        print(f"DEBUG: Gemini configuration error: {type(e).__name__}: {str(e)}")
        model = None
else:
    print("DEBUG: No GEMINI_API_KEY found, using rule-based responses only")

def get_bot_response(message: str) -> str:
    """
    Get chatbot response. Tries Gemini AI first, falls back to rule-based responses.
    """
    # Try using Gemini first if configured
    if model:
        try:
            print(f"DEBUG: Attempting Gemini API call...")
            prompt = f"""You are Dr. Aura, an empathetic AI gynecologist assistant specializing in PCOS and women's health. 
            
User question: {message}

Respond briefly and supportively in 2-3 sentences. Be warm, professional, and informative."""
            
            response = model.generate_content(prompt)
            response_text = response.text.strip()
            print(f"DEBUG: Gemini success! Response: {response_text[:100]}...")
            return response_text
        except Exception as e:
            print(f"DEBUG: Gemini API failed: {type(e).__name__}: {str(e)[:200]}")
            # Continue to fallback
    
    # Rule-based fallback (always works)
    print("DEBUG: Using rule-based response")
    msg = message.lower()
    
    # Define response rules with regex patterns
    rules = {
        r'\b(hi|hello|hey|greet)\b': [
            "Hello! I'm Dr. Aura, your AI health assistant. How can I help you today?",
            "Hi there! I'm here to support your journey with PCOS and women's health. What's on your mind?",
            "Greetings! I'm Dr. Aura, ready to answer your questions about PCOS, periods, and reproductive health."
        ],
        r'\b(what|tell|explain).*(pcos|polycystic)\b': [
            "PCOS (Polycystic Ovary Syndrome) is a hormonal disorder affecting 1 in 10 women. It involves irregular periods, elevated androgen levels, and sometimes small cysts on ovaries. It's manageable with lifestyle changes, medication, and proper care.",
            "PCOS is a common hormonal condition causing irregular cycles, excess androgens (leading to acne/hair growth), and metabolic issues. Many women with PCOS live healthy lives with proper management through diet, exercise, and medical support."
        ],
        r'\b(period|cycle|menstruation|irregular)\b': [
            "Irregular periods are a key PCOS symptom. A normal cycle is 21-35 days; PCOS cycles are often longer or unpredictable. Tracking your cycle helps identify patterns. Have you tried our Symptom Tracker?",
            "With PCOS, periods can be irregular, infrequent, or absent due to hormonal imbalances. If your cycle is consistently over 35 days or you're missing periods, consult a healthcare provider for evaluation."
        ],
        r'\b(pain|cramp|hurt|ache)\b': [
            "Menstrual cramps can be managed with heat therapy, gentle yoga, hydration, and over-the-counter pain relief. If pain is severe or debilitating, please see a doctor to rule out endometriosis or other conditions.",
            "Pelvic pain may be related to PCOS cysts or other issues. Track pain severity, timing, and triggers. If it's affecting your daily life, medical evaluation is important."
        ],
        r'\b(acne|pimple|skin|breakout)\b': [
            "Hormonal acne from PCOS is caused by excess androgens. Low-glycemic diet, gentle skincare, and avoiding dairy/sugar can help. Dermatologists may prescribe spironolactone or topical treatments for persistent acne.",
            "PCOS-related acne typically appears on jawline, chin, and cheeks. Focus on anti-inflammatory foods, zinc supplements, and oil-free products. If severe, consult a dermatologist."
        ],
        r'\b(weight|fat|diet|food|nutrition|eat|lose)\b': [
            "Weight management with PCOS can be challenging due to insulin resistance. Focus on low-GI foods (whole grains, vegetables, lean protein), regular exercise, and avoiding processed foods. Even 5-10% weight loss can improve symptoms significantly!",
            "For PCOS, prioritize: protein at every meal, fiber-rich vegetables, healthy fats (avocado, nuts), and limit refined carbs/sugar. Check our Fitness & Nutrition section for detailed meal plans!"
        ],
        r'\b(pregnant|baby|fertility|conceive|infertility)\b': [
            "PCOS is a leading cause of infertility, but many women with PCOS conceive naturally or with assistance. Tracking ovulation, managing weight, and medications like Metformin or Clomid can help. Consult a fertility specialist for personalized guidance.",
            "Getting pregnant with PCOS is possible! Lifestyle changes, ovulation tracking, and medical treatments (ovulation induction, IVF) have high success rates. Don't lose hope—many PCOS patients become mothers."
        ],
        r'\b(hair|hirsutism|facial|unwanted)\b': [
            "Excess hair growth (hirsutism) from elevated androgens is treatable. Options include: spironolactone medication, laser hair removal, electrolysis, or eflornithine cream. Spearmint tea may also help naturally.",
            "Hirsutism affects many PCOS patients. Medical treatments (anti-androgens), cosmetic procedures (laser), and lifestyle changes (low-GI diet) can reduce unwanted hair over time."
        ],
        r'\b(stress|anxiety|mental|mood|depression)\b': [
            "PCOS can impact mental health due to hormonal fluctuations and symptom burden. Stress management (yoga, meditation, therapy) is crucial. Consider counseling if you're feeling overwhelmed—your mental health matters!",
            "The PCOS-mental health connection is real. Practice self-care, connect with support groups, and don't hesitate to seek therapy. Managing stress helps balance hormones too."
        ],
        r'\b(exercise|workout|fitness|gym|yoga)\b': [
            "Exercise improves PCOS symptoms by enhancing insulin sensitivity. Aim for: 30 min cardio 3-4x/week, strength training 2-3x/week, and daily yoga/stretching. Check our Fitness section for PCOS-specific workouts!",
            "Best exercises for PCOS: brisk walking, cycling, swimming, HIIT (in moderation), and strength training. Yoga also helps with stress and hormone balance. Consistency matters more than intensity!"
        ],
        r'\b(doctor|diagnos|test|check)\b': [
            "PCOS is diagnosed using Rotterdam Criteria: 2 of 3 factors (irregular periods, high androgens, polycystic ovaries on ultrasound). Blood tests check hormones (testosterone, LH/FSH, insulin). Consult a gynecologist or endocrinologist for proper diagnosis.",
            "If you suspect PCOS, see a doctor for: hormone panel blood tests, pelvic ultrasound, and symptom review. Early diagnosis helps prevent long-term complications like diabetes and heart disease."
        ]
    }
    
    # Check each pattern
    for pattern, responses in rules.items():
        if re.search(pattern, msg):
            return random.choice(responses)
    
    # Default response if no pattern matches
    return "I'm here to help with questions about PCOS, periods, symptoms, diet, fitness, and reproductive health. What would you like to know more about? Feel free to ask about irregular cycles, weight management, fertility, or any PCOS-related concerns!"
