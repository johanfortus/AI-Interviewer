import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

type Mode = "resume" | "company";

type ResumeFeedback = {
  strengths: string[];
  gaps: string[];
  suggestions: string[];
  questions: string[];
};

type CompanyInfo = {
  name: string;
  about: string;
  culture: string;
  values: string[];
  questions: string[];
};

/* ---------------- Mock resume analysis (txt only) ---------------- */
function analyzeResume(text: string): ResumeFeedback {
  const lower = text.toLowerCase();
  const strengths: string[] = [];
  const gaps: string[] = [];
  const suggestions: string[] = [];
  const questions: string[] = [];

  const hasLeadership = /(lead|manager|ment(or|ored)|ownership)/.test(lower);
  const hasImpact = /(impact|reduced|increased|grew|improved|optimized|kpi|okr)/.test(lower);
  const hasMetrics = /\b(?:%\b|\d{2,})/.test(text);
  const hasSystemDesign = /(distributed|microservice|scal(e|ability)|latency|throughput)/.test(lower);
  const hasCollab = /(team|cross-?functional|stakeholder|collaborat)/.test(lower);

  if (hasLeadership) strengths.push("Leadership / ownership experience detected.");
  if (hasImpact) strengths.push("Impact language present (improved, optimized, growth).");
  if (hasMetrics) strengths.push("Uses quantitative metrics.");

  if (!hasSystemDesign) gaps.push("Little/no system design keywords detected.");
  if (!hasCollab) gaps.push("Collaboration / stakeholder language could be stronger.");
  if (!hasMetrics) gaps.push("Few/no measurable outcomes (metrics) found.");

  if (!hasMetrics) suggestions.push("Add 1–2 bullet points with clear metrics (%, time saved, revenue).");
  if (!hasSystemDesign) suggestions.push("Include a system/design bullet (scale, latency, reliability tradeoffs).");
  if (!hasLeadership) suggestions.push("Add an ownership example: a project you led end-to-end.");

  if (!hasSystemDesign) {
    questions.push(
      "Walk me through a system you designed. What were the scalability constraints?",
      "How would you improve latency for a high-traffic API?"
    );
  }
  if (!hasMetrics) {
    questions.push(
      "Tell me about a time you drove measurable impact. What metric proved success?",
      "Share an example where you set OKRs or KPIs and hit them."
    );
  }
  if (!hasCollab) {
    questions.push(
      "Describe a time you aligned multiple stakeholders with conflicting priorities.",
      "How do you handle disagreements within a cross-functional team?"
    );
  }
  if (hasLeadership) {
    questions.push("Tell me about a time you provided direction in ambiguity.");
  }

  return { strengths, gaps, suggestions, questions: [...new Set(questions)] };
}

/* ---------------- Mock company info ---------------- */
const COMPANY_DB: Record<string, CompanyInfo> = {
  google: {
    name: "Google",
    about: "Global technology company focused on organizing the world’s information.",
    culture: "Open innovation, collaboration, user-first mindset, and a strong emphasis on learning.",
    values: ["Focus on the user", "Be data driven", "Strive for excellence"],
    questions: [
      "Why do you want to work at Google?",
      "How do you design for billions of users?",
      "Describe a time you made a data-driven decision.",
    ],
  },
};

async function fetchCompanyInfo(name: string): Promise<CompanyInfo | null> {
  const key = name.trim().toLowerCase();
  if (COMPANY_DB[key]) return COMPANY_DB[key];
  if (!name.trim()) return null;
  return {
    name,
    about: `${name} — company info placeholder. Connect to backend to fetch real data.`,
    culture: "Collaborative, learning-oriented culture with emphasis on customer value.",
    values: ["Customer obsession", "Ownership", "Bias for action"],
    questions: [
      `Why do you want to work at ${name}?`,
      `Which of ${name}'s values resonates most with you and why?`,
    ],
  };
}

