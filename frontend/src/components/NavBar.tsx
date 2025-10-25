import { Link, NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <header className="sticky top-0 z-40 bg-[var(--page-bg)]/80 backdrop-blur">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="font-semibold text-lg">AI Interviewer</Link>
        <nav className="flex gap-6">
          <NavLink to="/role" className="hover:underline">Get Started</NavLink>
          <NavLink to="/types" className="hover:underline">Interview Types</NavLink>
        </nav>
      </div>
    </header>
  );
}
