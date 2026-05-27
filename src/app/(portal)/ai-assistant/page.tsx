import Link from "next/link";
import { findModuleByHref } from "@/lib/modules";

const AI_ASSISTANT = findModuleByHref("/ai-assistant")!;

const EXAMPLE_QUESTIONS = [
  "How do I process a refund?",
  "What forms do I use for insurance claims?",
  "What is the vehicle drop-off process?",
  "How do I submit a stock request?",
];

export const metadata = {
  title: `${AI_ASSISTANT.title} · MW Internal Forms Portal`,
};

export default function AiAssistantPage() {
  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            Tool · Demo
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {AI_ASSISTANT.title}
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {AI_ASSISTANT.description}
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex h-9 shrink-0 items-center justify-center rounded-md border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Back to dashboard
        </Link>
      </div>

      <div
        role="note"
        className="mb-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200"
      >
        AI assistant not connected yet.
      </div>

      <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <h2 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Chat
          </h2>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            A preview of the staff assistant interface.
          </p>
        </div>

        <div className="space-y-4 px-6 py-6">
          <Bubble role="assistant">
            Hi! I&apos;m the MW staff assistant. Ask me anything about internal
            forms, processes, or where to find things. Try one of the example
            questions below.
          </Bubble>

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              Example questions
            </p>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {EXAMPLE_QUESTIONS.map((q) => (
                <li key={q}>
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    title="Demo only — AI assistant not connected yet."
                    className="block w-full cursor-not-allowed rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-left text-sm text-zinc-700 opacity-80 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
                  >
                    {q}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <label
            htmlFor="ai-input"
            className="sr-only"
          >
            Ask the assistant
          </label>
          <div className="flex items-center gap-2">
            <input
              id="ai-input"
              type="text"
              disabled
              placeholder="Ask a question… (demo only)"
              className="block w-full cursor-not-allowed rounded-md border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-500 outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-500"
            />
            <button
              type="button"
              disabled
              aria-disabled="true"
              title="Demo only — AI assistant not connected yet."
              className="inline-flex h-10 cursor-not-allowed items-center justify-center rounded-md bg-zinc-900 px-5 text-sm font-medium text-white opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
            >
              Send
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function Bubble({
  role,
  children,
}: {
  role: "assistant" | "user";
  children: React.ReactNode;
}) {
  const isAssistant = role === "assistant";
  return (
    <div className={isAssistant ? "flex justify-start" : "flex justify-end"}>
      <div
        className={
          isAssistant
            ? "max-w-prose rounded-2xl rounded-tl-sm bg-zinc-100 px-4 py-3 text-sm text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
            : "max-w-prose rounded-2xl rounded-tr-sm bg-zinc-900 px-4 py-3 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900"
        }
      >
        {children}
      </div>
    </div>
  );
}
