<script lang="ts">
  import { addTranslationToDeck, isAnkiAvailable } from '../lib/anki';
  import { NotificationKind } from './Notification.svelte';
  import type { ContextoTranslettoSentence } from '../lib/translate';
  import browser from 'webextension-polyfill';
  import { navigate } from './stores/navigationStore';

  export let sentenceToTranslate: ContextoTranslettoSentence;
  export let showNotification: (title: string, content: string, type: NotificationKind, duration_ms?: number) => void;

  // eslint-disable-next-line no-undef
  let ankiDroidIconUrl = browser.runtime.getURL('images/ankidroid-icon.png');
  // eslint-disable-next-line no-undef
  const googleTranslateIconUrl = browser.runtime.getURL('images/google-translate-icon.png');
  const wordToTranslate = sentenceToTranslate.selectedPhrase;

  let isTranslated = false;
  let ankiAddButtonEnable = true;
  let translatedSentence: ContextoTranslettoSentence;

  translate();

  async function translate() {
    try {
      translatedSentence = await sentenceToTranslate.get_translated();
      isTranslated = true;
    } catch (err) {
      console.error(err);
      showNotification('Failed to translate', err.toString(), NotificationKind.ERROR);
    }
  }

  function openGoogleTranslate() {
    const url = `https://translate.google.com/?sl=auto&tl=pl&text=${wordToTranslate}&op=translate`;
    window.open(url, '_blank');
  }

  async function ankiAddCard() {
    const foreignLanguage = 'en';
    if (!isTranslated) {
      showNotification('Translation not available', 'Please wait for the translation to finish', NotificationKind.ERROR);
      return;
    }

    ankiAddButtonEnable = false;
    const ankiDroidIconUrlCopy: string = ankiDroidIconUrl;
    ankiDroidIconUrl = browser.runtime.getURL('images/loader.svg');

    try {
      // At this point we are sure that the translation is available
      await addTranslationToDeck(sentenceToTranslate, translatedSentence, foreignLanguage);
      ankiDroidIconUrl = browser.runtime.getURL('images/check-mark-icon.svg');
    } catch (err) {
      if (!await isAnkiAvailable()) {
        showNotification(
          'Anki or anki-connect not available',
          'Please try starting AnkiDroid or install anki-connect plugin',
          NotificationKind.ERROR,
        );
        navigate('/anki-not-available');
        return;
      }

      console.error(err);
      showNotification('Failed to add anki card', err.toString(), NotificationKind.ERROR);
      ankiDroidIconUrl = ankiDroidIconUrlCopy;
      ankiAddButtonEnable = true;
    }
  }
</script>

<p class="subtitle">Sentence to translate:</p>
<p class="translation">{sentenceToTranslate.leftSide}<span>{wordToTranslate}</span>{sentenceToTranslate.rightSide}</p>

<p class="subtitle">Translation:</p>
{#if (isTranslated)}
  <p class="translation">{translatedSentence.leftSide}
    <span>{translatedSentence.selectedPhrase}</span>{translatedSentence.rightSide}</p>
{:else}
  <p class="translation">Translating...</p>
{/if}

<hr>

<aside>
  <button on:click={ankiAddCard} disabled="{!(ankiAddButtonEnable && isTranslated)}" class="btn" id="anki-add"
          style="--iconUrl: url({ankiDroidIconUrl});">Add to Anki
  </button>
  <button on:click={openGoogleTranslate} class="btn" style="--iconUrl: url({googleTranslateIconUrl});">See more
    meanings
  </button>
</aside>

<style lang="scss">
  @use "src/assets/css/variables";

  .btn {
    display: flex;
    align-items: center;
    padding: 0 5px;
    border: 1px solid variables.$popup-modal-bg-color;
    border-radius: 5px;
    color: #ededed;
    background-color: rgb(50, 50, 50, 0.7);
  }

  .btn:not(:disabled):hover {
    background-color: rgba(97, 97, 97, 0.7);
  }

  .btn::before {
    display: inline-block;
    content: '';
    background-image: var(--iconUrl);
    margin-right: 5px;
    background-size: contain;
    width: 20px;
    height: 20px;
  }

  aside {
    margin: 10px 0 0;
    gap: 15px;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
  }

  * {
    font-family: sans-serif;
  }

  hr {
    margin: 10px 0 0;
    border: 0;
    border-top: 1px solid variables.$popup-modal-bg-color;
  }

  p {
    margin: 0;
    padding: 0;
    font-size: 1rem;
    color: #333;
  }

  .subtitle {
    margin-top: 10px;
    font-size: 0.8rem;
    font-weight: 600;
    color: #666;
  }

  .translation > span {
    font-weight: 600;
    color: #333;
  }
</style>
