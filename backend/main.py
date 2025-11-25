from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import pandas as pd
import numpy as np
import os
import joblib
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import model logic
from model import get_prediction, train_model_if_needed
from chatbot import get_bot_response

# Initialize model on startup
train_model_if_needed()

app = FastAPI(title="FemAura ML Service")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PatientData(BaseModel):
    age: float
    weight: float
    height: float
    cycle: str
    cycle_length: float
    marriage_status: str
    pregnant: str
    hip: float
    waist: float
    acne: str
    hair_growth: str
    skin_darkening: str
    fast_food: str

class PredictionResult(BaseModel):
    risk: str
    probability: float

class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

@app.get("/")
def read_root():
    return {"message": "FemAura ML Service is running on port 8001"}

@app.post("/predict", response_model=PredictionResult)
def predict_pcos(data: PatientData):
    try:
        result = get_prediction(data.dict())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat", response_model=ChatResponse)
def chat(msg: ChatMessage):
    response = get_bot_response(msg.message)
    return {"response": response}
