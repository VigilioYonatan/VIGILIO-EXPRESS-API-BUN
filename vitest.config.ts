import path from "node:path";
import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [swc.vite()],
    resolve: {
        alias: {
            "@": path.resolve(import.meta.dir, "src", "services"),
            "~": path.resolve(import.meta.dir, "src"),
        },
    },
    test: {
        include: ["./src/**/*.test.ts"],
    },
});
