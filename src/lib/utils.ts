import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// this function allows you to merge classnames
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
