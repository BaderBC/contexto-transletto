import browser from 'webextension-polyfill';
import type * as SettingsSchema from '../rxdb/settingsSchema';

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

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace SettingsStorage {
  export type SettingsDocument = SettingsSchema.SettingsDocument;
  
  export async function upsertKnownLanguage(name: string, level: string): Promise<void> {
    // TODO: use sendAction instead
    const res = await browser.runtime.sendMessage({ name, level, action: 'settingsStorage.upsertKnownLanguage' });
    if(res?.error) throw new Error(res.error);
  }
  
  export async function removeKnownLanguage(name: string): Promise<void> {
    // TODO: use sendAction instead
    const res = await browser.runtime.sendMessage({ name, action: 'settingsStorage.removeKnownLanguage' });
    if(res?.error) throw new Error(res.error);
  }
  
  export async function getSettings(): Promise<SettingsDocument> {
    return await sendAction<SettingsDocument>('settingsStorage.getSettings');
  }
}

// TODO: move to a separate file
async function sendAction<T>(action: string, params = {}): Promise<T> {
  const res = await browser.runtime.sendMessage({ action, ...params });
  if(res?.error) throw new Error(res.error);
  return res;
}
