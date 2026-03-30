import { defineConfig } from 'vitest/config'

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    coverage: {
      exclude: ['build', 'tests', 'tsdown.config.ts', 'vitest.config.ts'],
      provider: 'v8',
      reporter: ['text'],
    },
    exclude: ['node_modules', 'build', '.idea', '.git', '.cache'],
  },
})
