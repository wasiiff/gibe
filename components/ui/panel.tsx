import { cn } from "@/lib/utils";

type PanelProps = {
  className?: string;
  children: React.ReactNode;
};

export function Panel({ className, children }: PanelProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-200 bg-white shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}
