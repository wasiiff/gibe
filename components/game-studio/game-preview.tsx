"use client";

import dynamic from "next/dynamic";
import { Maximize2, RefreshCw } from "lucide-react";
import { useEffect, useEffectEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import type { RuntimeMessage } from "@/lib/types";
import { cn } from "@/lib/utils";

const FullscreenGameMode = dynamic(
  () =>
    import("@/components/game-studio/fullscreen-game-mode").then(
      (mod) => mod.FullscreenGameMode,
    ),
  { ssr: false },
);

type GamePreviewProps = {
  srcDoc: string;
  title: string;
  onRuntimeMessage?: (message: RuntimeMessage) => void;
  className?: string;
  howToPlay?: string[];
};

export function GamePreview({
  srcDoc,
  title,
  onRuntimeMessage,
  className,
  howToPlay = [],
}: GamePreviewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const handleRuntimeMessage = useEffectEvent((event: MessageEvent) => {
    if (event.data?.source !== "gibe-preview") {
      return;
    }

    onRuntimeMessage?.(event.data as RuntimeMessage);
  });

  useEffect(() => {
    function listener(event: MessageEvent) {
      handleRuntimeMessage(event);
    }

    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, []);

  function handleRefresh() {
    setIframeKey((prev) => prev + 1);
  }

  if (isFullscreen) {
    return (
      <FullscreenGameMode
        srcDoc={srcDoc}
        title={title}
        howToPlay={howToPlay}
        onClose={() => setIsFullscreen(false)}
      />
    );
  }

  return (
    <div className="relative">
      {/* Control Bar */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            leading={<RefreshCw className="size-4" />}
            onClick={handleRefresh}
            title="Refresh preview"
          >
            Refresh
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            leading={<Maximize2 className="size-4" />}
            onClick={() => setIsFullscreen(true)}
            title="Fullscreen mode (F)"
          >
            Fullscreen
          </Button>
        </div>
      </div>

      {/* Preview Iframe */}
      <iframe
        key={iframeKey}
        title={title}
        sandbox="allow-scripts allow-pointer-lock"
        referrerPolicy="no-referrer"
        className={cn(
          "min-h-[400px] w-full rounded-[28px] border border-white/10 bg-[#050816] md:min-h-[520px]",
          className,
        )}
        srcDoc={srcDoc}
      />
    </div>
  );
}
