import browser from 'webextension-polyfill';

export class KnownLanguage {
  public name: string;
  public level: string;
  
  public async save() {
    const knownLanguages = await browser.storage.local.get('SettingsStore.knownLanguages');
    if(knownLanguages['SettingsStore.knownLanguages']) {
      let settingsStore = await browser.storage.local.get('SettingsStore.knownLanguages');
      settingsStore['SettingsStore.knownLanguages'].push(this);
    }
    
    await browser.storage.local.set({
      'SettingsStore.knownLanguages': [this]
    });
  }
}

export class SettingsStore {
  public knownLanguages: KnownLanguage[];
  
  constructor() {
    
  }
  
  public async save() {
    await browser.storage.local.set({
      knownLanguages: this.knownLanguages
    });
  }
}

let settingsStore: SettingsStore | null = null;

export async function getSettingsStore(): Promise<SettingsStore> {
  throw new Error('Not implemented');
}
