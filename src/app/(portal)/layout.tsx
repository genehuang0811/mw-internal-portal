import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { PortalNav } from "@/components/portal-nav";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthenticated())) redirect("/login");

  return (
    <div className="min-h-screen bg-zinc-50 pb-16 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <Link href="/dashboard" className="block">
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              MW Manufacturing
            </p>
            <p className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Staff Hub
            </p>
          </Link>
          <PortalNav />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 pt-8">{children}</main>
    </div>
  );
}
