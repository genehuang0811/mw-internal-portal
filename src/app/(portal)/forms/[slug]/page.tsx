import Link from "next/link";
import { notFound } from "next/navigation";
import { ComingSoon } from "@/components/coming-soon";
import { DemoForm } from "@/components/demo-form";
import { getDemoForm } from "@/lib/demo-forms";
import { MODULES, findModuleByHref } from "@/lib/modules";

type Params = { slug: string };

export function generateStaticParams(): Array<Params> {
  return MODULES.filter(
    (m) => m.href.startsWith("/forms/") && m.id !== "refund",
  ).map((m) => ({ slug: m.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const mod = findModuleByHref(`/forms/${slug}`);
  return {
    title: mod
      ? `${mod.title} · MW Internal Forms Portal`
      : "MW Internal Forms Portal",
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const mod = findModuleByHref(`/forms/${slug}`);
  if (!mod) notFound();

  if (mod.status === "demo") {
    const config = getDemoForm(mod.id);
    if (!config) notFound();
    return (
      <div>
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              Form · Demo
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              {mod.title}
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {mod.description}
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex h-9 shrink-0 items-center justify-center rounded-md border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Back to dashboard
          </Link>
        </div>
        <DemoForm config={config} />
      </div>
    );
  }

  return <ComingSoon module={mod} />;
}
