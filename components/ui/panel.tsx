import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Panel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-white/10 bg-[rgba(12,18,36,0.88)] shadow-[0_24px_80px_rgba(0,0,0,0.4)] backdrop-blur-xl",
        className,
      )}
      {...props}
    />
  );
}

