import browser from 'webextension-polyfill';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace FetchAuthorized {
  export async function post<T>(endpoint: string, body?: Record<string, unknown>, options?: RequestInit): Promise<T> {
    return fetchAuthorized(endpoint, body, { ...options, method: 'POST' });
  }

  export async function get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return fetchAuthorized(endpoint, undefined, { ...options, method: 'GET' });
  }
}

export async function fetchAuthorized<T>(endpoint: string, body?: Record<string, unknown>, options?: RequestInit): Promise<T> {
  const res = await browser.runtime.sendMessage({ endpoint, body, options, action: 'fetchAuthorized' });
  if (res?.error) {
    throw res.error;
  }
  return res;
}
