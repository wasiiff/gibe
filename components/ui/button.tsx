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
    "border border-gray-900 bg-gray-900 text-white hover:bg-gray-800 hover:border-gray-800",
  secondary:
    "border border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50",
  ghost:
    "border-transparent bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-700",
  danger:
    "border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 hover:border-red-400",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-10 px-5 text-sm",
  lg: "h-11 px-6 text-base",
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
    "inline-flex items-center justify-center gap-2 rounded-lg border font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
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
    <button className={classes} {...props}>
      {leading}
      {children}
    </button>
  );
}
