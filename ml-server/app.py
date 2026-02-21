from fastapi import FastAPI
from pydantic import BaseModel
from model import predict_next_month

app = FastAPI()

class PredictionInput(BaseModel):
    expenses: list[float]
    savings: list[float]

@app.post("/predict")
def predict(data: PredictionInput):
    return predict_next_month(data.expenses, data.savings)
