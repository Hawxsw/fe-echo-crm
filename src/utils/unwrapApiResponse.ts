export function unwrapApiResponse<T>(response: any): T {
  return (response.data as any)?.data || response.data;
}
