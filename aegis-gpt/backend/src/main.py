import sys
import os
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

# Ensure the local 'nlp' package is discoverable
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from nlp.risk_analyzer import analyze_and_anonymize


app = FastAPI(
    title="AegisGPT Risk Engine",
    description="Privacy-first PII detection microservice powered by Microsoft Presidio and spaCy.",
    version="1.0.0",
)

# CORS — restrict to your frontend origin in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


class TextRequest(BaseModel):
    text: str
    language: Optional[str] = "en"


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "AegisGPT Risk Engine"}


@app.post("/api/v1/analyze")
def analyze_text(request: TextRequest):
    if not request.text.strip():
        raise HTTPException(status_code=422, detail="Text cannot be empty.")
    if len(request.text) > 50_000:
        raise HTTPException(status_code=413, detail="Text exceeds maximum allowed length of 50,000 characters.")
    return analyze_and_anonymize(request.text, language=request.language or "en")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
