import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import WebcamPeek from "../components/WebcamPeek";

const SAMPLE_QS: Record<string, string[]> = {
  technical: [
    "Walk me through a system you built end-to-end. What trade-offs did you make?",
    "How would you design a rate limiter for an API used by millions?",
  ],
  behavioral: [
    "Tell me about a time you faced a difficult teammate. What did you do?",
    "Describe a time you influenced a decision without authority.",
  ],
  manager: [
    "How do you balance roadmap priorities with urgent interrupts?",
    "Tell me about a tough performance conversation and the outcome.",
  ],
};

export default function InterviewScreen() {
  const { state } = useLocation() as any;
  const type: "technical" | "behavioral" | "manager" =
    state?.type || "behavioral";
  const [idx, setIdx] = useState(0);
  const [speaking, setSpeaking] = useState(true);

  const qs = SAMPLE_QS[type] ?? SAMPLE_QS.behavioral;

  useEffect(() => {
    const t = setInterval(() => setSpeaking((s) => !s), 1000);
    return () => clearInterval(t);
  }, []);

  const nextQ = () => setIdx((i) => (i + 1) % qs.length);

  return (
    <section className="min-h-[80vh] flex flex-col items-center justify-center relative text-center px-4">
      <div className="flex flex-col items-center">
        <div
          className={`h-44 w-44 rounded-full mb-6 transition-all duration-700
            ${
              speaking
                ? "shadow-[0_0_0_14px_rgba(153,188,133,0.25)] scale-105"
                : "shadow-none scale-100"
            }`}
          style={{
            background:
              "linear-gradient(135deg, var(--color-primary), var(--color-muted))",
          }}
        />
        <h2 className="text-2xl font-semibold">AI Interviewer</h2>
        <p className="mt-1 capitalize text-[var(--color-ink-muted)]">
          {type} interview
        </p>
      </div>

      <div className="mt-10 max-w-2xl w-full bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow p-8 text-left">
        <p className="text-sm uppercase tracking-wide text-[var(--color-ink-muted)]">
          Question
        </p>
        <p className="mt-3 text-xl text-[var(--color-ink)] leading-relaxed">
          {qs[idx]}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={nextQ}
            className="rounded-2xl bg-[var(--color-primary)] text-white px-5 py-3 font-medium
                       hover:bg-[var(--color-primary-600)] active:bg-[var(--color-primary-700)] transition"
          >
            Next Question
          </button>
          <button
            className="rounded-2xl bg-[var(--color-muted)] text-[var(--color-ink)] px-5 py-3 font-medium"
          >
            Give Feedback on my last answer
          </button>
        </div>
      </div>

      <WebcamPeek />
    </section>
  );
}
