import random
import re
import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini if API key is present
GOOGLE_API_KEY = os.getenv("GEMINI_API_KEY")

# Debug print to check if key is loaded (will appear in terminal logs)
print(f"DEBUG: GEMINI_API_KEY loaded: {'Yes' if GOOGLE_API_KEY else 'No'}")

if GOOGLE_API_KEY:
    try:
        genai.configure(api_key=GOOGLE_API_KEY)
        # Use a currently supported model
        model = genai.GenerativeModel('gemini-2.0-flash')
        print("DEBUG: Gemini model configured successfully")
    except Exception as e:
        print(f"DEBUG: Error configuring Gemini: {e}")
        model = None
else:
    print("DEBUG: No GEMINI_API_KEY found in environment variables")
    model = None

def get_bot_response(message: str) -> str:
    # Try using Gemini first if configured
    if model:
        try:
            # Add context to the prompt to make it behave like Dr. Aura
            prompt = f"You are Dr. Aura, an empathetic and knowledgeable AI gynecologist assistant specializing in PCOS and women's health. Answer the following user query briefly and supportively: {message}"
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            print(f"Gemini API Error: {e}")
            # Fallback to rules if API fails
            pass
    else:
        print("DEBUG: Model is None, skipping Gemini call")

    msg = message.lower()
    
    rules = {
        r'\b(hi|hello|hey)\b': [
            "Hello! I'm Dr. Aura, your AI health assistant. How can I help you today?",
            "Hi there! I'm here to support your journey. What's on your mind?",
            "Greetings! Ready to answer your questions about PCOS and women's health."
        ],
        r'\b(pcos|polycystic)\b': [
            "PCOS is a hormonal disorder causing enlarged ovaries with small cysts on the outer edges. It can manage effectively with diet, exercise, and medication.",
            "Living with PCOS can be challenging, but symptom management is very possible through lifestyle changes. What specific symptom are you concerned about?"
        ],
        r'\b(period|cycle|menstruation|bleed)\b': [
            "Irregular periods are a common symptom of PCOS. Tracking your cycle is crucial. have you used our Tracker feature yet?",
            "If your cycle is consistently longer than 35 days or you miss periods, it's worth consulting a doctor."
        ],
        r'\b(pain|cramp|hurt)\b': [
            "For menstrual cramps, applying heat, gentle yoga, and staying hydrated can help. If pain is severe, please see a doctor.",
            "Pelvic pain can be associated with PCOS cysts. Monitor the severity and frequency."
        ],
        r'\b(acne|pimple|skin)\b': [
            "Hormonal acne is common with PCOS due to excess androgens. A low-glycemic diet and proper skincare routine can help.",
            "Dermatologists often recommend specific treatments for hormonal acne. Avoid dairy and high-sugar foods as they can trigger flare-ups."
        ],
        r'\b(weight|fat|diet|food)\b': [
            "Weight management with PCOS is tough due to insulin resistance. Focus on low-GI foods, protein, and fiber.",
            "A slight weight loss of 5-10% can significantly improve symptoms and cycle regularity. Have you checked our Fitness & Nutrition plans?"
        ],
        r'\b(pregnant|baby|fertility|conceive)\b': [
            "PCOS is a leading cause of infertility, but many women with PCOS get pregnant naturally or with help. Ovulation induction is a common treatment.",
            "Tracking ovulation is key. If you are trying to conceive, consult a fertility specialist for personalized advice."
        ],
        r'\b(hair|hirsutism|facial)\b': [
            "Excess hair growth (hirsutism) is caused by high androgen levels. Medications like spironolactone or procedures like laser hair removal can be effective.",
            "Spearmint tea has been shown to have mild anti-androgen effects which might help with hirsutism."
        ]
    }
    
    for pattern, responses in rules.items():
        if re.search(pattern, msg):
            return random.choice(responses)
            
    return "I understand you're asking about health. While I'm an AI, I recommend consulting a healthcare provider for specific medical advice. Can I help you with symptoms like acne, weight, or irregular cycles?"
