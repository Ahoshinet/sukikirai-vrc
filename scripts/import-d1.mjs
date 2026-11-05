// Cloudflare D1 からのデータ移行（一度だけ実行する）。
//
//   1. 手元で: pnpm dlx wrangler d1 export sukikirai-vrc --remote --output d1.sql
//   2. VPS で（サービス停止中に）:
//        DATABASE_URL=file:/var/lib/sukikiraivrc/sukikirai.db \
//          node scripts/import-d1.mjs d1.sql
//
// ダンプを取り込んだあと、D1 側で適用済みだったマイグレーションを drizzle の
// __drizzle_migrations に記録する。次回のサーバー起動時には未適用分だけが流れる。
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { createClient } from "@libsql/client";

const dumpPath = process.argv[2];
const url = process.env.DATABASE_URL;
if (!dumpPath || !url) {
  console.error("usage: DATABASE_URL=file:/path/to.db node scripts/import-d1.mjs <dump.sql>");
  process.exit(1);
}

const migrationsDir =
  process.env.MIGRATIONS_DIR ||
  join(dirname(fileURLToPath(import.meta.url)), "..", "drizzle");

const client = createClient({ url, concurrency: 1, timeout: 10_000 });

const existing = await client.execute(
  "SELECT count(*) AS n FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'",
);
if (Number(existing.rows[0].n) > 0) {
  console.error("Target database is not empty. Refusing to import.");
  process.exit(1);
}

// ダンプはテーブル単位で INSERT されるので、取り込み中だけ外部キー検査を止める
const dump = readFileSync(dumpPath, "utf8");
await client.executeMultiple(`PRAGMA foreign_keys = OFF;\n${dump}\nPRAGMA foreign_keys = ON;`);

const violations = await client.execute("PRAGMA foreign_key_check");
if (violations.rows.length > 0) {
  console.warn(`warning: ${violations.rows.length} foreign key violations in imported data`);
}

const applied = new Set(
  (await client.execute("SELECT name FROM d1_migrations")).rows.map((r) =>
    String(r.name).replace(/\.sql$/, ""),
  ),
);

const journal = JSON.parse(
  readFileSync(join(migrationsDir, "meta", "_journal.json"), "utf8"),
);

await client.execute(`CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
  id SERIAL PRIMARY KEY,
  hash text NOT NULL,
  created_at numeric
)`);

for (const entry of journal.entries) {
  if (!applied.has(entry.tag)) {
    continue;
  }
  const sql = readFileSync(join(migrationsDir, `${entry.tag}.sql`)).toString();
  const hash = createHash("sha256").update(sql).digest("hex");
  await client.execute({
    sql: 'INSERT INTO "__drizzle_migrations" ("hash", "created_at") VALUES (?, ?)',
    args: [hash, entry.when],
  });
  console.log(`marked ${entry.tag} as applied`);
}

await client.execute("DROP TABLE IF EXISTS d1_migrations");
await client.execute("PRAGMA journal_mode = WAL");
client.close();
console.log("done. Start the service to apply the remaining migrations.");
