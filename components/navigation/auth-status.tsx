"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, LogOut, Sparkles } from "lucide-react";
import { useState, useTransition } from "react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function AuthStatus() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const session = authClient.useSession();

  function handleSignOut() {
    startTransition(async () => {
      await authClient.signOut();
      router.refresh();
    });
  }

  if (session.data) {
    return (
      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-gray-500 sm:inline">
          {session.data.user.name}
        </span>
        <Button
          variant="ghost"
          size="sm"
          leading={<LogOut className="size-4" />}
          onClick={handleSignOut}
          disabled={isPending}
        >
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Button asChild variant="ghost" size="sm">
        <Link href="/sign-in">
          <LogIn className="size-4" />
          Sign In
        </Link>
      </Button>
      <Button
        asChild
        variant="primary"
        size="sm"
        leading={<Sparkles className="size-3.5" />}
      >
        <Link href="/studio/new">Launch</Link>
      </Button>
    </div>
  );
}
