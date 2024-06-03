<script lang="ts">
  import { SectionToShow } from './PopupModal.svelte';

  export let sectionToShow: SectionToShow;
  
  function returnToTranslationPage() {
    sectionToShow = SectionToShow.TRANSLATION;
  }
</script>

<p>Hi!<br/>Your anki-connect is not properly configured or anki desktop is not running.
  <br/>
  If you do not know how to configure it visit
  <a target="_blank" href="https://github.com/BaderBC/contexto-transletto/">this project repository</a>
  <br/>
  <br/>
  P.S. I hope in the future when you read this,<br/>
  contexto-transletto repository will have anki-connect configuration tutorial :)
</p>

<button on:click={returnToTranslationPage}>Return to translation page</button>
