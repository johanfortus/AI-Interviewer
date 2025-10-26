import os, io, json
from fastapi import FastAPI, UploadFile, File, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Literal, Dict
from dotenv import load_dotenv
from openai import OpenAI
from PyPDF2 import PdfReader

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError("Missing OPENAI_API_KEY in environment")
client = OpenAI(api_key=OPENAI_API_KEY)


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"]
)

class Profile(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    links: List[str] = []
    location: Optional[str] = None
    top_skills: List[str] = Field(default_factory=list)
    technical_skills: List[str] = Field(default_factory=list)
    experience: List[str] = Field(default_factory=list)
    education: List[str] = Field(default_factory=list)
    projects: List[str] = Field(default_factory=list)

class ParseResponse(BaseModel):
    profile: Profile
    tokens_used: Optional[int] = None


class GenerateQuestionsRequest(BaseModel):
    profile: Profile
    role: str
    company: Optional[str] = None
    interview_type: Literal["Behavioral", "Engineering Manager", "Mixed"] = "Mixed"
    raw_text: Optional[str] = None
    per_item: int = 4

class QAItem(BaseModel):
    item: str
    hr_questions: List[str] = Field(default_factory=list)
    technical_questions: List[str] = Field(default_factory=list)

class QuestionsResponse(BaseModel):
    role: str
    company: Optional[str] = None
    interview_type: str
    Education: List[QAItem] = Field(default_factory=list)
    Work_Experience: List[QAItem] = Field(default_factory=list)
    Projects: List[QAItem] = Field(default_factory=list)
    Skills: List[QAItem]= Field(default_factory=list)
    Leadership: List[QAItem] = Field(default_factory=list)


# file size limit
MAX_BYTES = 4 * 1024 * 1024


def read_pdf(b: bytes) -> str:
    reader = PdfReader(io.BytesIO(b))
    return "\n".join((p.extract_text() or "") for p in reader.pages)


def read_docx(b: bytes) -> str:
    try:
        import docx
    except ImportError:
        raise HTTPException(status_code=500, detail="Install python-docx to parse .docx")

    d = docx.Document(io.BytesIO(b))
    return "\n".join(p.text for p in d.paragraphs)


def extract_text(up: UploadFile) -> str:
    name = (up.filename or "").lower()
    data = up.file.read()

    if not data:
        raise HTTPException(status_code=400, detail="Empty file")

    if len(data) > MAX_BYTES:
        raise HTTPException(status_code=413, detail="File too large (max 4MB)")

    if name.endswith(".pdf"):
        return read_pdf(data)

    if name.endswith(".docx"):
        return read_docx(data)

    if name.endswith(".txt") or name.endswith(".md"):
        return data.decode(errors="ignore")

    try:
        return read_pdf(data)
    except Exception:
        try:
            return data.decode(errors="ignore")
        except Exception:
            raise HTTPException(status_code=415, detail="Unsupported file type")

def build_messages(resume_text: str):

    system = (
        "You are a strict resume parser. "
        "Return JSON only. Do not summarize or invent facts."
    )

    user = f"""
        Parse the following resume and return STRICT JSON that includes **every bullet point** for experience and projects, concatenated into one description per item.
        
        ### Required JSON Format ###
        {{
            "name": "...",
            "email": "...",
            "phone": "...",
            "links": ["https://...", "..."],
            "location": "...",
            "top_skills": ["...", "..."],
            "technical_skills": ["...", "..."],
            "experience": [
                "Role @ Company (Dates) - bullet1. bullet2. bullet3.",
                ...
            ],
            "education": ["Degree, School (Dates)", "..."],
            "projects": [
                "Project - tech stack - bullet1. bullet2. bullet3.",
                ...
            ],
        }}
        
        ### Parsing Rules ###
        - Preserve **ALL bullet points** for Experience and Projects, joining them into one string separated by periods.
        - Keep the tone factual; do NOT summarize or rephrase.
        - Do not infer missing data; use null/[] if unknown.
        - If the resume contains multiple sections with the same header (e.g. two experience sections), merge them. 

        Resume:
        \"\"\"{resume_text}\"\"\"
    """

    return [{ "role" : "system", "content" : system},
            {"role" : "user", "content" : user}]


def build_questions_messages(
        profile: Profile,
        role: str,
        company: Optional[str],
        interview_type: Literal["Behavioral", "Engineering Manager", "Mixed"],
        per_item: int,
        raw_text: Optional[str] = None
):
    if interview_type == "Behavioral":
        behavioral_count, technical_count = per_item, 1
    elif interview_type == "Engineering Manager":
        behavioral_count, technical_count = per_item, per_item
    else:
        behavioral_count, technical_count = per_item, per_item

    system = (
        "You are a senior interviewer. Generate realistic, role-tailored questions. "
        "Use the candidate's actual experience/projects/skills. "
        "Return JSON only. No explanations outside JSON."
    )

    resume_block = f'\n\nFull Resume Text:\n\"\"\"{raw_text}\"\"\"' if raw_text else ""

    user = f"""
        Prepare interview questions for a candidate applying to the role: "{role}"{f' at "{company}"' if company else ''}.
        Use BOTH the structured profile and (if provided) the raw resume text. Prefer exact phrasing, metrics, dates, and
        technologies from the resume for credibility/ownership checks.
        
        Interview type: {interview_type}
        Per resume item, generate up to {behavioral_count} Behavioral/HR questions and up to {technical_count} Technical/Role-specific questions.
        (These are NOT coding/Leetcode questions. Save algorithm/data structure problems for a separate coding round.)
        
        Group by sections: Education, Work Experience, Projects, Skills, Leadership.
        Within each section, group by item (e.g., each job, project, or degree).
        
        Rules:
        - Questions must be specific to the candidate's items; avoid generic wording.
        - Keep each question under 25 words.
        - If a section or item doesn't exist, return an empty array for that section.
        - For "Engineering Manager", include leadership, strategy, delivery, ambiguity, cross-functional, conflict, and stakeholder alignment angles.
        - Return STRICT JSON with this shape (valid JSON, no trailing commas, no comments):
        
        {{
            "role": "{role}",
            "company": {json.dumps(company)},
            "interview_type": "{interview_type}",
            "Education": [{{ "item": "School or Degree", "hr_questions": [], "technical_questions": [] }}],
            "Work_Experience": [{{ "item": "Role @ Company (Dates)", "hr_questions": [], "technical_questions": [] }}],
            "Projects": [{{ "item": "Project name", "hr_questions": [], "technical_questions": [] }}],
            "Skills": [{{ "item": "Skill area", "hr_questions": [], "technical_questions": [] }}],
            "Leadership": [{{ "item": "Org/role (if any)", "hr_questions": [], "technical_questions": [] }}]
        }}
        
        Candidate Profile (JSON):
        {json.dumps(profile.dict(), indent=2)}
        {resume_block}
    """

    return [
        {"role":"system", "content":system},
        {"role":"user", "content":user}
    ]

@app.post("/api/parse_resume", response_model=ParseResponse)
async def parse_resume(file: UploadFile = File(...)):
    try:
        raw = extract_text(file)
        if not raw.strip():
            raise HTTPException(status_code=400, detail="Could not extract text")

        res = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=build_messages(raw),
            response_format={"type":"json_object"},
            temperature=0.2
        )

        data = json.loads(res.choices[0].message.content)
        profile = Profile(**data)
        usage = getattr(res, "usage", None)
        tokens = getattr(usage, "total_tokens", None)
        return ParseResponse(profile=profile, tokens_used=tokens)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Parse error: {e}")


@app.post("/api/generate_questions", response_model=QuestionsResponse)
async def generate_questions(payload: GenerateQuestionsRequest):
    try:
        msgs = build_questions_messages(
            profile=payload.profile,
            role=payload.role,
            company=payload.company,
            interview_type=payload.interview_type,
            per_item=payload.per_item,
            raw_text=payload.raw_text
        )

        res = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=msgs,
            response_format={"type":"json_object"},
            temperature=0.5
        )

        data = json.loads(res.choices[0].message.content)

        if "Work Experience" in data:
            data["Work_Experience"] = data.pop("Work Experience")

        return QuestionsResponse(**data)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Question Generation Failed: {e}")