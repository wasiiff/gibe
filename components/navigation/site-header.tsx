import Link from "next/link";

import { GibeMark } from "@/components/brand/gibe-mark";
import { AuthStatus } from "@/components/navigation/auth-status";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-[rgba(6,8,22,0.72)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3">
            <GibeMark className="size-11" />
            <div className="space-y-0.5">
              <p className="font-display text-lg uppercase tracking-[0.24em] text-white">
                Gibe
              </p>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                Prompt to playable
              </p>
            </div>
          </Link>
          <nav className="hidden items-center gap-5 text-sm text-slate-300 md:flex">
            <Link className="transition hover:text-white" href="/dashboard">
              Dashboard
            </Link>
            <Link className="transition hover:text-white" href="/studio/new">
              Studio
            </Link>
          </nav>
        </div>
        <AuthStatus />
      </div>
    </header>
  );
}

