import { Link, NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <header className="sticky top-0 z-40 bg-[var(--color-bg)]/80 backdrop-blur">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="font-semibold text-lg tracking-tight">
          PrepTalk
        </Link>
        <nav className="flex gap-6 text-sm font-medium">
          <NavLink to="/start" className="hover:underline">
            Interview Start
          </NavLink>
          <NavLink to="/prep" className="hover:underline">
            Interview Prep
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
