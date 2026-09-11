import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// clsx (conditional classes) + tailwind-merge (last of any conflicting
// utilities wins).
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
