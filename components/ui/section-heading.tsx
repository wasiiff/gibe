import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl space-y-3">
        <Badge>{eyebrow}</Badge>
        <div className="space-y-2">
          <h2 className="font-display text-3xl uppercase tracking-[0.08em] text-white md:text-4xl">
            {title}
          </h2>
          {description ? (
            <p className="max-w-xl text-sm leading-7 text-slate-300 md:text-base">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {action}
    </div>
  );
}

