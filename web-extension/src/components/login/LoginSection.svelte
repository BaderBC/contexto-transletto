<script lang="ts">
  import { SectionToShow } from '../PopupModal.svelte';
  import GoogleLoginButton from './GoogleLoginButton.svelte';
  import type { NotificationKind } from '../Notification.svelte';

  export let sectionToShow: SectionToShow;
  export let headerContent: string;
  export let showNotification: (title: string, content: string, kind: NotificationKind, duration_ms?: number) => void;
  
  const headerContentDefault = 'Contexto transletto';
  headerContent = 'Login to extension';
  
  function onLoginSuccess() {
    headerContent = headerContentDefault;
    sectionToShow = SectionToShow.TRANSLATION;
  }
</script>

<section id="login-section">
  <p>To use this extension, you need to login with your Google account.</p>
  <div id="login-button">
    <GoogleLoginButton successCallback={onLoginSuccess} {showNotification} />
  </div>
</section>  

<style lang="scss">
  section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  
  #login-button {
    margin: 20px 0;
  }
  
  p {
    margin: 0;
  }
</style>
