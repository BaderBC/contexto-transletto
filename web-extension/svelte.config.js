import sveltePreprocess from "svelte-preprocess";

export default {
  preprocess: sveltePreprocess(),
  kit: {
    "@/*": "./src/lib/svelte/*"
  }
};
