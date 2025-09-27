import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseSearchParams(searchParams: URLSearchParams) {
  const params: Record<string, string> = {};
  
  for (const [key, value] of Array.from(searchParams.entries())) {
    params[key] = value;
  }
  
  return params;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('es-ES');
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}