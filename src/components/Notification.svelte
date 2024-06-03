<script context="module" lang="ts">
  export enum NotificationKind {
    SUCCESS,
    ERROR
  }

  export class NotificationType {
    public title: string;
    public content: string;
    public kind: NotificationKind;
    public duration_ms: number;

    constructor(title: string, content: string, kind: NotificationKind, duration_ms = 3000) {
      this.title = title;
      this.content = content;
      this.kind = kind;
      this.duration_ms = duration_ms;
    }
  }
</script>

<script lang="ts">
  export let notification: NotificationType;

  const redBgColor = 'rgba(227, 30, 30, 0.4)';
  const greenBgColor = 'rgba(30, 227, 30, 0.4)';

  const bgColor = notification.kind === NotificationKind.ERROR ? redBgColor : greenBgColor;
  const createdTime = Date.now();
  let progress = 0;


  setInterval(() => {
    progress = (Date.now() - createdTime) / notification.duration_ms;
    if (progress > 1) {
      progress = 1;
    }
  }, 20);
</script>

<section style="--bg-color: {bgColor}">
  <div id="loader" style="--progress: {progress*100+'%'}"></div>
  <h1>{notification.title}</h1>
  <p>{notification.content}</p>
</section>

<style>
    section {
        background-color: var(--bg-color);
        position: relative;
        z-index: -1;
    }

    #loader {
        position: absolute;
        background-color: var(--bg-color);
        inset: 0;
        height: 100%;
        width: var(--progress);
        z-index: -2;
    }

    section p, h1 {
        color: whitesmoke;
        text-align: center;
        margin: 0 10px;
    }

    h1 {
        font-size: 25px;
    }

    p {
        font-style: italic;
    }
</style>
