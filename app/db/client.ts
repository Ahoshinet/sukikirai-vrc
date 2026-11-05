import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import { readEnv, type AppEnv } from "../lib/env";
import * as schema from "./schema";

export type Database = ReturnType<typeof drizzle<typeof schema>>;

// 開発時の HMR で接続が増えないよう globalThis に保持する
const globalForDb = globalThis as unknown as {
  __skvClient?: Client;
  __skvDb?: Database;
  __skvReady?: Promise<void>;
};

function ensureParentDir(url: string) {
  if (!url.startsWith("file:")) {
    return;
  }
  const path = url.startsWith("file://")
    ? fileURLToPath(url)
    : url.slice("file:".length);
  mkdirSync(dirname(path), { recursive: true });
}

export function getClient(): Client {
  if (!globalForDb.__skvClient) {
    const { DATABASE_URL } = readEnv();
    ensureParentDir(DATABASE_URL);
    const client = createClient({ url: DATABASE_URL, timeout: 5000 });
    globalForDb.__skvClient = client;
    // WAL はファイル単位で永続するので一度設定すればよい
    globalForDb.__skvReady = DATABASE_URL.startsWith("file:")
      ? client.execute("PRAGMA journal_mode = WAL").then(() => undefined)
      : Promise.resolve();
  }
  return globalForDb.__skvClient;
}

export async function getDb(): Promise<Database> {
  if (!globalForDb.__skvDb) {
    globalForDb.__skvDb = drizzle(getClient(), { schema });
  }
  await globalForDb.__skvReady;
  return globalForDb.__skvDb;
}

export async function getEnv(): Promise<AppEnv> {
  return readEnv();
}
