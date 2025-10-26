# PrepTalk: AI-Interviewer
> An AI-powered mock interview platform that analyzes résumés, generates personalized questions, and simulates realistic interview sessions with live feedback.

---

## Overview

**PrepTalk** helps students and professionals prepare smarter for job interviews by combining résumé analysis, company insights, and AI-generated questions.  
The platform allows users to:
- Upload a résumé and receive feedback.
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

- **AI Résumé Parsing** — Upload PDF/DOCX/TXT and extract structured data (skills, experience, education).  
- **Question Generation** — Role-specific interview questions powered by GPT models.  
- **Company Insights** — Get summaries on culture, values, and common interview themes.  
- **Mock Interviews** — Live AI-led practice with webcam and tone analysis (in progress).  
- **Technical Interview Mode** — Includes a built-in **Monaco Editor** for coding exercises.  
- **Modern UI** — Minimal, responsive interface built with **Tailwind CSS** and **React**.  

---

## Architecture
### **Frontend** — React + TypeScript + Vite + Tailwind  
Handles user interaction, file uploads, question display, and live feedback.
- Built with **React, TypeScript, Vite**, and **Tailwind CSS**.
- Handles file uploads, question display, and webcam preview.
- Communicates with backend APIs via `fetch()` calls.

### **Backend** — FastAPI + OpenAI
Handles résumé parsing and AI question generation.
- Built with **FastAPI** and **OpenAI’s GPT-4o-mini**.
- Parses résumé data using **PyPDF2** and **python-docx**.
- Generates structured interview questions and feedback as JSON.

### Clone the Repository
```bash
git clone https://github.com/<your-username>/AI-Interviewer.git
cd AI-Interviewer
