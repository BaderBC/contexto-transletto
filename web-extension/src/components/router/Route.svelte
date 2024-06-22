<script lang="ts">
  import { currentPath } from './navigationStore';

  export let path: string;
</script>

{#if $currentPath === path}
  <slot />
{/if}
