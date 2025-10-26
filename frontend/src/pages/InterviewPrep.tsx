import { useState } from "react";
import { Link } from "react-router-dom";

export default function PrepScreen() {
  const [resumeText, setResumeText] = useState<string | null>(null);
  const [selectedText, setSelectedText] = useState<string>("");
  const [company, setCompany] = useState("Google");
  const [overview, setOverview] = useState({
    about: "Google is a global technology company focused on organizing the world's information.",
    culture: "Open innovation, collaboration, user-first mindset.",
    values: "Transparency • Growth • Impact",
  });

  function handleTextSelection() {
    const selection = window.getSelection()?.toString();
    if (selection) setSelectedText(selection);
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-ink)] p-8">
      <h1 className="text-3xl font-semibold mb-8 text-center">Interview Prep</h1>

      <div className="grid md:grid-cols-2 gap-8">

        <div
          onMouseUp={handleTextSelection}
          className="relative bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm overflow-y-auto h-[70vh]"
        >
          <div className="text-sm text-[var(--color-ink-muted)] mb-3">
            {resumeText ? "Click and drag to highlight text to focus on." : "Upload or paste résumé content."}
          </div>

          <textarea
            placeholder="Paste your résumé text here..."
            className="w-full h-[60vh] bg-transparent outline-none resize-none text-[var(--color-ink)]"
            onChange={(e) => setResumeText(e.target.value)}
          />
          {selectedText && (
            <div className="absolute bottom-4 right-4 bg-[var(--color-primary)] text-white text-sm px-4 py-2 rounded-xl shadow cursor-pointer">
              Generate Questions
            </div>
          )}
        </div>

        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm h-[70vh] flex flex-col">
          <h2 className="text-2xl font-semibold mb-2">{company}</h2>
          <p className="text-[var(--color-ink-muted)] text-sm">Target Company Overview</p>

          <div className="mt-4 space-y-4 overflow-y-auto">
            <section>
              <h3 className="font-medium text-[var(--color-primary)] mb-1">About</h3>
              <p>{overview.about}</p>
            </section>
            <section>
              <h3 className="font-medium text-[var(--color-primary)] mb-1">Culture</h3>
              <p>{overview.culture}</p>
            </section>
            <section>
              <h3 className="font-medium text-[var(--color-primary)] mb-1">Values</h3>
              <p>{overview.values}</p>
            </section>
            <section className="pt-3 border-t border-[var(--color-border)]">
              <h3 className="font-medium text-[var(--color-primary)] mb-1">Sample Company Questions</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Why do you want to work at {company}?</li>
                <li>How do you align with {company}'s values?</li>
                <li>What would you bring to the {company} team?</li>
              </ul>
            </section>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-10 gap-4">
        <button
          className="rounded-2xl px-6 py-3 font-medium bg-[var(--color-primary)] text-white shadow hover:bg-[var(--color-primary-600)]"
        >
          AI Review My Résumé
        </button>
        
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
