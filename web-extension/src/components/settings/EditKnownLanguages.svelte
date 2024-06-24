<script context="module" lang="ts">
  export interface Language {
    [key: string]: string;
  }
</script>

<script lang="ts">
  export let namesOfSelectedLanguages: string[];
  export let knownLanguages: Language[];
</script>

{#if (knownLanguages.length == 1)}
  <form>
    
  </form>
{:else}
  <!-- TODO -->
{/if}
