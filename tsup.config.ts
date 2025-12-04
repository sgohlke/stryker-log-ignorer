import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/index.ts'],
    outDir: 'build',
    clean: true,
    target: ['es2022', 'node24'],
    format: ['cjs', 'esm'],
    dts: true,
    minify: false,
    sourcemap: true,
    splitting: true,
})
