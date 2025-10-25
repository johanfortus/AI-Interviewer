// import { useLocation, useNavigate } from "react-router-dom";
// import { useState } from "react";
// import clsx from "clsx";

// type TType = "technical" | "behavioral" | "manager";
// const CARDS = [
//   { key: "technical" as TType, title: "Technical", desc: "Coding challenges and problem-solving", icon: "👨🏻‍💻" },
//   { key: "behavioral" as TType, title: "Behavioral/HR", desc: "Situational teamwork & experiences", icon: "👥" },
//   { key: "manager" as TType, title: "Engineering Manager", desc: "Leadership, strategy & people", icon: "🧭" },
// ];

// export default function InterviewType() {
//   const nav = useNavigate();
//   const { state } = useLocation();
//   const [selected, setSelected] = useState<TType>("behavioral");

//   function start() {
//     nav("/interview", { state: { ...state, type: selected } });
//   }

//   return (
//     <div className="max-w-5xl mx-auto">
//       <h2 className="text-center text-2xl font-semibold mb-6">Choose Interview Type</h2>
//       <div className="grid md:grid-cols-3 gap-5">
//         {CARDS.map(c => (
//           <button key={c.key} onClick={()=>setSelected(c.key)}
//                   className={clsx("choice text-left", selected===c.key && "choice-active")}>
//             <div className="text-3xl mb-3">{c.icon}</div>
//             <div className="text-lg font-semibold mb-1">{c.title}</div>
//             <div className="text-[var(--muted)]">{c.desc}</div>
//           </button>
//         ))}
//       </div>

//       <div className="flex justify-center mt-8">
//         <button className="btn min-w-[220px]" onClick={start}>Start Interview</button>
//       </div>
//     </div>
//   );
// }
