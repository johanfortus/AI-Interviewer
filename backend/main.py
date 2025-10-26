import os, io, json
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
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
    target_roles: List[str] = Field(default_factory=list)

class ParseResponse(BaseModel):
    profile: Profile
    tokens_used: Optional[int] = None


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
        "You are a strict resume parser."
        "Return concise JSON only. Do not invent facts."
    )

    user = f"""
        Parse the resume below and return STRICT JSON matching:
        
        {{
            "name": "...",
            "email": "...",
            "phone": "...",
            "links": ["https://...", "..."],
            "location": "...",
            "top_skills": ["...", "..."],
            "technical_skills": ["...", "..."],
            "experience": ["Role @ Company (Dates) - 1 impact line", "..."],
            "education": ["Degree, School (Dates)", "..."],
            "projects": ["Project - tech stack - impact", "..."],
            "target_roles": ["Software Engineer", "AI Engineer"]
        }}
        
        Rules: <= items per list where possible; trim lines; use null/[] if unknown.
        Resume:
        \"\"\"{resume_text[:30000]}\"\"\"
    """

    return [{ "role" : "system", "content" : system},
            {"role" : "user", "content" : user}]


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

