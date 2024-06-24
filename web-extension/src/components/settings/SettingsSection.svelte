<script lang="ts">
  import { onDestroy } from 'svelte';
  import { badgeVariants } from '$lib/ui/badge';
  import '../app.pcss';
  import EditKnownLanguages, { type Language } from './EditKnownLanguages.svelte';

  export let headerContent: string = undefined;
  const headerContentOriginal = headerContent;
  headerContent = 'Settings';

  let knownLanguages: Language[] = [
    { pl: 'Native' },
    { en: 'B2' },
    { de: 'A1' },
  ];

  onDestroy(() => {
    headerContent = headerContentOriginal;
  });

  let namesOfSelectedLanguages: string[] = [];

  function updateSelectedLanguages() {
    namesOfSelectedLanguages = [];
    document.querySelectorAll('input[name="known-languages"]:checked').forEach((e) => {
      namesOfSelectedLanguages.push(e.id);
    });
  }
</script>

<main>
  <h2>Known languages:</h2>
  <div id="known-languages">
    {#each knownLanguages as language}
      {@const langName = Object.keys(language)[0].toUpperCase()}
      {@const langLevel = Object.values(language)[0].toUpperCase()}

      <input on:change={updateSelectedLanguages} class="hidden" type="checkbox" name="known-languages" id={langName}>
      <label for={langName} class="!text-white {badgeVariants()}">{langName}: {langLevel}</label>
    {/each}
  </div>
  {#if (namesOfSelectedLanguages.length > 0)}
    <EditKnownLanguages bind:knownLanguages {namesOfSelectedLanguages}/>
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
