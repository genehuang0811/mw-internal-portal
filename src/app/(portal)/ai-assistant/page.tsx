import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { DemoNotice } from "@/components/demo-notice";
import { findModuleById } from "@/lib/modules";
import { moduleIcon, CATEGORY_META } from "@/lib/icons";

const MODULE = findModuleById("ai-assistant")!;

const EXAMPLE_QUESTIONS: { q: string; href: string }[] = [
  { q: "How do I process a refund?", href: "/forms/refund" },
  {
    q: "What disclaimer do I use for BLIS / sensor relocation?",
    href: "/forms/vehicle-inspection",
  },
  {
    q: "Where is the vehicle drop-off inspection form?",
    href: "/forms/vehicle-inspection",
  },
  {
    q: "What is the current process for annual leave?",
    href: "/forms/annual-leave",
  },
  { q: "Show me the correct Trello card example.", href: "/templates" },
];

const CAPABILITIES = [
  {
    title: "Answer process questions",
    body: "Refunds, claims, drop-offs, leave — the assistant will know the current procedure.",
  },
  {
    title: "Find the right form or template",
    body: "Ask where something lives and get a direct link into the portal.",
  },
  {
    title: "Look up vehicle & pricing info",
    body: "Connected to the Knowledge Base for dimensions, fitment, and pricing.",
  },
];

export const metadata = {
  title: `${MODULE.title} · MW Staff Hub`,
};

export default function AiAssistantPage() {
  return (
    <div>
      <PageHeader
        eyebrow="AI Assistant · Demo"
        title={MODULE.title}
        description="The future brain of the portal — one place to ask anything about MW processes, forms, and resources."
        icon={moduleIcon("ai-assistant")}
        iconAccent={CATEGORY_META["AI Assistant"].accent}
      />

      <DemoNotice className="mb-6">AI not connected yet.</DemoNotice>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {CAPABILITIES.map((c) => (
          <div
            key={c.title}
            className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <h3 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              {c.title}
            </h3>
            <p className="mt-1 text-xs leading-5 text-zinc-600 dark:text-zinc-400">
              {c.body}
            </p>
          </div>
        ))}
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
              {EXAMPLE_QUESTIONS.map((item) => (
                <li key={item.q}>
                  <Link
                    href={item.href}
                    className="group flex w-full items-center justify-between gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-left text-sm text-zinc-700 shadow-sm transition-colors hover:border-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <span>{item.q}</span>
                    <ArrowRight
                      className="h-4 w-4 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
              AI coming soon. These shortcuts help you find the correct page
              today.
            </p>
          </div>
        </div>

        <div className="border-t border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <label htmlFor="ai-input" className="sr-only">
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
