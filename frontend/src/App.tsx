import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RoleForm from "./pages/RoleForm";
// import InterviewType from "./pages/InterviewType";
// import InterviewScreen from "./pages/InterviewScreen";
import NavBar from "./components/NavBar";
import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <main className="max-w-6xl mx-auto p-6 md:p-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/role" element={<RoleForm />} />
          {/* <Route path="/types" element={<InterviewType />} />
          <Route path="/interview" element={<InterviewScreen />} /> */}
        </Routes>
      </main>
    </BrowserRouter>
  );
}
