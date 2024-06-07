import { getJWTToken } from './auth';
import { BACKEND_URL } from '../../env';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace FetchAuthorized {
  export async function post<T>(endpoint: string, body?: Record<string, unknown>, options?: RequestInit): Promise<T> {
    return fetchAuthorized(endpoint, body, { ...options, method: 'POST' });
  }
  export async function get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return fetchAuthorized(endpoint, undefined, { ...options, method: 'GET' });
  }
}

async function fetchAuthorized<T>(endpoint: string, body?: Record<string, unknown>, options?: RequestInit): Promise<T> {
  const token = await getJWTToken();
  if (endpoint.startsWith('/')) {
    endpoint = endpoint.slice(1);
  }

  const res = await fetch(`${BACKEND_URL}/${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status} ${await res.text()}`);
  }

  return res.json();
}
