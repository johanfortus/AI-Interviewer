import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import InterviewStart from "./pages/InterviewStart";
import InterviewPrep from "./pages/InterviewPrep";
import Interview from "./pages/Interview";
import NavBar from "./components/NavBar";
import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <main className="max-w-6xl mx-auto p-6 md:p-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/start" element={<InterviewStart />} />
          <Route path="/prep" element={<InterviewPrep />} />
          <Route path="/interview" element={<Interview />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
