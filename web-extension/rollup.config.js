import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import svelte from 'rollup-plugin-svelte';
import copy from 'rollup-plugin-copy';
import sveltePreprocess from 'svelte-preprocess';
import dotenv from 'dotenv';
import define from 'rollup-plugin-define';
import { string } from 'rollup-plugin-string';
import terser from '@rollup/plugin-terser';
import mergeConfig from 'rollup-merge-config';
import postcss from 'rollup-plugin-postcss';
import css from 'rollup-plugin-css-only';

const { parsed: dotEnvVariables } = dotenv.config();
const browser = process.env.BROWSER || 'firefox';
const isDevMode = (process.env.NODE_ENV || '').toLowerCase() !== 'production';

const frontEndEnv = {
  ...dotEnvVariables,
  BROWSER: browser,
  NODE_ENV: process.env.NODE_ENV,
};

/** @type {import('rollup').RollupOptions} */
const commonRollupConfig = {
  output: {
    dir: './dist',
    format: 'iife',
  },
  watch: {
    exclude: 'node_modules/**',
    include: [
      'src/**',
      'public/**',
      '.env',
    ],
  },
  plugins: [
    define({
      replacements: {
        // Brackets allows getting properties from object (e.g. process.env.NODE_ENV)
        'process.env': '(' + JSON.stringify(frontEndEnv) + ')',
      },
    }),
    string({
      include: '**/*.txt',
    }),
    typescript(),
    commonjs(),
    resolve({
      browser: true,
    }),
    svelte({
      emitCss: false,
      compilerOptions: {
        dev: isDevMode,
      },
      preprocess: sveltePreprocess(),
    }),
    postcss({
      extract: false,
      minimize: !isDevMode,
    }),
    css({
      output: false,
    }),
    copy({
      targets: [
        { src: 'public/images', dest: 'dist' },
        { src: 'public/popup.html', dest: 'dist' },
        { src: `public/${browser}_manifest.json`, dest: 'dist', rename: 'manifest.json' },
        { src: 'node_modules/webextension-polyfill/dist/browser-polyfill.min.js', dest: 'dist' },
      ],
    }),
  ],
};

/** @type {import('rollup').RollupOptions} */
let nodeEnvDependentConfig = {};

if (!isDevMode) {
  nodeEnvDependentConfig = {
    plugins: [terser()],
  };
}

const rollupConfig = mergeConfig(commonRollupConfig, nodeEnvDependentConfig);

/** @type {(import('rollup').RollupOptions)[]} */
export default [
  {
    input: './src/popup.ts',
    ...rollupConfig,
  },
  {
    input: `./src/background.ts`,
    ...rollupConfig,
  },
  {
    input: './src/scripts/translation_modal.ts',
    ...rollupConfig,
    output: {
      dir: './dist/scripts',
      format: 'iife',
    },
  },
];
