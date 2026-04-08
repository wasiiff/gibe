"use client";

import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl items-center px-6 py-12">
      <Panel className="w-full p-8 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-rose-300/20 bg-rose-500/10">
          <AlertTriangle className="size-8 text-rose-300" />
        </div>
        <p className="text-xs uppercase tracking-[0.22em] text-rose-200">Error</p>
        <h1 className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-white">
          Something went wrong
        </h1>
        <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">
          {error.message ?? "An unexpected error occurred while processing your request."}
        </p>
        {error.digest && (
          <p className="mt-2 text-xs text-slate-500">Error ID: {error.digest}</p>
        )}
        <div className="mt-8 flex justify-center gap-3">
          <Button
            variant="secondary"
            leading={<RefreshCw className="size-4" />}
            onClick={reset}
          >
            Try again
          </Button>
          <Button asChild variant="primary" leading={<Home className="size-4" />}>
            <Link href="/">Home</Link>
          </Button>
        </div>
      </Panel>
    </div>
  );
}
