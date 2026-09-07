import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { headers } from "next/headers";

import { getDb, getEnv, type Database } from "../db/client";
import * as schema from "../db/schema";
import { log } from "./mutations";

function createAuth(db: Database, env: CloudflareEnv) {
  return betterAuth({
    baseURL: env.SITE_URL,
    secret: env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(db, { provider: "sqlite", schema }),
    socialProviders: {
      discord: {
        clientId: env.DISCORD_CLIENT_ID,
        clientSecret: env.DISCORD_CLIENT_SECRET,
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 90,
      updateAge: 60 * 60 * 24,
      cookieCache: { enabled: true, maxAge: 60 * 5 },
    },
    rateLimit: {
      enabled: true,
      window: 60,
      max: 30,
    },
    databaseHooks: {
      session: {
        create: {
          after: async (session) => {
            try {
              const h = await headers();
              await log(session.userId, "login", "session", session.id, {
                ip: session.ipAddress || "unknown",
                userAgent: session.userAgent ?? null,
                country: h.get("cf-ipcountry"),
              });
            } catch {
              // ログインの記録に失敗してもログイン自体は続行する
            }
          },
        },
      },
    },
    advanced: {
      cookiePrefix: "skv",
      ipAddress: {
        ipAddressHeaders: ["cf-connecting-ip", "x-forwarded-for"],
      },
    },
  });
}

type AuthInstance = ReturnType<typeof createAuth>;

let cached: AuthInstance | undefined;

export async function getAuth(): Promise<AuthInstance> {
  if (!cached) {
    cached = createAuth(await getDb(), await getEnv());
  }
  return cached;
}

export interface SessionUser {
  id: string;
  name: string;
  banned: boolean;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const auth = await getAuth();
  const result = await auth.api.getSession({ headers: await headers() });
  if (!result?.user) {
    return null;
  }
  const banned = Boolean((result.user as { banned?: boolean }).banned);
  return { id: result.user.id, name: result.user.name, banned };
}
