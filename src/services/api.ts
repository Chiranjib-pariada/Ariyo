import { offlineStorage } from './offlineStorage';

const TOKEN_KEY = 'ariyo_auth_token';

export class ApiError extends Error {
  constructor(public status: number, message: string, public errors: any[] = []) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  cacheKey?: string
): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const isGet = !options.method || options.method.toUpperCase() === 'GET';

  // If client is offline and it's a GET request with cacheKey, try cache immediately
  if (typeof navigator !== 'undefined' && !navigator.onLine && isGet && cacheKey) {
    const cached = offlineStorage.get<T>(cacheKey);
    if (cached !== null) {
      return cached;
    }
  }

  try {
    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new ApiError(
        response.status,
        data.message || `Request failed with status ${response.status}`,
        data.errors
      );
    }

    // Cache successful GET requests
    if (isGet && cacheKey && data.data !== undefined) {
      offlineStorage.save(cacheKey, data.data);
    }

    return (data.data !== undefined ? data.data : data) as T;
  } catch (err: any) {
    // If network failure or offline, try to fallback to cache for GET requests
    if (isGet && cacheKey) {
      const cached = offlineStorage.get<T>(cacheKey);
      if (cached !== null) {
        return cached;
      }
    }
    throw err;
  }
}

export const api = {
  get: <T>(endpoint: string, cacheKey?: string) => request<T>(endpoint, { method: 'GET' }, cacheKey),
  post: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),
  put: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};
