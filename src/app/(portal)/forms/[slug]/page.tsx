import { notFound } from "next/navigation";
import { ComingSoon } from "@/components/coming-soon";
import { DemoForm } from "@/components/demo-form";
import { AnnualLeaveForm } from "@/components/annual-leave-form";
import { PageHeader } from "@/components/page-header";
import { getDemoForm } from "@/lib/demo-forms";
import { MODULES, findModuleByHref } from "@/lib/modules";
import { moduleIcon, CATEGORY_META } from "@/lib/icons";
import { hasDocument } from "@/lib/documents/engine";

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
      ? `${mod.title} · MW Staff Hub`
      : "MW Staff Hub",
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
        <PageHeader
          eyebrow={`${mod.category} · Demo`}
          title={mod.title}
          description={mod.description}
          icon={moduleIcon(mod.id)}
          iconAccent={CATEGORY_META[mod.category].accent}
        />
        {mod.id === "annual-leave" ? (
          <AnnualLeaveForm />
        ) : (
          <DemoForm
            config={config}
            documentSlug={hasDocument(mod.id) ? mod.id : undefined}
          />
        )}
      </div>
    );
  }

  return <ComingSoon module={mod} />;
}
