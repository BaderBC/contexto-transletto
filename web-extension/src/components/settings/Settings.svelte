<script lang="ts">
  import { badgeVariants } from '$lib/ui/badge';
  import '../app.pcss';
  import EditKnownLanguages, { type KnownLanguage } from './EditKnownLanguages.svelte';
  import { getContext } from 'svelte';

  export let knownLanguages: KnownLanguage[];
  
  let namesOfSelectedLanguages: string[] = [];
  const refreshSettingsData: () => Promise<void> = getContext('refreshSettingsData');

  function updateSelectedLanguages() {
    namesOfSelectedLanguages = [];
    document.querySelectorAll('input[name="known-languages"]:checked').forEach((e) => {
      namesOfSelectedLanguages.push(e.id);
    });
  }

  function resetSelection() {
    namesOfSelectedLanguages = [];
    document.querySelectorAll('input[name="known-languages"]:checked').forEach((e: HTMLInputElement) => {
      e.checked = false;
    });
  }
</script>

<main>
  <h2>Known languages:</h2>
  <div id="known-languages">
    {#each knownLanguages as language}
      <input on:change={updateSelectedLanguages} class="hidden" type="checkbox" name="known-languages"
             id={language.name} />
      <label for={language.name} class="!text-white {badgeVariants()}">{language.name}: {language.level}</label>
    {/each}
  </div>
  {#if (namesOfSelectedLanguages.length > 0)}
    <EditKnownLanguages bind:knownLanguages {namesOfSelectedLanguages} {resetSelection} />
  {:else}
    <!-- Here we will put form for adding a new languages -->
  {/if}
</main>

<style lang="postcss">
    input[type="checkbox"]:checked + label {
        border: white solid 2px;
        outline: black solid 2px;
        box-sizing: border-box;
    }

    main * {
        color: #333;
    }

    #known-languages {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }

    h2 {
        margin: 15px 0;
        font-size: 1.25rem;
    }
</style>
