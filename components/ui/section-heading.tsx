import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-4",
        className,
      )}
    >
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-gray-400">
          {eyebrow}
        </p>
        <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-[0.06em] text-gray-900 md:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 max-w-lg text-sm leading-6 text-gray-500">
            {description}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
