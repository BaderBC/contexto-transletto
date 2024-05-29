<script lang="ts">
  import type { DayPeriod } from '../../type/index.type';

  export let period: DayPeriod = 'morning';

  // eslint-disable-next-line no-undef
  const imageSrc = browser.runtime.getURL(`images/${period}.png`);
  const imageUrl = `url(${imageSrc})`;
</script>

<div role="main" style={`background-image: ${imageUrl}`} class="root">
  <slot />
</div>

<style>
  .root {
    height: 100px;
    width: 240px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-size: cover;
    background-repeat: no-repeat;
  }
</style>
