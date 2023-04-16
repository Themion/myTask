import { defineConfig } from "vitest/config";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [{ find: "~", replacement: resolve(__dirname, "src") }],
  },
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./setupTests.ts"],
    exclude: ["./src/common/*"],
    coverage: {
      provider: "c8",
      reportsDirectory: "./test/coverage",
      reporter: ["text", "html"],
    },
  },
});
