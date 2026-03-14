import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: ['./index.ts'],
    format: ['esm'],
    clean: true,
    dts: true,
    outDir: 'dist',
    // Use .js extension for ESM if possible, or just stay with default if it's easier.
    // Rolldown/tsdown often uses .mjs for ESM by default.
});
