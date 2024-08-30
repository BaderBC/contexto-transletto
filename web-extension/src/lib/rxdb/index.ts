// @ts-ignore
import { createRxDatabase, type RxDatabase } from 'rxdb';
// @ts-ignore
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
// @ts-ignore
import { addRxPlugin } from 'rxdb';
// @ts-ignore
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { type SettingsCollection, settingsSchema } from './settingsSchema';

const DB_NAME = 'contexto-transletto-db';
addRxPlugin(RxDBDevModePlugin);

export type DbCollections = {
  settings: SettingsCollection;
};

let db = null;

export async function getDb(): Promise<RxDatabase<DbCollections>> {
  if (db) return db;
  db = await createRxDatabase<DbCollections>({
    name: DB_NAME,
    storage: getRxStorageDexie(),
    ignoreDuplicate: false,
  });

  await db.addCollections({
    settings: {
      schema: settingsSchema,
    },
  });

  return db;
}
