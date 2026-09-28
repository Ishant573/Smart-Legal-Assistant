"""
Smart Legal Assistant - FastAPI Production Backend
Integrated with Google Gemini 2.5 Flash / Gemini 3 series and Indian Law RAG.
"""

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Smart Legal Assistant API",
    description="AI-powered legal platform for Indian laws (IPC/BNS, BNSS, BSA, Constitution), FIR assistance, and document analysis.",
    version="1.0.0",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health Check
@app.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "Smart Legal Assistant Backend",
        "model": "gemini-2.5-flash / gemini-3.8-flash",
        "jurisdiction": "Republic of India",
        "primaryActs": ["BNS 2023", "BNSS 2023", "BSA 2023", "Constitution of India"]
    }

# Mock API Routers for demonstration
@app.get("/api/v1/sections")
def list_sections():
    return {"status": "success", "message": "Access IPC/BNS database"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
