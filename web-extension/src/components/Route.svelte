<script lang="ts">
  import { currentPath } from './stores/navigationStore';

  export let path: string;
</script>

{#if $currentPath === path}
  <slot />
{/if}
