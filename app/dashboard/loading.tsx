import { LoaderCircle } from "lucide-react";

import { Panel } from "@/components/ui/panel";

export default function DashboardLoading() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-12 lg:px-8 lg:py-14">
      <Panel className="flex min-h-[300px] items-center justify-center p-12">
        <div className="flex flex-col items-center gap-4">
          <LoaderCircle className="size-8 animate-spin text-cyan-200" />
          <p className="text-sm uppercase tracking-[0.18em] text-slate-400">
            Loading dashboard...
          </p>
        </div>
      </Panel>
    </div>
  );
}
