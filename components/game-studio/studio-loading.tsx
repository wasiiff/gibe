"use client";

import { LoaderCircle } from "lucide-react";

import { Panel } from "@/components/ui/panel";

export function StudioLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-8 lg:py-12">
      <Panel className="flex min-h-[400px] items-center justify-center p-12">
        <div className="flex flex-col items-center gap-4">
          <LoaderCircle className="size-8 animate-spin text-cyan-200" />
          <p className="text-sm uppercase tracking-[0.18em] text-slate-400">
            Loading studio...
          </p>
        </div>
      </Panel>
    </div>
  );
}
