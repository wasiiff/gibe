import { Loader2 } from "lucide-react";

import { Panel } from "@/components/ui/panel";

export default function StudioLoading() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-6 lg:px-8 lg:py-8">
      <Panel className="flex min-h-[300px] items-center justify-center p-12">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-6 animate-spin text-gray-400" />
          <p className="text-xs uppercase tracking-[0.18em] text-gray-400">
            Loading studio...
          </p>
        </div>
      </Panel>
    </div>
  );
}
