<script lang="ts">
  import TranslationSection from './TranslationSection.svelte';
  import Notification, { NotificationKind, NotificationType } from './Notification.svelte';
  import { Sleep } from '../lib/utils';
  import AnkiNotAvailable from './AnkiNotAvailable.svelte';
  import type { ContextoTranslettoSentence } from '../lib/translate';
  import LoginSection from './login/LoginSection.svelte';
  import { isLoggedIn } from '../lib/auth';
  import SettingsSection from './settings/SettingsSection.svelte';
  import { onMount } from 'svelte';
  import Route from './Route.svelte';
  import { navigate } from './stores/navigationStore';

  export let sentenceToTranslate: ContextoTranslettoSentence;

  let headerContent = 'Contexto transletto';
  let notification: NotificationType = null;

  export function showNotification(title: string, content: string, kind: NotificationKind, duration_ms = 5000) {
    notification = new NotificationType(title, content, kind, duration_ms);

    Sleep.ms(duration_ms)
      .then(() => notification = null);
  }

  onMount(async () => {
    if (!await isLoggedIn()) {
      navigate('/login');
      return;
    }

    navigate('/settings');
  });
</script>

<section id="card">
  <div id="card-regular-content">
    <header>{headerContent}</header>
    <Route path="/">
      <TranslationSection {showNotification} {sentenceToTranslate} />
    </Route>
    <Route path="/settings">
      <SettingsSection bind:headerContent />
    </Route>
    <Route path="/anki-not-available">
      <AnkiNotAvailable />
    </Route>
    <Route path="/login">
      <LoginSection {showNotification} bind:headerContent />
    </Route>
    <Route path="/loading">
      <p>Loading...</p>
    </Route>
  </div>

  {#if (notification)}
    <Notification {notification} />
  {/if}
</section>

<style lang="scss">
  @use "src/assets/css/variables";

  header {
    margin: 0;
    padding: 0;
    font-size: 1.5rem;
    font-weight: 1000;
    color: #333;
  }

  #card-regular-content {
    padding: 15px;
  }

  #card-regular-content {
    background: variables.$popup-modal-bg-color;
  }

  #card {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(7px);
    -webkit-backdrop-filter: blur(7px);
    border: 2px solid variables.$popup-modal-bg-color;
  }
</style>
