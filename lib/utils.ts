import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeDate(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);
  const delta = Date.now() - date.getTime();
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (delta < hour) {
    return `${Math.max(1, Math.floor(delta / minute))}m ago`;
  }

  if (delta < day) {
    return `${Math.floor(delta / hour)}h ago`;
  }

  return `${Math.floor(delta / day)}d ago`;
}

export function truncate(value: string, length: number) {
  if (value.length <= length) {
    return value;
  }

  return `${value.slice(0, length - 1)}…`;
}

