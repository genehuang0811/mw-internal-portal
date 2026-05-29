"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Megaphone,
  Calendar,
  Files,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const NAV_LINKS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/knowledge/vehicle-dimensions", label: "Knowledge", icon: BookOpen },
  { href: "/updates", label: "Updates", icon: Megaphone },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/templates", label: "Templates", icon: Files },
  { href: "/ai-assistant", label: "AI", icon: Sparkles },
];

export function PortalNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  async function onLogout() {
    setBusy(true);
    setOpen(false);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace("/login");
      router.refresh();
    }
  }

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden items-center gap-1 lg:flex">
        {NAV_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={
                isActive(link.href)
                  ? "inline-flex items-center gap-1.5 rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {link.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={onLogout}
          disabled={busy}
          className="ml-2 inline-flex h-8 items-center justify-center rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          {busy ? "Signing out…" : "Sign out"}
        </button>
      </nav>

      {/* Mobile / tablet nav */}
      <div className="relative lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-300 bg-white text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {open ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>

        {open && (
          <>
            {/* Click-away overlay */}
            <button
              type="button"
              aria-hidden="true"
              tabIndex={-1}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-10 cursor-default"
            />
            <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-md border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
              {NAV_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={
                      isActive(link.href)
                        ? "flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-50"
                        : "flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    }
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {link.label}
                  </Link>
                );
              })}
              <div className="my-1 border-t border-zinc-200 dark:border-zinc-800" />
              <button
                type="button"
                onClick={onLogout}
                disabled={busy}
                className="block w-full px-4 py-2 text-left text-sm text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-60 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                {busy ? "Signing out…" : "Sign out"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
