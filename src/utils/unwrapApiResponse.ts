/**
 * Extrai dados de respostas da API que estão envolvidas em { data: {...} }
 * devido ao TransformInterceptor do NestJS
 */
export function unwrapApiResponse<T>(response: any): T {
  return (response.data as any)?.data || response.data;
}

