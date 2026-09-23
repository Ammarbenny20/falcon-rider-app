/**
 * Falcon Rider Admin Portal — Class Name Utility
 *
 * Merges Tailwind classes safely.
 * Handles conditional classes and resolves conflicts.
 *
 * @example
 * cn('px-2 py-1', 'px-4') // → 'py-1 px-4'
 * cn('text-red-500', isActive && 'text-blue-500') // → 'text-blue-500' when isActive
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}