"use client";

import { CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";

type Step = {
  number: number;
  label: string;
  completed?: boolean;
  active?: boolean;
};

type StepIndicatorProps = {
  steps: Step[];
  className?: string;
};

export function StepIndicator({ steps, className }: StepIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center gap-2">
          {/* Step Circle */}
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300",
                step.active
                  ? "border-cyan-400 bg-cyan-400/20 text-cyan-200"
                  : step.completed
                    ? "border-emerald-400 bg-emerald-400/20 text-emerald-200"
                    : "border-white/20 bg-white/5 text-slate-500",
              )}
            >
              {step.completed ? (
                <CheckCircle2 className="size-4" />
              ) : (
                <span className="text-xs font-bold">{step.number}</span>
              )}
            </div>
            <span
              className={cn(
                "text-xs font-medium transition-colors",
                step.active
                  ? "text-cyan-200"
                  : step.completed
                    ? "text-emerald-200"
                    : "text-slate-500",
              )}
            >
              {step.label}
            </span>
          </div>

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div
              className={cn(
                "h-px w-8 transition-colors",
                step.completed ? "bg-emerald-400/40" : "bg-white/10",
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
