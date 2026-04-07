"use client";

import { useEffect, useEffectEvent } from "react";

import type { RuntimeMessage } from "@/lib/types";
import { cn } from "@/lib/utils";

type GamePreviewProps = {
  srcDoc: string;
  title: string;
  onRuntimeMessage?: (message: RuntimeMessage) => void;
  className?: string;
};

export function GamePreview({
  srcDoc,
  title,
  onRuntimeMessage,
  className,
}: GamePreviewProps) {
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

  return (
    <iframe
      title={title}
      sandbox="allow-scripts allow-pointer-lock"
      referrerPolicy="no-referrer"
      className={cn(
        "min-h-[520px] w-full rounded-[28px] border border-white/10 bg-[#050816]",
        className,
      )}
      srcDoc={srcDoc}
    />
  );
}
