import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl items-center px-6 py-12">
      <Panel className="w-full p-8 text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">Not found</p>
        <h1 className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-white">
          This route is out of bounds
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          The game link or editor session could not be found. Return to the dashboard
          or start a fresh build.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild variant="primary">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/">Home</Link>
          </Button>
        </div>
      </Panel>
    </div>
  );
}

