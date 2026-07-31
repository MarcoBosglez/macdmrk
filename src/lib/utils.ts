import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Standard shadcn/ui helper: clsx() lets you pass conditional classes
// as objects/arrays ({ "bg-emerald": active }), tailwind-merge then
// resolves conflicts between them (e.g. two different "px-*" values)
// by keeping only the last one instead of sending both to the browser.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
