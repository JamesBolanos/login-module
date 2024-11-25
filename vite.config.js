import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()], // Ensure only the relevant plugin is included
	test: {
		globals: true,
		environment: 'jsdom', // Use 'jsdom' for browser-like testing environment
		coverage: {
			reporter: ['text', 'lcov'], // Optional: Add coverage reporting
		},
	},
});
