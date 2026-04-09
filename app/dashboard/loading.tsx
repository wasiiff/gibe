import { Loader2 } from "lucide-react";

import { Panel } from "@/components/ui/panel";

export default function DashboardLoading() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 lg:px-8 lg:py-12">
      <Panel className="flex min-h-[200px] items-center justify-center p-12">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-6 animate-spin text-gray-400" />
          <p className="text-xs uppercase tracking-[0.18em] text-gray-400">
            Loading...
          </p>
        </div>
      </Panel>
    </div>
  );
}
