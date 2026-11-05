import { eq } from "drizzle-orm";

import { getDb } from "../db/client";
import { kvStore } from "../db/schema";

// Workers KV 互換の最小限の API。期限切れの値は読み出し時に捨てる。
export async function kvGet(key: string): Promise<string | null> {
  const db = await getDb();
  const rows = await db
    .select()
    .from(kvStore)
    .where(eq(kvStore.key, key))
    .limit(1);
  const row = rows[0];
  if (!row) {
    return null;
  }
  if (row.expiresAt && row.expiresAt.getTime() <= Date.now()) {
    await db.delete(kvStore).where(eq(kvStore.key, key));
    return null;
  }
  return row.value;
}

export async function kvPut(
  key: string,
  value: string,
  options: { expirationTtl?: number } = {},
): Promise<void> {
  const expiresAt = options.expirationTtl
    ? new Date(Date.now() + options.expirationTtl * 1000)
    : null;
  const db = await getDb();
  await db
    .insert(kvStore)
    .values({ key, value, expiresAt })
    .onConflictDoUpdate({ target: kvStore.key, set: { value, expiresAt } });
}

export async function kvDelete(key: string): Promise<void> {
  const db = await getDb();
  await db.delete(kvStore).where(eq(kvStore.key, key));
}
