import type { ContextoTranslettoSentence } from './translate';

// eslint-disable-next-line @typescript-eslint/ban-types
export function invoke(action: string, version: number, params = {}): Promise<Object> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('error', () => reject('failed to issue request'));
    xhr.addEventListener('load', () => {
      try {
        const response = JSON.parse(xhr.responseText);
        if (Object.getOwnPropertyNames(response).length != 2) {
          throw 'response has an unexpected number of fields';
        }
        // eslint-disable-next-line no-prototype-builtins
        if (!response.hasOwnProperty('error')) {
          throw 'response is missing required error field';
        }
        // eslint-disable-next-line no-prototype-builtins
        if (!response.hasOwnProperty('result')) {
          throw 'response is missing required result field';
        }
        if (response.error) {
          throw response.error;
        }
        resolve(response.result);
      } catch (e) {
        reject(e);
      }
    });

    xhr.open('POST', 'http://127.0.0.1:8765');
    xhr.send(JSON.stringify({ action, version, params }));
  });
}

export async function ensureDeckIsCreated(foreignLanguage: string) {
  await invoke('createDeck', 6, {
    deck: `contexto-transletto::${foreignLanguage}`,
  });
}

export async function addTranslationToDeck(
  sentenceToTranslate: ContextoTranslettoSentence,
  sentenceTranslation: ContextoTranslettoSentence,
  foreignLanguage: string,
) {
  await ensureDeckIsCreated(foreignLanguage);
  await invoke('addNote', 6, {
    note: {
      deckName: `contexto-transletto::${foreignLanguage}`,
      modelName: 'Basic',
      fields: {
        Front: `Translate: <br>${sentenceToTranslate.joinMakingSelectedPhraseBold()}`,
        Back: `Correct translation: <br>${sentenceTranslation.joinMakingSelectedPhraseBold()}`,
      },
    },
  });
}

export async function isAnkiAvailable() {
  try {
    await invoke('version', 6);
    return true;
  } catch (_) {
    return false;
  }
}

