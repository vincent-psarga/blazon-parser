import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts', 'demo/**/*.test.ts', 'demo/**/*.test.tsx'],
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
  },
});
