"use client";

import Link from "next/link";
import { LogOut, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function AuthStatus() {
  const router = useRouter();
  const session = authClient.useSession();
  const [error, setError] = useState<string | null>(null);
  const [isSigningOut, startSigningOut] = useTransition();

  if (session.isPending) {
    return (
      <div className="h-11 w-40 animate-pulse rounded-full border border-white/10 bg-white/6" />
    );
  }

  if (!session.data) {
    return (
      <div className="flex items-center gap-3">
        <Button asChild variant="secondary" className="hidden md:inline-flex">
          <Link href="/dashboard">Explore Studio</Link>
        </Button>
        <Button asChild variant="primary" leading={<Sparkles className="size-4" />}>
          <Link href="/sign-in">Launch</Link>
        </Button>
      </div>
    );
  }

  return (
      <div className="flex items-center gap-3">
        <Button asChild variant="secondary" className="hidden md:inline-flex">
          <Link href="/dashboard">{session.data.user.name.split(" ")[0]}&apos;s Deck</Link>
        </Button>
        <Button
        variant="ghost"
        leading={<LogOut className="size-4" />}
        disabled={isSigningOut}
        onClick={() => {
          setError(null);
          startSigningOut(async () => {
            try {
              await authClient.signOut();
              router.refresh();
              router.push("/");
            } catch (nextError) {
              setError(nextError instanceof Error ? nextError.message : "Sign out failed.");
            }
          });
        }}
      >
        Exit
      </Button>
      {error ? <span className="text-xs text-rose-300">{error}</span> : null}
    </div>
  );
}
