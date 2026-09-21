DASHBOARD = {
    "today_output": 3240,
    "target": 3600,
    "forecast": 3410,
    "shortfall_risk": "HIGH"
}

EQUIPMENT = [
    {"id": "E-14", "type": "Excavator", "status": "Maintenance", "utilization": 61},
    {"id": "H-07", "type": "Haul Truck", "status": "Active", "utilization": 88},
    {"id": "H-12", "type": "Haul Truck", "status": "Active", "utilization": 92},
    {"id": "D-03", "type": "Drill", "status": "Delayed", "utilization": 72},
    {"id": "B-02", "type": "Bulldozer", "status": "Active", "utilization": 84},
]

BLOCKS = [
    {"id": "B12", "score": 94, "confidence": 89, "grade": 36.2, "depth": "38–61 m"},
    {"id": "B17", "score": 76, "confidence": 78, "grade": 29.4, "depth": "55–78 m"},
    {"id": "B18", "score": 88, "confidence": 83, "grade": 32.1, "depth": "44–70 m"},
    {"id": "B21", "score": 81, "confidence": 80, "grade": 30.7, "depth": "48–73 m"},
    {"id": "B27", "score": 92, "confidence": 86, "grade": 34.8, "depth": "42–68 m"},
]

PRODUCTION = [
    {"day": "1", "planned": 3500, "actual": 3380, "forecast": 3400},
    {"day": "2", "planned": 3560, "actual": 3420, "forecast": 3450},
    {"day": "3", "planned": 3520, "actual": 3330, "forecast": 3390},
    {"day": "4", "planned": 3600, "actual": 3440, "forecast": 3480},
    {"day": "5", "planned": 3580, "actual": 3370, "forecast": 3420},
    {"day": "6", "planned": 3620, "actual": 3490, "forecast": 3510},
    {"day": "7", "planned": 3600, "actual": 3240, "forecast": 3410},
]

RISKS = [
    {"name": "Equipment downtime", "value": 42, "color": "#ed5b3f"},
    {"name": "Blasting delays", "value": 27, "color": "#f2a52e"},
    {"name": "Weather", "value": 18, "color": "#d4be49"},
    {"name": "Other", "value": 13, "color": "#547680"},
]

RECOMMENDATIONS = [
    {
        "id": "REC-001",
        "title": "Redeploy Excavator E-14 to Mine A",
        "expected_recovery_tonnes": 4500,
        "confidence": 82,
        "risk_reduction": "HIGH to MEDIUM",
        "status": "PENDING"
    },
    {
        "id": "REC-002",
        "title": "Reduce blasting delay by 4 hours",
        "expected_recovery_tonnes": 2100,
        "confidence": 76,
        "risk_reduction": "HIGH to MEDIUM",
        "status": "PENDING"
    },
]