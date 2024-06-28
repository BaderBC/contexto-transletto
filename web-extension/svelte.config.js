import sveltePreprocess from "svelte-preprocess";

export default {
  preprocess: sveltePreprocess({
    postcss: true,
  }),
  kit: {
    "@/*": "./src/lib/svelte/*"
  }
};
