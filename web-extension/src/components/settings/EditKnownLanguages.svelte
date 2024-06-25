<script context="module" lang="ts">
  export interface Language {
    [key: string]: string;
  }
</script>

<script lang="ts">
  import '../app.pcss';
  import { Input } from '$lib/ui/input';
  import { Label } from '$lib/ui/label';
  import Combobox from './Combobox.svelte';
  import { LANGUAGE_LEVELS, SUPPORTED_LANGUAGES } from './constants';
  import { Button } from '$lib/ui/button';

  export let namesOfSelectedLanguages: string[];
  export let knownLanguages: Language[];

  const languageLevels = LANGUAGE_LEVELS.map((l) => ({ label: l, value: l }));
  const supportedLanguages = SUPPORTED_LANGUAGES.map((l) => ({ label: l, value: l }));
</script>

{#if (namesOfSelectedLanguages.length === 1)}
  {@const languageToEdit = knownLanguages.find((l) =>
    Object.keys(l)[0].toLowerCase() === namesOfSelectedLanguages[0].toLowerCase()
  )}
  {@const langName = Object.keys(languageToEdit)[0]}
  {@const langLevel = Object.values(languageToEdit)[0]}

  <form class="mt-5">
    <Label>Language name: </Label>
    <Combobox defaultSelectedValue={langName} items={supportedLanguages} />

    <Label class="mt-3">Language level: </Label>
    <Combobox defaultSelectedValue={langLevel} items={languageLevels} />
  </form>
  <!-- Available only for editing one language -->
  <Button class="bg-neutral-700 mt-4">Save</Button>
{:else}
  <Label class="mt-4">Selected {namesOfSelectedLanguages.length} languages</Label>
{/if}

<Button variant="destructive">Delete</Button>
