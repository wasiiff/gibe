import Link from "next/link";

import { GibeMark } from "@/components/brand/gibe-mark";
import { AuthStatus } from "@/components/navigation/auth-status";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <GibeMark className="size-6" />
            <span className="font-display text-sm font-bold uppercase tracking-[0.18em] text-gray-900">
              Gibe
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-gray-500 md:flex">
            <Link href="/games" className="hover:text-gray-900">
              Games
            </Link>
            <Link href="/dashboard" className="hover:text-gray-900">
              Dashboard
            </Link>
            <Link href="/studio/new" className="hover:text-gray-900">
              Studio
            </Link>
          </nav>
        </div>
        <AuthStatus />
      </div>
    </header>
  );
}
