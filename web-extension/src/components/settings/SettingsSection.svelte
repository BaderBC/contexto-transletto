<script lang="ts">
  import { onDestroy, setContext } from 'svelte';
  import { SettingsStorage } from '$lib/backgroundIntegration';
  import Settings from './Settings.svelte';

  export let headerContent: string = undefined;
  const headerContentOriginal = headerContent;
  headerContent = 'Settings';

  // by default pending promise
  let settings: Promise<SettingsStorage.SettingsDocument> = new Promise(() => {});
  refreshSettingsData();
  
  setContext('refreshSettingsData', refreshSettingsData);
  async function refreshSettingsData() {
    settings = SettingsStorage.getSettings();
    await settings; // wait for the promise to resolve
  }

  onDestroy(() => {
    headerContent = headerContentOriginal;
  });
</script>


{#await settings}
  <!-- TODO: Add loading spinner -->
  <p>Loading...</p>
{:then settings}
  {@debug settings}
  <Settings knownLanguages={settings.knownLanguages} />
{:catch error}
  {@debug error}
  <p>{error.message}</p>
{/await}
