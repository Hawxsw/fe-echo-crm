import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utilitário para combinar classes CSS de forma inteligente.
 * 
 * Combina clsx para concatenação condicional com tailwind-merge
 * para resolver conflitos de classes do Tailwind.
 * 
 * @example
 * ```tsx
 * cn('text-red-500', 'text-blue-500') // => 'text-blue-500'
 * cn('px-4', condition && 'px-8') // => 'px-8' (se condition = true)
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