/* ---------------- Page ---------------- */
export default function InterviewPrep() {
  const [mode, setMode] = useState<Mode>("resume");

  // résumé state
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeObjectUrl, setResumeObjectUrl] = useState<string | null>(null);
  const [resumeTxt, setResumeTxt] = useState<string>(""); // only used for .txt analysis
  const [resumeResult, setResumeResult] = useState<ResumeFeedback | null>(null);
  const [resumeBusy, setResumeBusy] = useState(false);

  // company state
  const [companyQuery, setCompanyQuery] = useState("");
  const [companyResult, setCompanyResult] = useState<CompanyInfo | null>(null);
  const [companyBusy, setCompanyBusy] = useState(false);

  // create/revoke object URL for file previews (PDF/DOCX)
  useEffect(() => {
    if (!resumeFile) {
      if (resumeObjectUrl) URL.revokeObjectURL(resumeObjectUrl);
      setResumeObjectUrl(null);
      return;
    }
    const url = URL.createObjectURL(resumeFile);
    setResumeObjectUrl(url);
    return () => URL.revokeObjectURL(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeFile]);

  const isTxt = useMemo(() => resumeFile?.type === "text/plain", [resumeFile]);
  const isPdf = useMemo(() => resumeFile?.type === "application/pdf", [resumeFile]);
  const isDoc =
    resumeFile?.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    resumeFile?.type === "application/msword";

  const onUpload = async (f: File | undefined) => {
    if (!f) return;
    setResumeFile(f);
    setResumeResult(null);
    if (f.type === "text/plain") {
      const t = await f.text();
      setResumeTxt(t);
    } else {
      setResumeTxt("");
    }
  };

  const runResumeAnalysis = async () => {
    if (!isTxt || !resumeTxt) return; // analysis only for txt in FE
    setResumeBusy(true);
    await new Promise((r) => setTimeout(r, 400));
    setResumeResult(analyzeResume(resumeTxt));
    setResumeBusy(false);
  };

  const searchCompany = async () => {
    setCompanyBusy(true);
    await new Promise((r) => setTimeout(r, 400));
    const info = await fetchCompanyInfo(companyQuery);
    setCompanyResult(info);
    setCompanyBusy(false);
  };

  return (
    <div className="min-h-screen text-[var(--color-ink)]">
      <h1 className="text-3xl md:text-4xl font-semibold text-center mb-8">Interview Prep</h1>

      {/* Mode toggle */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-1">
          <button
            onClick={() => setMode("resume")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              mode === "resume"
                ? "bg-[var(--color-primary)] text-white"
                : "text-[var(--color-ink)] hover:bg-[var(--color-muted)]/60"
            }`}
          >
            Résumé
          </button>
          <button
            onClick={() => setMode("company")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              mode === "company"
                ? "bg-[var(--color-primary)] text-white"
                : "text-[var(--color-ink)] hover:bg-[var(--color-muted)]/60"
            }`}
          >
            Company
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* LEFT: input / viewer */}
        <section className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
          {mode === "resume" ? (
            <>
              <div className="text-sm text-[var(--color-ink-muted)] mb-3">
                Upload your résumé. PDFs render inline. (.txt enables quick local AI review)
              </div>

              {/* file picker */}
              <div className="flex items-center gap-3 mb-4">
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--color-border)] cursor-pointer hover:bg-[var(--color-muted)]/60">
                  <span>Choose file</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    className="hidden"
                    onChange={async (e) => onUpload(e.target.files?.[0])}
                  />
                </label>

                {/* AI review button: enabled only for .txt here in FE */}
                <button
                  disabled={!isTxt || !resumeTxt || resumeBusy}
                  onClick={runResumeAnalysis}
                  className={`rounded-2xl px-5 py-2.5 font-medium transition ${
                    isTxt && resumeTxt
                      ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-600)]"
                      : "bg-[var(--color-muted)]/60 text-[var(--color-ink-muted)] cursor-not-allowed"
                  }`}
                  title={!isTxt ? "PDF/DOCX analysis requires backend parsing" : ""}
                >
                  {resumeBusy ? "Analyzing…" : "AI Review My Résumé"}
                </button>
              </div>

              {/* viewer area */}
              <div className="rounded-xl overflow-hidden border border-[var(--color-border)] bg-white/80">
                {!resumeFile && (
                  <div className="h-[46vh] grid place-items-center text-[var(--color-ink-muted)]">
                    No file selected.
                  </div>
                )}

                {resumeFile && isPdf && resumeObjectUrl && (
                  <iframe
                    title="resume-pdf"
                    src={resumeObjectUrl}
                    className="w-full h-[70vh]"
                  />
                )}

                {resumeFile && isDoc && (
                  <div className="h-[46vh] grid place-items-center p-6 text-center">
                    <p className="text-[var(--color-ink)] font-medium">{resumeFile.name}</p>
                    <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
                      DOC/DOCX preview isn’t supported by the browser. You can download or connect the backend
                      to render/parse it.
                    </p>
                    <a
                      href={resumeObjectUrl ?? "#"}
                      download={resumeFile.name}
                      className="mt-4 inline-flex rounded-2xl px-4 py-2 bg-[var(--color-primary)] text-white"
                    >
                      Download
                    </a>
                  </div>
                )}

                {resumeFile && isTxt && (
                  <pre className="w-full h-[46vh] overflow-auto p-4 text-sm whitespace-pre-wrap">
                    {resumeTxt}
                  </pre>
                )}
              </div>

              {!isTxt && resumeFile && (
                <p className="mt-2 text-xs text-[var(--color-ink-muted)]">
                  Want AI feedback on PDFs/DOCX? Hook this button to your backend resume-parser endpoint.
                </p>
              )}
            </>
          ) : (
            <>
              <div className="text-sm text-[var(--color-ink-muted)] mb-3">
                Search a company to preview overview, culture, and values.
              </div>
              <div className="flex gap-3">
                <input
                  className="flex-1 rounded-2xl border border-[var(--color-border)] bg-white/70 px-4 py-3 outline-none"
                  placeholder="e.g., Google"
                  value={companyQuery}
                  onChange={(e) => setCompanyQuery(e.target.value)}
                />
                <button
                  onClick={searchCompany}
                  disabled={!companyQuery.trim() || companyBusy}
                  className={`rounded-2xl px-5 py-3 font-medium transition ${
                    companyQuery.trim()
                      ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-600)]"
                      : "bg-[var(--color-muted)]/60 text-[var(--color-ink-muted)] cursor-not-allowed"
                  }`}
                >
                  {companyBusy ? "Searching…" : "Search"}
                </button>
              </div>
              <p className="mt-2 text-xs text-[var(--color-ink-muted)]">
                (Replace with a backend call for real company data.)
              </p>
            </>
          )}
        </section>

        {/* RIGHT: results */}
        <section className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm">
          {mode === "resume" ? (
            resumeResult ? (
              <div className="space-y-5">
                <h2 className="text-xl font-semibold">Résumé Feedback</h2>
                <ResultList title="Strengths" items={resumeResult.strengths} />
                <ResultList title="Gaps" items={resumeResult.gaps} />
                <ResultList title="Suggestions" items={resumeResult.suggestions} />
                <div className="pt-3 border-t border-[var(--color-border)]">
                  <h3 className="font-medium text-[var(--color-primary)] mb-2">Targeted Questions</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {resumeResult.questions.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <EmptyHint text={resumeFile ? "AI review is available for .txt locally. Use backend to analyze PDFs/DOCX." : "Upload a résumé to begin."} />
            )
          ) : companyResult ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{companyResult.name}</h2>
              <p className="text-[var(--color-ink-muted)] text-sm">Company Overview</p>
              <Section title="About" content={companyResult.about} />
              <Section title="Culture" content={companyResult.culture} />
              <Section title="Values" content={companyResult.values.join(" • ")} />
              <div className="pt-3 border-t border-[var(--color-border)]">
                <h3 className="font-medium text-[var(--color-primary)] mb-2">Company Questions</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {companyResult.questions.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <EmptyHint text="Search a company to see overview, values, and example questions." />
          )}
        </section>
      </div>

      <div className="flex justify-center mt-10 gap-4">
        <Link
          to="/start"
          className="rounded-2xl px-6 py-3 font-medium bg-[var(--color-muted)] text-[var(--color-ink)] hover:bg-[var(--color-muted)]/80"
        >
          Start Interview
        </Link>
      </div>
    </div>
  );
}

/* ---------------- Small UI helpers ---------------- */
function ResultList({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div>
      <h3 className="font-medium text-[var(--color-primary)] mb-1">{title}</h3>
      <ul className="list-disc pl-5 space-y-1">
        {items.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </div>
  );
}

function Section({ title, content }: { title: string; content: string }) {
  return (
    <section>
      <h3 className="font-medium text-[var(--color-primary)] mb-1">{title}</h3>
      <p>{content}</p>
    </section>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <div className="h-full min-h-[46vh] grid place-items-center text-center">
      <p className="text-[var(--color-ink-muted)]">{text}</p>
    </div>
  );
}
