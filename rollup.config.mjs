import typescript from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import pkg from './package.json' assert { type: 'json' };
import ts from 'typescript';

const input = "src/index.ts";

const plugins = [
  json({
    preferConst: true,
    compact: true,
  }),
  typescript({
    typescript: ts,
  }),
  terser(),
];

export default {
  input,
  output: [
    {
      file: pkg.module,
      format: 'esm',
      sourcemap: true,
    },
    {
      file: pkg.main,
      format: "umd",
      sourcemap: true,
      name: 'dicopal',
    },
  ],
  plugins,
};
