import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['app/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
});