import { randomBytes, randomUUID } from "node:crypto";
import { defineConfig, devices } from "@playwright/test";

const origin = "http://localhost:3100";
const databasePath = `./.e2e/${randomUUID()}.db`;

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.spec.ts",
  workers: 1,
  retries: 0,
  use: {
    baseURL: origin,
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command:
      "node e2e/prepare-db.mjs && npm run build && npm run start -- --port 3100",
    url: `${origin}/login`,
    reuseExistingServer: false,
    stdout: "pipe",
    timeout: 180_000,
    env: {
      DATABASE_PATH: databasePath,
      BETTER_AUTH_URL: origin,
      BETTER_AUTH_SECRET: randomBytes(32).toString("hex"),
    },
  },
});
