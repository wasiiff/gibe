import { cn } from "@/lib/utils";

type BadgeProps = {
  className?: string;
  children: React.ReactNode;
};

export function Badge({ className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600",
        className,
      )}
    >
      {children}
    </span>
  );
}
