<script context="module" lang="ts">
  export interface KnownLanguage {
    name: string;
    level: string;
  }
</script>

<script lang="ts">
  import '../app.pcss';
  import { Label } from '$lib/ui/label';
  import Combobox from './Combobox.svelte';
  import { Button } from '$lib/ui/button';
  import { constants } from '../../lib/rust-common-binding';
  import { SettingsStorage } from '$lib/backgroundIntegration';

  export let namesOfSelectedLanguages: string[];
  export let knownLanguages: KnownLanguage[];
  export let resetSelection: () => void;

  const languageLevels = constants.LANGUAGES_LEVELS.map((l) => ({ label: l, value: l }));
  const supportedLanguages = constants.SUPPORTED_LANGUAGES.map((l) => ({ label: l, value: l }));
  let selectedLangName = '';
  let selectedLangLevel = '';
  
  async function deleteLang() {
    const promises = [];
    for (const langName of namesOfSelectedLanguages) {
      promises.push(SettingsStorage.removeKnownLanguage(langName));
    }
    
    await Promise.all(promises);
  }
  
  async function saveLang() {
    await SettingsStorage.upsertKnownLanguage(selectedLangName, selectedLangLevel);
  }
</script>

{#if (namesOfSelectedLanguages.length === 1)}
  {@const languageToEdit = knownLanguages.find((l) => l.name === namesOfSelectedLanguages[0])}

  <form class="mt-5">
    <Label>Language name: </Label>
    <Combobox bind:value={selectedLangName} defaultSelectedValue={languageToEdit.name} items={supportedLanguages} />

    <Label class="mt-3">Language level: </Label>
    <Combobox bind:value={selectedLangLevel} defaultSelectedValue={languageToEdit.level} items={languageLevels} />
  </form>
  <!-- Available only for editing one language -->
  <Button on:click={saveLang} class="bg-neutral-700 mt-4">Save</Button>
{:else}
  <Label class="mt-4">Selected {namesOfSelectedLanguages.length} languages</Label>
{/if}

<Button on:click={resetSelection} class="bg-neutral-500 mt-4">Reset</Button>
<Button on:click={deleteLang} variant="destructive">Delete</Button>
