import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['test/**/*.test.js'],
    globals: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'html'],
      include: ['ValidateForm.js', 'VerifyUtils.js'],
      thresholds: {
        lines: 85,
        functions: 85,
        branches: 70,
        statements: 85,
      },
    },
  },
});
