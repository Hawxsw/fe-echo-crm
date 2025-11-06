interface ApiResponse<T> {
  data?: T | { data: T };
}

export function unwrapApiResponse<T>(response: unknown): T {
  if (typeof response !== 'object' || response === null) {
    throw new Error('Invalid API response format');
  }

  const apiResponse = response as ApiResponse<T>;

  if ('data' in apiResponse) {
    const data = apiResponse.data;
    if (data && typeof data === 'object' && 'data' in data) {
      return (data as { data: T }).data;
    }
    return data as T;
  }

  return response as T;
}
