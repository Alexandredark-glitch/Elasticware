import { defineConfig } from "vite";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
   publicDir: false,
  resolve: {
    alias: {
      "~": resolve(__dirname, "app"),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "app/widget/entry.ts"),
      name: "ElasticBotWidget",
      formats: ["iife"],
    },
    rollupOptions: {
      output: {
        entryFileNames: "widget.js",   
      },
    },
    outDir: "public",       
    emptyOutDir: false,     
  },
});