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
  import CardWrapper from '../CardWrapper.svelte';

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

<CardWrapper>
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
  
  {#if (notification)}
    <Notification slot="notification" {notification} />
  {/if}
</CardWrapper>

<style lang="scss">
  @use "src/assets/css/variables";

  header {
    margin: 0;
    padding: 0;
    font-size: 1.5rem;
    font-weight: 1000;
    color: #333;
  }
</style>
