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
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full border transition-all",
                step.active
                  ? "border-gray-900 bg-gray-900 text-white"
                  : step.completed
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 bg-gray-100 text-gray-400",
              )}
            >
              {step.completed ? (
                <CheckCircle2 className="size-3.5" />
              ) : (
                <span className="text-[10px] font-bold">{step.number}</span>
              )}
            </div>
            <span
              className={cn(
                "text-xs font-medium transition-colors",
                step.active
                  ? "text-gray-900"
                  : step.completed
                    ? "text-green-700"
                    : "text-gray-400",
              )}
            >
              {step.label}
            </span>
          </div>

          {index < steps.length - 1 && (
            <div
              className={cn(
                "h-px w-6 transition-colors",
                step.completed ? "bg-green-400" : "bg-gray-200",
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
