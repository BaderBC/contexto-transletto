// @ts-ignore
import type { type RxCollection, RxDocument, RxJsonSchema } from 'rxdb';
import type { FromSchema } from 'json-schema-to-ts';

const settingsSchemaLiteral = {
  version: 0,
  type: 'object',
  required: ['knownLanguages'],
  primaryKey: 'id',

  properties: {
    id: { type: 'string', maxLength: 100 },
    knownLanguages: {
      type: 'array',
      items: {
        type: 'object',
        required: ['name', 'level'],
        properties: {
          name: { type: 'string' },
          level: { type: 'string' },
        },
      },
    },
  },
} as const;

export type SettingsSchema = FromSchema<typeof settingsSchemaLiteral>;
export type SettingsCollection = RxCollection<SettingsSchema>;
export type SettingsDocument = RxDocument<SettingsSchema>;

export const settingsSchema: RxJsonSchema<SettingsSchema> = settingsSchemaLiteral;
