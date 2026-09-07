/// <reference types="@cloudflare/workers-types" />

declare namespace Cloudflare {
  interface Env {
    DB: D1Database;
    KV: KVNamespace;
    NEXT_INC_CACHE_R2_BUCKET: R2Bucket;
    SITE_URL: string;
    BETTER_AUTH_SECRET: string;
    DISCORD_CLIENT_ID: string;
    DISCORD_CLIENT_SECRET: string;
    ANON_ID_SALT: string;
    ADMIN_DISCORD_IDS?: string;
    REPORT_WEBHOOK_URL?: string;
    VRCHAT_USERNAME?: string;
    VRCHAT_PASSWORD?: string;
    VRCHAT_TOTP_SECRET?: string;
  }
}

type CloudflareEnv = Cloudflare.Env;
