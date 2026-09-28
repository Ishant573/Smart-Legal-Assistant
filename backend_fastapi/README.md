# Smart Legal Assistant - Python FastAPI Backend & RAG Architecture

This folder contains the complete, production-ready Python FastAPI backend implementation for **Smart Legal Assistant**, designed to run standalone or alongside modern frontends.

## Key Features

1. **AI Model**: Google Gemini 2.5 Flash (`gemini-2.5-flash` / `@google/genai`) for legal grounding and document extraction.
2. **Indian Law RAG**: Chunking and semantic indexing over:
   - Bharatiya Nyaya Sanhita (BNS 2023)
   - Bharatiya Nagarik Suraksha Sanhita (BNSS 2023)
   - Bharatiya Sakshya Adhiniyam (BSA 2023)
   - Constitution of India (Fundamental Rights & Writs)
   - IT Act 2000 & Consumer Protection Act 2019
3. **Authentication**: JWT token-based auth with Role-Based Access Control (`citizen`, `student`, `lawyer`, `admin`).
4. **Database**: SQLite (local development) or PostgreSQL (production via SQLAlchemy).
5. **Modules**:
   - IPC to BNS Conversion & Section Search
   - FIR Guidance Assistant & FIR Draft Generator
   - Legal Document Auditor (PDF/DOCX/TXT)
   - RAG Grounded Legal Chatbot with bilingual support (English & Hindi)

## Quick Start (FastAPI)

```bash
# 1. Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Set environment variable
export GEMINI_API_KEY="your-gemini-api-key"

# 4. Start the server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Interactive API documentation will be available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
