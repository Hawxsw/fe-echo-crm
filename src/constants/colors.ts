export const DEPARTMENT_LEVEL_COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-purple-100 text-purple-700',
  'bg-orange-100 text-orange-700',
  'bg-pink-100 text-pink-700',
  'bg-indigo-100 text-indigo-700',
] as const;

export const DEFAULT_DEPARTMENT_COLOR = '#3B82F6';

export const STATUS_COLORS = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-red-100 text-red-700',
  pending: 'bg-yellow-100 text-yellow-700',
} as const;

export function getDepartmentLevelColor(level: number): string {
  return DEPARTMENT_LEVEL_COLORS[level] || 'bg-gray-100 text-gray-700';
}

