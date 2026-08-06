import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: {
    alias: {
      '@dnd/engine': fileURLToPath(new URL('./packages/engine/src/index.ts', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    include: ['packages/**/*.test.ts', 'src/**/*.test.ts'],
    environment: 'node',
  },
});
