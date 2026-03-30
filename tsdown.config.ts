import { defineConfig } from 'tsdown'

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  clean: true,
  dts: true,
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  minify: false,
  outDir: 'build',
  sourcemap: true,
  target: ['es2022', 'node24'],
})
