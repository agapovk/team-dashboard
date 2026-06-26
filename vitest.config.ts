import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // Резолвит @/ и @/drizzle/ из tsconfig paths — без дублирования алиасов.
  plugins: [tsconfigPaths()],
  test: {
    // Колокация: *.test.ts рядом с модулем (CODE_STYLE.md §Тесты).
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
});
