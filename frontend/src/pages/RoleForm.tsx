import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RoleForm() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  function next() {
    nav("/types", { state: { name, company, role, resumeName: resumeFile?.name || null } });
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6">
        Let’s get started with your interview prep
      </h2>

      <div className="card space-y-4">
        <div>
          <label className="block mb-1 text-sm">Name</label>
          <input className="input" placeholder="Your full name" value={name} onChange={e=>setName(e.target.value)} />
        </div>

        <div>
          <label className="block mb-1 text-sm">Company</label>
          <input className="input" placeholder="Target company" value={company} onChange={e=>setCompany(e.target.value)} />
        </div>

        <div>
          <label className="block mb-1 text-sm">Role</label>
          <input className="input" placeholder="Position you're applying for" value={role} onChange={e=>setRole(e.target.value)} />
        </div>

        <div>
          <label className="block mb-2 text-sm">Upload Résumé</label>
          <label className="btn w-full rounded-2xl cursor-pointer">
            <input type="file" accept=".pdf,.doc,.docx,.txt" className="hidden"
                   onChange={(e)=>setResumeFile(e.target.files?.[0] || null)} />
            <span className="flex w-full items-center justify-between">
              <span>{resumeFile ? resumeFile.name : "Choose File"}</span>
            </span>
          </label>
        </div>

        <div className="pt-2">
          <button className="btn w-full" onClick={next} disabled={!name || !company || !role}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
