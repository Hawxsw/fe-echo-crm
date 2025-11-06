import { IUser } from '@/types/user';

export function isArray<T>(value: unknown): value is T[] {
  return Array.isArray(value);
}

export function hasDataProperty<T>(
  value: unknown
): value is { data: T | T[] } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'data' in value &&
    (Array.isArray((value as { data: unknown }).data) ||
      typeof (value as { data: unknown }).data === 'object')
  );
}

export function isUserArray(value: unknown): value is IUser[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        'id' in item &&
        'email' in item &&
        'firstName' in item &&
        'lastName' in item
    )
  );
}

export function extractUsersFromResponse(
  response: unknown
): IUser[] {
  if (isUserArray(response)) {
    return response;
  }

  if (hasDataProperty<IUser[]>(response)) {
    const data = response.data;
    if (isUserArray(data)) {
      return data;
    }
  }

  return [];
}

