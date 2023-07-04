import typescript from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';
import pkg from './package.json' assert { type: 'json' };
import ts from 'typescript';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];
const input = "src/index.ts";

const plugins = [
  json({
    preferConst: true,
    compact: true,
  }),
  typescript({
    typescript: ts,
  }),
];
export default [
  {
    input,
    output: {
      file: pkg.module,
      format: 'esm',
      sourcemap: true,
    },
    plugins,
  },
  {
    input,
    output: {
      file: pkg.main,
      format: "cjs",
      sourcemap: true,
    },
    plugins,
  },
];