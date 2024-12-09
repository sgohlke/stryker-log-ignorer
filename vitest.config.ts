import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        coverage: {
            exclude: ['build', 'tests', 'tsup.config.ts', 'vitest.config.ts'],
            provider: 'v8',
            reporter: ['text'],
        },
        exclude: ['node_modules', 'build', '.idea', '.git', '.cache'],
    },
})
