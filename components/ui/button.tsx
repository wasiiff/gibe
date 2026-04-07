import {
  cloneElement,
  isValidElement,
  type ButtonHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  leading?: ReactNode;
};

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "border-cyan-300/40 bg-linear-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-[0_16px_40px_rgba(77,226,255,0.28)] hover:from-cyan-300 hover:to-blue-400",
  secondary:
    "border-white/12 bg-white/6 text-white hover:border-cyan-300/30 hover:bg-white/10",
  ghost: "border-transparent bg-transparent text-slate-300 hover:bg-white/6 hover:text-white",
  danger:
    "border-rose-300/30 bg-rose-500/18 text-rose-100 hover:border-rose-300/45 hover:bg-rose-500/26",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export function Button({
  asChild = false,
  className,
  variant = "secondary",
  size = "md",
  leading,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full border font-medium transition-transform duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-55 hover:-translate-y-0.5 active:translate-y-0",
    variantStyles[variant],
    sizeStyles[size],
    className,
  );

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{
      className?: string;
      children?: ReactNode;
    }>;

    return cloneElement(child, {
      className: cn(classes, child.props.className),
      children: (
        <>
          {leading}
          {child.props.children}
        </>
      ),
    });
  }

  return (
    <button
      className={classes}
      {...props}
    >
      {leading}
      {children}
    </button>
  );
}
