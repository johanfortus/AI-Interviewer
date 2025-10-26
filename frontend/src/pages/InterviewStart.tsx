import { useState } from "react";
import { useNavigate } from "react-router-dom";


type InterviewType = "tech" | "hr" | "em";

const TYPE_MAP: Record<InterviewType, "technical" | "behavioral" | "manager"> = {
  tech: "technical",
  hr: "behavioral",
  em: "manager",
};

const TYPES = [
  {
    key: "tech" as InterviewType,
    title: "Technical",
    desc: "Coding challenges and problem-solving questions",
    icon: "⟨⟩",
  },
  {
    key: "hr" as InterviewType,
    title: "Behavioral / HR",
    desc: "Situational questions about teamwork and experiences",
    icon: "👥",
  },
  {
    key: "em" as InterviewType,
    title: "Engineering Manager",
    desc: "Leadership, strategy, and team-management scenarios",
    icon: "🧳",
  },
];

export default function RoleForm() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [type, setType] = useState<InterviewType | null>("hr");
  const [showTypeSelection, setShowTypeSelection] = useState(false);

  const formReady = Boolean(name && company && role && resume);
  const ready = Boolean(formReady && type);

  function handleContinue() {
    setShowTypeSelection(true);
    setTimeout(() => {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    }, 10);
  }

  function handleStart() {
  if (!ready || !type) return;

  const commonState = {
    name,
    company,
    role,
    resumeName: resume?.name ?? null,
  };

  if (type === "tech") {
    nav("/interview/tech", { state: commonState }); 
  } else {
    nav("/interview", {
      state: { ...commonState, type: TYPE_MAP[type] },
    });
  }
}


  return (
    <div className={`bg-[var(--color-surface)] text-[var(--color-ink)] ${showTypeSelection ? '' : 'overflow-hidden h-screen'}`}>
      <main className="mx-auto max-w-5xl px-4 py-10 space-y-10">
        <section className="bg-[var(--color-card)] border border-[var(--color-border)] shadow-sm rounded-3xl p-6 md:p-8 transition-all duration-500">
          <h1 className="text-center text-xl md:text-2xl font-semibold mb-6">
            Let's get started with your interview prep
          </h1>

          <div className="grid gap-4">
            <LabeledInput
              label="Name"
              placeholder="Your full name"
              value={name}
              onChange={setName}
            />
            <LabeledInput
              label="Company"
              placeholder="Target company"
              value={company}
              onChange={setCompany}
            />
            <LabeledInput
              label="Role"
              placeholder="Position you're applying for"
              value={role}
              onChange={setRole}
            />

            <div className="space-y-2">
              <div className="text-sm font-medium">Upload Resume</div>
              <label
                className="inline-flex items-center gap-3 bg-[var(--color-primary)] text-white font-medium rounded-2xl px-5 py-3
                           shadow hover:bg-[var(--color-primary-600)] active:bg-[var(--color-primary-700)]
                           cursor-pointer focus:outline-none focus:ring-2 ring-[var(--color-primary)] ring-offset-0"
              >
                <span>Choose File</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => setResume(e.target.files?.[0] ?? null)}
                />
              </label>
              {resume && (
                <div className="text-sm text-[var(--color-ink-muted)]">
                  {resume.name}
                </div>
              )}
            </div>
          </div>

          <div className={`flex justify-center mt-6 transition-all duration-500 overflow-hidden ${
            formReady 
              ? 'opacity-100 max-h-20 translate-y-0' 
              : 'opacity-0 max-h-0 translate-y-4'
          }`}>
            <button
              disabled={!formReady}
              onClick={handleContinue}
              className={`rounded-2xl px-6 py-3 font-medium shadow focus:outline-none focus:ring-2 ring-[var(--color-primary)]
                ${
                  formReady
                    ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-600)] active:bg-[var(--color-primary-700)] cursor-pointer"
                    : "bg-[var(--color-muted)]/60 text-[var(--color-ink-muted)] cursor-not-allowed"
                }`}
            >
              Continue
            </button>
          </div>
        </section>

        <section 
          className={`transition-opacity duration-300 ${showTypeSelection ? 'opacity-100 flex flex-col justify-center' : 'opacity-0 h-0 overflow-hidden'}`}
          style={showTypeSelection ? { minHeight: '100vh' } : {}}
        >
          <div className="space-y-5">
            <h2 className="text-center text-lg md:text-xl font-semibold">
              Choose Interview Type
            </h2>

            <div className="grid gap-5 md:grid-cols-3">
              {TYPES.map((t) => (
                <TypeCard
                  key={t.key}
                  data={t}
                  selected={type === t.key}
                  onClick={() => setType(t.key)}
                />
              ))}
            </div>

            <div className="flex justify-center pt-2">
              <button
                disabled={!ready}
                onClick={handleStart}
                className={`rounded-2xl px-6 py-3 font-medium shadow focus:outline-none focus:ring-2 ring-[var(--color-primary)]
                  ${
                    ready
                      ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-600)] active:bg-[var(--color-primary-700)] cursor-pointer"
                      : "bg-[var(--color-muted)]/60 text-[var(--color-ink-muted)] cursor-not-allowed"
                  }`}
              >
                Start Interview
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

type LabeledInputProps = {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
};

function LabeledInput({
  label,
  placeholder,
  value,
  onChange,
}: LabeledInputProps) {
  return (
    <label className="grid gap-2">
      <div className="text-sm font-medium">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-[var(--color-border)] bg-white/70 text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)]
                   focus:outline-none focus:ring-2 ring-[var(--color-primary)] px-4 py-3"
      />
    </label>
  );
}

type TypeCardProps = {
  data: { key: InterviewType; title: string; desc: string; icon: string };
  selected: boolean;
  onClick: () => void;
};

function TypeCard({ data, selected, onClick }: TypeCardProps) {
  return (
    <button
      onClick={onClick}
      className={`text-left bg-[var(--color-card)] text-[var(--color-ink)] rounded-2xl p-6 border shadow-sm transition cursor-pointer
                  hover:border-[var(--color-primary)] hover:shadow-md
                  ${
                    selected
                      ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/30"
                      : "border-[var(--color-border)]"
                  }`}
    >
      <div className="text-2xl mb-3 text-[var(--color-primary)]">{data.icon}</div>
      <div className="font-semibold">{data.title}</div>
      <div className="text-sm text-[var(--color-ink-muted)] mt-1">
        {data.desc}
      </div>
    </button>
  );
}