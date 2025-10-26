import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="min-h-[72vh] grid place-items-center px-6">
      <div className="max-w-5xl w-full text-center">
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05]">
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(135deg, var(--color-ink) 0%, var(--color-primary) 85%)",
            }}
          >
            PrepTalk
          </span>
        </h1>

        <p className="mx-auto mt-4 text-base md:text-lg text-[var(--color-ink-muted)] max-w-2xl">
          Practice with an AI interview partner that creates résumé specific questions, real-time feedback, and a webcam review
          all tuned to your target role!
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            to="/start"
            className="inline-flex min-w-[220px] items-center justify-center rounded-2xl
                       bg-[var(--color-primary)] px-6 py-3 text-white font-medium shadow
                       hover:bg-[var(--color-primary-600)] active:bg-[var(--color-primary-700)]
                       focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 transition"
          >
            Get Started
          </Link>

          
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-full bg-[var(--color-card)] border border-[var(--color-border)] px-3 py-1 text-sm">
            Résumé-aware questions
          </span>
          <span className="rounded-full bg-[var(--color-card)] border border-[var(--color-border)] px-3 py-1 text-sm">
            Real-time feedback
          </span>
          <span className="rounded-full bg-[var(--color-card)] border border-[var(--color-border)] px-3 py-1 text-sm">
            Webcam preview
          </span>
        </div>
      </div>
    </section>
  );
}
