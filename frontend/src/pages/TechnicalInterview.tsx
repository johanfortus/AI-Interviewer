import { useMemo, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import type { OnMount } from "@monaco-editor/react";

type Lang = "javascript" | "typescript" | "python";

const STARTER_PROMPT = {
  title: "Two Sum (simple variant)",
  body: `Given an array of integers and a target, return indices of the two numbers such that they add up to the target.
Return [-1, -1] if no solution exists.

Example:
  input: nums = [2,7,11,15], target = 9
  output: [0,1]`,
};

const JS_TEMPLATE = `// Implement twoSum(nums, target)
// Return [i, j] (0-based indices) or [-1, -1] if not found.

function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [-1, -1];
}

// You can console.log locally to debug:
console.log(twoSum([2,7,11,15], 9)); // -> [0,1]
`;

const TS_TEMPLATE = `// TypeScript version (running requires backend or bundling a TS transpiler)
export function twoSum(nums: number[], target: number): [number, number] {
  const seen = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need)!, i];
    seen.set(nums[i], i);
  }
  return [-1, -1];
}
`;

const PY_TEMPLATE = `# Python version (running requires backend)
def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        need = target - n
        if need in seen:
            return [seen[need], i]
        seen[n] = i
    return [-1, -1]

# print(two_sum([2,7,11,15], 9))  # -> [0,1]
`;

export default function TechnicalInterview() {
  const [lang, setLang] = useState<Lang>("javascript");
  const [code, setCode] = useState<string>(JS_TEMPLATE);
  const [output, setOutput] = useState<string>("");
  const [status, setStatus] = useState<"idle"|"running"|"done">("idle");

  const editorRef = useRef<any>(null);
  const onMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const changeLang = (l: Lang) => {
    setLang(l);
    if (l === "javascript") setCode(JS_TEMPLATE);
    else if (l === "typescript") setCode(TS_TEMPLATE);
    else setCode(PY_TEMPLATE);
    setOutput("");
  };

  const runJs = async () => {
    setStatus("running");
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args: any[]) => {
      logs.push(args.map(String).join(" "));
      originalLog(...args);
    };

    let result = "";
    try {
      const wrapped = new Function(
        `"use strict";
         ${code}
         return (typeof twoSum === "function") ? twoSum : undefined;`
      );

      const fn = wrapped();
      if (typeof fn !== "function") {
        result = "❌ Could not find a function named twoSum";
      } else {
        const tests: Array<{nums:number[]; target:number; want:[number,number]}> = [
          { nums: [2,7,11,15], target: 9, want: [0,1] },
          { nums: [3,2,4], target: 6, want: [1,2] },
          { nums: [3,3], target: 6, want: [0,1] },
          { nums: [1,2,3], target: 7, want: [-1,-1] },
        ];
        let pass = 0;
        for (const t of tests) {
          const got = fn([...t.nums], t.target);
          const ok = Array.isArray(got) && got[0] === t.want[0] && got[1] === t.want[1];
          if (ok) pass++;
          logs.push(`test nums=${JSON.stringify(t.nums)}, target=${t.target} => got ${JSON.stringify(got)} ${ok ? "✓" : `≠ want ${JSON.stringify(t.want)}`}`);
        }
        result = pass === tests.length ? "✅ All tests passed" : `⚠️ ${pass}/${tests.length} tests passed`;
      }
    } catch (err: any) {
      result = `💥 Runtime error: ${err?.message || String(err)}`;
    } finally {
      console.log = originalLog;
    }

    setOutput([result, "", ...logs].join("\n"));
    setStatus("done");
  };

  const submitToBackend = async () => {
    setStatus("running");
    try {
      await fetch("/api/submit_code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: lang, code }),
      });
      setOutput("Submitted to judge (stub). Wire this to your FastAPI.\nEndpoint: POST /api/submit_code");
    } catch (e: any) {
      setOutput(`Submit failed: ${e?.message || String(e)}`);
    } finally {
      setStatus("done");
    }
  };

  const canRunInBrowser = useMemo(() => lang === "javascript", [lang]);

  return (
    <section className="min-h-[80vh]">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">Technical Interview</h1>
          <p className="text-sm text-[var(--color-ink-muted)]">Solve coding problems in the editor. Run JS locally or submit to backend.</p>
        </div>

        <div className="flex gap-3">
          <select
            value={lang}
            onChange={(e) => changeLang(e.target.value as Lang)}
            className="rounded-xl border border-[var(--color-border)] bg-white/90 px-3 py-2 focus:outline-none"
          >
            <option value="javascript">JavaScript (Runnable)</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
          </select>

          <button
            onClick={canRunInBrowser ? runJs : submitToBackend}
            className="rounded-2xl px-4 py-2 font-medium bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-600)]"
            disabled={status === "running"}
            title={canRunInBrowser ? "Run locally" : "Send to backend judge"}
          >
            {canRunInBrowser ? (status === "running" ? "Running…" : "Run") : (status === "running" ? "Submitting…" : "Submit")}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-6">
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--color-border)]">
            <div className="text-sm uppercase tracking-wide text-[var(--color-ink-muted)]">Problem</div>
            <h2 className="font-semibold">{STARTER_PROMPT.title}</h2>
            <p className="mt-1 text-sm">{STARTER_PROMPT.body}</p>
          </div>

          <Editor
            onMount={onMount}
            height="60vh"
            language={lang}
            value={code}
            onChange={(v) => setCode(v ?? "")}
            theme="vs"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              roundedSelection: true,
              scrollBeyondLastLine: false,
              padding: { top: 12, bottom: 12 },
              tabSize: 2,
              automaticLayout: true,
            }}
          />
        </div>

        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-4">
          <div className="text-sm uppercase tracking-wide text-[var(--color-ink-muted)] mb-2">Output</div>
          <pre className="h-[60vh] overflow-auto rounded-xl bg-white/80 p-3 text-sm whitespace-pre-wrap">
{output || "Run your code to see logs and test results here."}
          </pre>

          {lang !== "javascript" && (
            <p className="mt-2 text-xs text-[var(--color-ink-muted)]">
              Running {lang} in the browser is disabled. Click <b>Submit</b> to send to the backend judge (wire to FastAPI).
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
