import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [svelte()], 
	build: {
		rollupOptions: {
			input: "src/main_iife.js", 
			output: [
				{ format: "iife", dir: "bundle", entryFileNames: "bundle.js", name: "FuckingNexacro" }
			]
		}, 
		emptyOutDir: false
	}
});