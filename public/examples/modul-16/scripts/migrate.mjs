import { isAbsolute } from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

const databasePath = process.env.DATABASE_PATH;
if (!databasePath || !isAbsolute(databasePath)) {
  throw new Error("DATABASE_PATH rilis harus berupa path absolut.");
}
const sqlite = new Database(databasePath);
try {
  migrate(drizzle(sqlite), { migrationsFolder: "./drizzle" });
  console.log("Migrasi database selesai.");
} finally {
  sqlite.close();
}
