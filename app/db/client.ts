import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";

import * as schema from "./schema";

export type Database = ReturnType<typeof drizzle<typeof schema>>;

export async function getDb(): Promise<Database> {
  const { env } = await getCloudflareContext({ async: true });
  return drizzle(env.DB, { schema });
}

export async function getEnv() {
  const { env } = await getCloudflareContext({ async: true });
  return env;
}
