/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import summary from 'rollup-plugin-summary';
import {terser} from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import { rollupPluginHTML as html } from '@web/rollup-plugin-html';
import analyzer from 'rollup-plugin-analyzer';
import analyze from 'rollup-plugin-analyze';

export default {
    input: 'index.html',
  output: {
    //file: 'dist/bundle.js',
    format: 'esm',
    dir: 'dist',
  },
  onwarn(warning) {
    if (warning.code !== 'THIS_IS_UNDEFINED') {
      console.error(`(!) ${warning.message}`);
    }
  },
  plugins: [
     //analyze of the problem
     analyzer({
         stdout: true,
         summaryOnly: true,
     }),
     analyze(),
       
     // Entry point for application build
     html({
         input: ['index.html'],
          flattenOutput: false,
      }),


    replace({'Reflect.decorate': 'undefined'}),
    resolve(),
    /**
     * This minification setup serves the static site generation.
     * For bundling and minification, check the README.md file.
     */
    terser({
      ecma: 2021,
      module: true,
      warnings: true,
      mangle: {
        properties: {
          regex: /^__/,
        },
      },
    }),
    summary(),
  ],
};
