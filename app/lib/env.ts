// サーバー側の環境変数。Workers 時代の `env` バインディングと同じ形で扱えるようにしている。
export interface AppEnv {
  DATABASE_URL: string;
  SITE_URL: string;
  BETTER_AUTH_SECRET: string;
  DISCORD_CLIENT_ID: string;
  DISCORD_CLIENT_SECRET: string;
  ANON_ID_SALT: string;
  ADMIN_DISCORD_IDS?: string;
  REPORT_WEBHOOK_URL?: string;
  SENTRY_DSN?: string;
  SENTRY_ENVIRONMENT?: string;
  VRCHAT_USERNAME?: string;
  VRCHAT_PASSWORD?: string;
  VRCHAT_TOTP_SECRET?: string;
  CLIENT_IP_HEADER: string;
  CLIENT_COUNTRY_HEADER: string;
}

export const DEFAULT_DATABASE_URL = "file:data/sukikirai.db";

export function readEnv(): AppEnv {
  const e = process.env;
  return {
    DATABASE_URL: e.DATABASE_URL || DEFAULT_DATABASE_URL,
    SITE_URL: e.SITE_URL || "https://sukikiraivrc.com",
    BETTER_AUTH_SECRET: e.BETTER_AUTH_SECRET ?? "",
    DISCORD_CLIENT_ID: e.DISCORD_CLIENT_ID ?? "",
    DISCORD_CLIENT_SECRET: e.DISCORD_CLIENT_SECRET ?? "",
    ANON_ID_SALT: e.ANON_ID_SALT ?? "",
    ADMIN_DISCORD_IDS: e.ADMIN_DISCORD_IDS,
    REPORT_WEBHOOK_URL: e.REPORT_WEBHOOK_URL,
    SENTRY_DSN: e.SENTRY_DSN,
    SENTRY_ENVIRONMENT: e.SENTRY_ENVIRONMENT,
    VRCHAT_USERNAME: e.VRCHAT_USERNAME,
    VRCHAT_PASSWORD: e.VRCHAT_PASSWORD,
    VRCHAT_TOTP_SECRET: e.VRCHAT_TOTP_SECRET,
    CLIENT_IP_HEADER: (e.CLIENT_IP_HEADER || "cf-connecting-ip").toLowerCase(),
    CLIENT_COUNTRY_HEADER: (e.CLIENT_COUNTRY_HEADER || "cf-ipcountry").toLowerCase(),
  };
}
