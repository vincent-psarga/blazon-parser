import { defineConfig } from 'vitest/config';
import { decks } from './demo/DeckPlugin.mjs';

export default defineConfig({
  // The decks are MDX, and a test that opens one has to be handed the same
  // thing the browser is handed: the demo's own config is not read from here.
  plugins: [decks()],
  test: {
    include: ['src/**/*.test.ts', 'demo/**/*.test.ts', 'demo/**/*.test.tsx'],
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
  },
});
