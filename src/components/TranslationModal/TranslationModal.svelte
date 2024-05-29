<script lang="ts">
  export let sentenceBeforeTheWord: string = 'Test sentence start ';
  export let sentenceAfterTheWord: string = ' end test sentence';
  export let wordToTranslate: string;

  // eslint-disable-next-line no-undef
  const ankiDroidIconUrl = browser.runtime.getURL('images/ankidroid-icon.png');
  // eslint-disable-next-line no-undef
  const googleTranslateIconUrl = browser.runtime.getURL('images/google-translate-icon.png');
  
  function openGoogleTranslate() {
    const url = `https://translate.google.com/?sl=auto&tl=pl&text=${wordToTranslate}&op=translate`;
    window.open(url, '_blank');
  }
</script>

<section id="card">
  <header>Contexto transletto</header>
  <p class="subtitle">Sentence to translate:</p>
  <p class="translation">{sentenceBeforeTheWord}<span>{wordToTranslate}</span>{sentenceAfterTheWord}</p>

  <p class="subtitle">Translation:</p>
  <p class="translation">Przetłumaczona sentencja <span>{wordToTranslate}</span> i jej koniec</p>

  <hr>

  <aside>
    <button class="btn" id="anki-add" style="--iconUrl: url({ankiDroidIconUrl});">Add to Anki</button>
    <button on:click={openGoogleTranslate} class="btn" style="--iconUrl: url({googleTranslateIconUrl});">See more meanings</button>
  </aside>
</section>

<style lang="scss">
  $card-color: rgba(237, 237, 237, 0.4);
  
  .btn {
    display: flex;
    align-items: center;
    padding: 0 5px;
    border: 1px solid $card-color;
    border-radius: 5px;
    color: #ededed;
    background-color: rgb(50, 50, 50, 0.7);
  }
  
  .btn:hover {
    background-color: rgba(97, 97, 97, 0.7);
  }

  .btn::before{
    display: inline-block;
    content: '';
    background-image: var(--iconUrl);
    margin-right: 5px;
    background-size: contain;
    width: 20px;
    height: 20px;
  }

  aside {
    margin: 10px 0 0;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
  }

  * {
    font-family: sans-serif;
  }

  hr {
    margin: 10px 0 0;
    border: 0;
    border-top: 1px solid $card-color;
  }

  p {
    margin: 0;
    padding: 0;
    font-size: 1rem;
    color: #333;
  }

  .subtitle {
    margin-top: 10px;
    font-size: 0.8rem;
    font-weight: 600;
    color: #666;
  }

  .translation > span {
    font-weight: 600;
    color: #333;
  }

  header {
    margin: 0;
    padding: 0;
    font-size: 1.5rem;
    font-weight: 1000;
    color: #333;
  }

  #card {
    padding: 15px;
    background: $card-color;
    border-radius: 16px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(7px);
    -webkit-backdrop-filter: blur(7px);
    border: 1px solid $card-color;
  }
</style>
