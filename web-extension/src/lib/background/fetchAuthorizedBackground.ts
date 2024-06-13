import { getJWTToken } from '../auth';
import { BACKEND_URL } from '../../env';

export async function fetchAuthorized<T>(endpoint: string, body?: Record<string, unknown>, options?: RequestInit): Promise<T> {
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
