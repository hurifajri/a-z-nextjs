import { execSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";

// Jalankan dari root aplikasi. Config Playwright memberi path baru per run.
const databasePath = process.env.DATABASE_PATH;
if (!databasePath || !/^\.\/\.e2e\/[\da-f-]+\.db$/.test(databasePath)) {
  throw new Error("DATABASE_PATH harus berupa file test di ./.e2e/.");
}
if (existsSync(databasePath)) {
  throw new Error(
    "Database test sudah ada. Jalankan ulang Playwright untuk path baru.",
  );
}

mkdirSync(".e2e", { recursive: true });
// drizzle.config.ts harus membaca DATABASE_PATH seperti src/db/index.ts.
execSync("npx --no-install drizzle-kit migrate", { stdio: "inherit" });
