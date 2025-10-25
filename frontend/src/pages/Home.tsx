import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="grid md:grid-cols-2 gap-8 items-center">
      <div>
        <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
          Practice smarter. <span className="text-[var(--accent)]">Interview better.</span>
        </h1>
        <p className="mt-4 text-[var(--muted)]">
          Tailored questions from your résumé and target role, real-time feedback,
          and a webcam attention preview.
        </p>
        <div className="mt-8 flex gap-3">
          <Link to="/role" className="btn">Get Started</Link>
          <Link to="/types" className="btn" style={{ background: "#E4EFE7", color: "var(--text)" }}>
            See Interview Types
          </Link>
        </div>
      </div>

      <div className="card">
        <div className="h-48 rounded-2xl bg-mist" />
        <p className="mt-4 text-sm text-[var(--muted)]">
          Placeholder hero area — you can drop a screenshot here later.
        </p>
      </div>
    </section>
  );
}
