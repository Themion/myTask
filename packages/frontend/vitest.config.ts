import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [{ find: '~', replacement: resolve(__dirname, 'src') }],
  },
  envDir: resolve(__dirname, '..', '..'),
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./setupTests.ts'],
    exclude: ['./src/common/*'],
    coverage: {
      provider: 'c8',
      reportsDirectory: './test/coverage',
      reporter: ['text', 'html'],
    },
  },
});
