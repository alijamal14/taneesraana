import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/",
  plugins: [tailwindcss()],
  build: { outDir: "dist", emptyOutDir: true, target: ["es2019", "safari13", "chrome80"], modulePreload: { polyfill: false } },
});
