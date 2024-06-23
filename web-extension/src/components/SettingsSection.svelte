<script lang="ts">
  import { onDestroy } from 'svelte';
  import { Badge } from '$lib/ui/badge';
  import './app.pcss';

  export let headerContent: string = undefined;
  const headerContentOriginal = headerContent;
  headerContent = 'Settings';

  const knownLanguages = [
    { pl: 'Native' },
    { en: 'B2' },
    { de: 'A1' },
  ];

  onDestroy(() => {
    headerContent = headerContentOriginal;
  });
</script>

<main>
  <h2>Known languages:</h2>
  <div id="known-languages">
    {#each knownLanguages as language}
      <Badge>{Object.keys(language)[0]}: {Object.values(language)[0]}</Badge>
    {/each}
  </div>
</main>

<style>
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
