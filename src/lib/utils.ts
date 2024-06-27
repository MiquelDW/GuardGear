// clsx is a utility for constructing className strings conditionally. It takes in various arguments (which can be strings, objects, arrays, etc.) and combines them into a single string of class names
// clsx(inputs): Combines the class names from 'inputs' into a single string
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// this function allows you to merge classnames
export function cn(...inputs: ClassValue[]) {
  // twMerge ensures that later classes in the list take precedence over the earlier ones when there are tailwind classname conflicts
  return twMerge(clsx(inputs));
}
