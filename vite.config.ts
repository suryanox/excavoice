import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  build: {
    target: "es2020",
    outDir: "extension",
    emptyOutDir: false,
    lib: {
      entry: "src/content.tsx",
      formats: ["iife"],
      name: "xcv",
      fileName: () => "content.js",
    },
  },
});
