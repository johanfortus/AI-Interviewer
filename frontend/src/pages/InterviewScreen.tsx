// import { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import WebcamPeek from "../components/WebcamPeek";

// const SAMPLE_QS: Record<string, string[]> = {
//   technical: [
//     "Walk me through a system you built end-to-end. What tradeoffs did you make?",
//     "How would you design a rate limiter for an API used by millions?",
//   ],
//   behavioral: [
//     "Tell me about a time you faced a difficult teammate. What did you do?",
//     "Describe a time you influenced a decision without authority.",
//   ],
//   manager: [
//     "How do you balance roadmap priorities with urgent interrupts?",
//     "Tell me about a tough performance conversation and the outcome.",
//   ],
// };

// export default function InterviewScreen() {
//   const { state } = useLocation() as any;
//   const type: "technical" | "behavioral" | "manager" = state?.type || "behavioral";
//   const [idx, setIdx] = useState(0);
//   const [speaking, setSpeaking] = useState(true);

//   const qs = SAMPLE_QS[type];

//   useEffect(() => {
//     const t = setInterval(()=>setSpeaking(s=>!s), 1000); // pulse the AI circle
//     return () => clearInterval(t);
//   }, []);

//   function nextQ() { setIdx(i => (i + 1) % qs.length); }

//   return (
//     <div className="max-w-3xl mx-auto relative">
//       {/* AI circle */}
//       <div className="flex flex-col items-center">
//         <div
//           className={`rounded-full h-44 w-44 mb-6 transition-all
//             ${speaking ? "shadow-[0_0_0_12px_rgba(153,188,133,0.25)]" : "shadow-none"}`}
//           style={{ background: "linear-gradient(135deg, #99BC85, #E4EFE7)" }}
//         />
//         <h2 className="text-2xl font-semibold">AI Interviewer</h2>
//         <p className="text-[var(--muted)] mt-1 capitalize">{type} interview</p>
//       </div>

//       {/* Question card */}
//       <div className="card mt-8">
//         <div className="text-sm uppercase tracking-wide text-[var(--muted)]">Question</div>
//         <p className="text-xl mt-2">{qs[idx]}</p>

//         <div className="mt-6 flex gap-3">
//           <button className="btn" onClick={nextQ}>Next Question</button>
//           <button className="btn" style={{ background:"#E4EFE7", color:"var(--text)" }}>
//             Give Feedback on my last answer
//           </button>
//         </div>
//       </div>

//       <WebcamPeek />
//     </div>
//   );
// }
