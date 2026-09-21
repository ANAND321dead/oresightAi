# pyrefly: ignore [missing-import]
from fastapi import FastAPI, HTTPException
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import data

app = FastAPI(title="OreSight AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/api/dashboard")
def get_dashboard():
    return data.DASHBOARD


@app.get("/api/equipment")
def get_equipment():
    return data.EQUIPMENT


@app.get("/api/blocks")
def get_blocks():
    return data.BLOCKS


@app.get("/api/blocks/{block_id}")
def get_block(block_id: str):
    for b in data.BLOCKS:
        if b["id"] == block_id:
            return b
    raise HTTPException(status_code=404, detail="Block not found")


@app.get("/api/production")
def get_production():
    return data.PRODUCTION


@app.get("/api/risks")
def get_risks():
    return data.RISKS


@app.get("/api/recommendations")
def get_recommendations():
    return data.RECOMMENDATIONS


class SimulationInput(BaseModel):
    rainfall_change_percent: float
    equipment_availability_percent: float
    blasting_delay_hours: float
    operating_hours_per_day: float


@app.post("/api/simulations/production")
def simulate_production(params: SimulationInput):
    base = 91500
    forecast = round(
        base
        + (params.equipment_availability_percent - 82) * 620
        + (12 - params.blasting_delay_hours) * 310
        + (params.operating_hours_per_day - 18) * 430
        - params.rainfall_change_percent * 22
    )
    target = 100000
    shortfall = max(0, target - forecast)
    achievement_pct = round(forecast / target * 100, 1)
    risk = "LOW" if achievement_pct >= 97 else "MEDIUM" if achievement_pct >= 93 else "HIGH"
    return {
        "forecast_tonnes": forecast,
        "target_tonnes": target,
        "shortfall_tonnes": shortfall,
        "target_achievement_percent": achievement_pct,
        "risk_level": risk,
        "model_status": "fallback"
    }