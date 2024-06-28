
<section id="card">
  <slot/>
  <div id="card-regular-content">
    <slot name="notification"/>
  </div>
</section>

<style lang="scss">
  @use "src/assets/css/variables";

  #card-regular-content {
    padding: 15px;
  }

  #card-regular-content {
    background: variables.$popup-modal-bg-color;
  }

  #card {
    min-width: 300px;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(7px);
    -webkit-backdrop-filter: blur(7px);
    border: 2px solid variables.$popup-modal-bg-color;
  }
</style>
