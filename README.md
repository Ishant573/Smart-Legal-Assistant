# ⚖️ Smart Legal Assistant

<div align="center">

### AI-Powered Legal Information & Assistance Platform

Built with **RAG (Retrieval-Augmented Generation)** + **Large Language Models (LLMs)**

![Python](https://img.shields.io/badge/Python-3.10+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green)
![RAG](https://img.shields.io/badge/RAG-AI-orange)
![LLM](https://img.shields.io/badge/LLM-Gemini/OpenAI-purple)
![License](https://img.shields.io/badge/License-MIT-yellow)

**Making Legal Knowledge Accessible for Everyone**

</div>

---

# 📌 Overview

Smart Legal Assistant is an AI-powered platform that helps citizens understand legal information in simple language. The system combines **Retrieval-Augmented Generation (RAG)** with **Large Language Models (LLMs)** to provide accurate legal information, explain legal documents, guide users regarding FIR filing, and answer legal queries.

The platform is designed to bridge the gap between complex legal language and everyday citizens.

---

# 🚨 Problem Statement

Legal information is often difficult to understand because:

* Legal language is complex
* Citizens are unaware of their rights
* Legal procedures are confusing
* Access to legal guidance is limited
* Understanding legal documents requires expertise

---

# 💡 Solution

Smart Legal Assistant simplifies legal information using AI.

Users can:

✅ Search IPC/BNS Sections
✅ Understand Legal Documents
✅ Get FIR Filing Guidance
✅ Ask Legal Questions
✅ Learn About Their Rights
✅ Access Legal Information in Simple Language

---

# 🎯 Key Features

## ⚖️ IPC / BNS Search Engine

Search legal sections using keywords.

### Example

**User Query:**

```text
What is theft?
```

### AI Response

```text
Relevant Section
Definition
Punishment
Related Legal Information
```

---

## 📄 Legal Document Explanation

Upload legal documents and receive simplified explanations.

### Supported Documents

* Contracts
* Agreements
* FIR Copies
* Legal Notices
* Court Documents
* Affidavits

### Output

* Easy Summary
* Important Clauses
* Responsibilities
* Risks
* Important Dates

---

## 🚔 FIR Guidance Assistant

Provides information about:

* How to file an FIR
* Required documents
* FIR procedure
* Citizen rights
* Police jurisdiction

---

## 🤖 AI Legal Chatbot

Ask legal questions in natural language.

### Example Questions

* What are consumer rights?
* What is cyber fraud?
* How can I report online scams?
* What are tenant rights?
* What should I do after identity theft?

---

## 🛡️ Legal Rights Information

The platform provides information related to:

* Consumer Rights
* Women's Rights
* Child Protection Laws
* Cyber Laws
* Property Rights
* Labor Rights
* Senior Citizen Rights

---

# 🏗 System Architecture

```text
                    User
                      │
                      ▼
           Frontend (React/Next.js)
                      │
                      ▼
             FastAPI Backend
                      │
                      ▼
                RAG Pipeline
                      │
      ┌───────────────┼───────────────┐
      ▼               ▼               ▼
 Legal Docs      IPC/BNS Data      Rights DB
      │               │               │
      └───────────────┼───────────────┘
                      ▼
              Vector Database
              (FAISS/Chroma)
                      │
                      ▼
             Large Language Model
          (Gemini/OpenAI/Llama)
                      │
                      ▼
                AI Response
```

---

# 🛠 Technology Stack

## Frontend

* React.js
* Next.js
* Tailwind CSS
* TypeScript

## Backend

* Python
* FastAPI
* REST APIs

## AI & Machine Learning

* LangChain
* RAG
* LLMs
* Sentence Transformers

## Database

* PostgreSQL
* ChromaDB
* FAISS

## Deployment

* Vercel
* Railway
* Render

---

# 📂 Project Structure

```text
Smart-Legal-Assistant/
│
├── frontend/
│   ├── pages/
│   ├── components/
│   ├── hooks/
│   └── public/
│
├── backend/
│   ├── api/
│   ├── rag/
│   ├── services/
│   ├── models/
│   └── utils/
│
├── legal_dataset/
│
├── vector_db/
│
├── uploads/
│
├── requirements.txt
│
├── app.py
│
├── README.md
│
└── .env
```

---

# 🔄 Workflow

### Step 1

User enters a legal query.

### Step 2

The query is processed by the backend.

### Step 3

RAG retrieves relevant legal documents.

### Step 4

LLM analyzes retrieved content.

### Step 5

AI generates a simplified legal response.

### Step 6

The response is displayed to the user.

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/Ishant573/Smart-Legal-Assistant.git
```

```bash
cd Smart-Legal-Assistant
```

---

## Create Virtual Environment

```bash
python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### Linux/Mac

```bash
source venv/bin/activate
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Run Backend

```bash
uvicorn app:app --reload
```

---

## Run Frontend

```bash
npm install
```

```bash
npm run dev
```

---

# 📸 Screenshots

## Home Page

```text
Add Screenshot Here
```

## Legal Chatbot

```text
Add Screenshot Here
```

## Document Analyzer

```text
Add Screenshot Here
```

## IPC/BNS Search

```text
Add Screenshot Here
```

---

# 📈 Future Scope

* Voice-Based Legal Assistant
* Multilingual Support
* Court Case Search
* AI Contract Risk Analysis
* Legal Document Generator
* Mobile Application
* State-Specific Laws
* Regional Language Support

---

# 🔒 Disclaimer

This platform provides educational and informational legal assistance only.

* Not a substitute for professional legal advice
* Not intended for legal representation
* Users should consult qualified lawyers for legal matters and court proceedings

---

# 👨‍💻 Developer

## Ishant Raj

**BCA (Artificial Intelligence & Machine Learning)**
Haridwar University, Uttarakhand

### Skills

* Artificial Intelligence
* Machine Learning
* Retrieval-Augmented Generation (RAG)
* Large Language Models (LLMs)
* Python
* FastAPI
* HTML
* CSS
* JavaScript
* Git & GitHub

### Achievements

🏆 First Place Winner – Tech Sangram, Haridwar University

🏅 TIDES IIT Roorkee Innovation, Design & Entrepreneurship Program Participant

💻 AI & Software Development Enthusiast

---

# 🔗 Connect With Me

### GitHub

https://github.com/Ishant573

### LinkedIn

ishantr573@gmail.com

### Email

ishantr573@gmail.com

---

# 🌟 Project Vision

The vision of Smart Legal Assistant is to democratize legal knowledge through Artificial Intelligence, enabling every citizen to understand laws, rights, and legal procedures without requiring specialized legal expertise.

---

# ⭐ Support

If you found this project useful:

⭐ Star the repository

🍴 Fork the repository

🛠 Contribute to the project

📢 Share with others

---

<div align="center">

### ⚖️ Smart Legal Assistant

**AI for Legal Awareness & Access to Justice**

Made with ❤️ by **Ishant Raj**

</div>
