import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import { createRequire } from 'module';

const input = "src/index.ts";
const require = createRequire(import.meta.url);
const pkg = require('./package.json');

const plugins = [
  nodeResolve(),
  json({
    preferConst: true,
    compact: true,
  }),
  typescript({
    tsconfig: './tsconfig.json',
    declarationDir: './dist'
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
