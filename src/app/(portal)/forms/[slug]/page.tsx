import { notFound } from "next/navigation";
import { ComingSoon } from "@/components/coming-soon";
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
  return <ComingSoon module={mod} />;
}
