import { join } from "node:path";

import { migrate } from "drizzle-orm/libsql/migrator";

import { getDb } from "./client";

export async function runMigrations(): Promise<void> {
  const migrationsFolder =
    process.env.MIGRATIONS_DIR || join(process.cwd(), "drizzle");
  const db = await getDb();
  await migrate(db, { migrationsFolder });
}
