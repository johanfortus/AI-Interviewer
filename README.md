# PrepTalk: AI-Interviewer
> An AI-powered mock interview platform that analyzes resumes, generates personalized questions, and simulates realistic interview sessions with live feedback.

---

## Overview

**PrepTalk** helps students and professionals prepare smarter for job interviews by combining resume analysis, company insights, and AI-generated questions.  
The platform allows users to:
- Upload a resume and receive feedback.
- Generate tailored interview questions based on experience, role, or company.
- Access company culture and value summaries.
- Participate in live mock interviews with webcam and technical coding options.

---

## Background
Both members are Computer Science students in their final year at the University of Florida, preparing for internships and full-time roles.  

**PrepTalk** was developed during **Gator Hack IV**, part of **UF’s AI Days**.

**Team Members**  
- **Johan Fortus** — Backend Developer / AI Integration  
- **Vanessa Serrano** — Frontend Developer / UX Design  

---

## Features

- **AI Resume Parsing** — Upload PDF/DOCX/TXT and extract structured data (skills, experience, education).  
- **Question Generation** — Role-specific interview questions powered by GPT models.  
- **Company Insights** — Get summaries on culture, values, and common interview themes.  
- **Mock Interviews** — Live AI-led practice with webcam and tone analysis (in progress).  
- **Technical Interview Mode** — Includes a built-in **Monaco Editor** for coding exercises.  
- **Modern UI** — Minimal, responsive interface built with **Tailwind CSS** and **React**.  

---

## Architecture
### **Frontend** — TypeScript + React + Tailwind
Handles user interaction, file uploads, question display, and live feedback.
- Built with **TypeScript, React**, and **Tailwind CSS**.
- Handles file uploads, question display, and webcam preview.
- Communicates with backend APIs via `fetch()` calls.

### **Backend** — Python + FastAPI + OpenAI
Handles resume parsing and AI question generation.
- Built with **Python, FastAPI** and **OpenAI’s GPT-4o-mini**.
- Generates structured interview questions and feedback as JSON.

---

## Setup Instructions
### Prerequisites
Before running PrepTalk locally, ensure you have the following installed:
- [Python 3.10+](https://www.python.org/downloads/)
- [Node.js 18+ and npm](https://nodejs.org/en/download/)
- [OpenAI API key](https://platform.openai.com/api-keys)

### Clone the Repository
```bash
git clone https://github.com/johanfortus/AI-Interviewer.git
cd AI-Interviewer
```

### Backend Setup
1. **Navigate to backend folder**
    ```bash
    cd backend
    ```
2. **Create a virtual environment**
    ```bash
    python -m venv venv
    source venv/bin/activate
    ```

3. **Install dependencies**
    ```bash
   pip install -r requirements.txt
   ```
   
4. **Set up environment variables**
    
    Create a .env file inside your backend directory and add:
    ```bash
   OPENAI_API_KEY=sk-yourkeyhere
   ```
   
5. **Run the development server**

    The backend will run at: http://localhost:8000
    ```bash
    uvicorn main:app --reload
    ```

6. **Test the endpoints**
   - Open interactive API docs → http://localhost:8000/docs
   - Try /api/parse_resume (upload a PDF)
   - Try /api/generate_questions (use parsed JSON from above)

### Frontend Setup
1. **Navigate to the frontend folder**
    ```bash
    cd frontend
    ```

2. **Install dependencies**
    ```bash
    npm install
    ```

3. **Start the frontend**
    
    The frontend will run at: http://localhost:5173
    ```bash
    npm run dev
    ```

---

<img src="https://drive.google.com/uc?export=view&id=1HrRDM6NcATjnV-XnFm-59H6eOVrxqSFS" /> 