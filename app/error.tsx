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
    <div className="mx-auto flex min-h-[60vh] w-full max-w-md items-center px-6 py-12">
      <Panel className="w-full p-8 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-red-200 bg-red-50">
          <AlertTriangle className="size-7 text-red-500" />
        </div>
        <p className="text-xs uppercase tracking-[0.22em] text-red-600">
          Error
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold uppercase tracking-[0.06em] text-gray-900">
          Something went wrong
        </h1>
        <p className="mt-3 text-sm leading-7 text-gray-500">
          {error.message ?? "An unexpected error occurred."}
        </p>
        {error.digest && (
          <p className="mt-2 text-xs text-gray-400">Error ID: {error.digest}</p>
        )}
        <div className="mt-6 flex justify-center gap-3">
          <Button
            variant="secondary"
            leading={<RefreshCw className="size-4" />}
            onClick={reset}
          >
            Try again
          </Button>
          <Button
            asChild
            variant="primary"
            leading={<Home className="size-4" />}
          >
            <Link href="/">Home</Link>
          </Button>
        </div>
      </Panel>
    </div>
  );
}
