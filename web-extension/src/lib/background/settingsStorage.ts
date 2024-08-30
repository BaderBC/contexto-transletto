import { constants } from '../rust-common-binding';
import { getDb } from '../rxdb';
import type { SettingsDocument } from '../rxdb/settingsSchema';

export async function upsertKnownLanguage(name: string, level: string) {
  if (!constants.LANGUAGES_LEVELS.includes(level)) {
    throw new Error('Invalid language level');
  }
  if (!constants.SUPPORTED_LANGUAGES.includes(name)) {
    throw new Error('Invalid language');
  }

  await initializeDefaultSettings();

  const db = await getDb();
  const settings = await db.settings.findOne().exec();

  for (let i = 0; i < settings.knownLanguages.length; i++) {
    if (settings.knownLanguages[i].name !== name) continue;
    settings.knownLanguages[i].level = level;

    await settings.save();
    return;
  }

  settings.knownLanguages.push({ name, level });
  await settings.save();
}

export async function removeKnownLanguage(name: string) {
  await initializeDefaultSettings();

  const db = await getDb();
  const settings = await db.settings.findOne().exec();

  settings.knownLanguages = settings.knownLanguages.filter(lang => lang.name !== name);
  await settings.save();
}

export async function getSettings(): Promise<SettingsDocument> {
  await initializeDefaultSettings();

  const db = await getDb();
  const res = await db.settings.findOne().exec();

  if (res?.error) throw res.error;
  return res;
}

async function initializeDefaultSettings() {
  const db = await getDb();
  const settings = await db.settings.findOne().exec();
  
  if (settings) return;
  await db.settings.insert({ knownLanguages: [], id: '0' });
}
